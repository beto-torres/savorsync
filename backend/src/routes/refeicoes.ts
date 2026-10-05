import { Router } from "express";
import { z } from "zod";
import { pool } from "../database/pool.js";
import { exigirAutenticacao, exigirTipos } from "../middleware/autenticacao.js";
import { normalizarUrlImagem } from "../lib/imagem.js";

const esquemaData = z.preprocess((valor) => {
  if (typeof valor !== "string") return valor;
  const data = valor.trim();
  const formatoBrasileiro = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  return formatoBrasileiro
    ? `${formatoBrasileiro[3]}-${formatoBrasileiro[2]}-${formatoBrasileiro[1]}`
    : data;
}, z.iso.date());

const esquemaRefeicao = z.object({
  data: esquemaData,
  periodo: z.enum(["manha", "almoco", "tarde"]),
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().min(3).max(500),
  imagemUrl: z.string().trim().max(2048).refine((valor) => {
    if (valor === "") return true;
    try {
      return new URL(valor).protocol === "https:";
    } catch {
      return false;
    }
  }, "Informe uma URL HTTPS válida.").optional(),
});

const esquemaId = z.coerce.number().int().positive();
const esquemaFiltros = z.object({
  data: esquemaData.optional(),
  periodo: z.enum(["manha", "almoco", "tarde"]).optional(),
  nome: z.string().trim().max(120).optional(),
  pagina: z.coerce.number().int().positive().optional(),
  limite: z.coerce.number().int().min(1).max(100).optional(),
});

const selecaoRefeicoes = `
  SELECT id, data::text AS data, periodo, nome,
         CASE periodo WHEN 'manha' THEN '10:00' WHEN 'almoco' THEN '12:00' ELSE '15:00' END AS "horarioServico",
         descricao, imagem_url AS "imagemUrl"
  FROM refeicoes
`;

export const rotasRefeicoes = Router();

function mensagemValidacaoRefeicao(erro: z.ZodError) {
  const campo = erro.issues[0]?.path[0];
  const mensagens: Record<string, string> = {
    data: "Informe uma data válida.",
    periodo: "Selecione um período válido.",
    nome: "O nome deve ter entre 2 e 120 caracteres.",
    descricao: "A descrição deve ter entre 3 e 500 caracteres.",
    imagemUrl: "Informe uma URL HTTPS válida com até 2048 caracteres.",
  };
  return typeof campo === "string" ? mensagens[campo] ?? "Dados da refeição inválidos." : "Dados da refeição inválidos.";
}

rotasRefeicoes.use(exigirAutenticacao);
rotasRefeicoes.use(exigirTipos("administrador", "cozinha"));

rotasRefeicoes.get("/", async (requisicao, resposta) => {
  const filtros = esquemaFiltros.safeParse(requisicao.query);
  if (!filtros.success) {
    resposta.status(400).json({ erro: "Filtros inválidos.", detalhes: filtros.error.flatten() });
    return;
  }
  const condicoes: string[] = [];
  const valores: string[] = [];
  const adicionar = (sql: string, valor: string) => { valores.push(valor); condicoes.push(sql.replace("?", `$${valores.length}`)); };
  if (filtros.data.data) adicionar("data = ?", filtros.data.data);
  if (filtros.data.periodo) adicionar("periodo = ?", filtros.data.periodo);
  if (filtros.data.nome) adicionar("nome ILIKE ?", `%${filtros.data.nome}%`);
  const clausulaOnde = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
  const usarPaginacao = filtros.data.pagina !== undefined || filtros.data.limite !== undefined;
  const pagina = filtros.data.pagina ?? 1;
  const limite = filtros.data.limite ?? 10;
  const paginacao = usarPaginacao ? `LIMIT ${limite} OFFSET ${(pagina - 1) * limite}` : "";
  const resultado = await pool.query(
    `${selecaoRefeicoes} ${clausulaOnde}
     ORDER BY CASE WHEN data >= CURRENT_DATE THEN 0 ELSE 1 END,
              CASE WHEN data >= CURRENT_DATE THEN data END ASC,
              CASE WHEN data < CURRENT_DATE THEN data END DESC,
              CASE periodo WHEN 'manha' THEN 1 WHEN 'almoco' THEN 2 ELSE 3 END
     ${paginacao}`,
    valores,
  );

  if (!usarPaginacao) {
    resposta.json(resultado.rows);
    return;
  }

  const totalResultado = await pool.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM refeicoes ${clausulaOnde}`,
    valores,
  );
  const total = totalResultado.rows[0]?.total ?? 0;
  resposta.json({
    dados: resultado.rows,
    pagina,
    limite,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / limite)),
  });
});

rotasRefeicoes.post("/", async (requisicao, resposta) => {
  const validacao = esquemaRefeicao.safeParse(requisicao.body);

  if (!validacao.success) {
    resposta.status(400).json({ erro: mensagemValidacaoRefeicao(validacao.error), detalhes: validacao.error.flatten() });
    return;
  }

  try {
    const imagemUrl = normalizarUrlImagem(validacao.data.imagemUrl);
    const resultado = await pool.query(
      `INSERT INTO refeicoes (data, periodo, nome, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, data::text AS data, periodo, nome,
                 CASE periodo WHEN 'manha' THEN '10:00' WHEN 'almoco' THEN '12:00' ELSE '15:00' END AS "horarioServico",
                 descricao, imagem_url AS "imagemUrl"`,
      [validacao.data.data, validacao.data.periodo, validacao.data.nome, validacao.data.descricao, imagemUrl],
    );
    resposta.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (typeof erro === "object" && erro && "code" in erro && erro.code === "23505") {
      resposta.status(409).json({ erro: "Já existe uma refeição desse período na data selecionada." });
      return;
    }
    throw erro;
  }
});

rotasRefeicoes.put("/:id", async (requisicao, resposta) => {
  const idValidado = esquemaId.safeParse(requisicao.params.id);
  const validacao = esquemaRefeicao.safeParse(requisicao.body);

  if (!idValidado.success || !validacao.success) {
    resposta.status(400).json({ erro: validacao.success ? "Refeição inválida." : mensagemValidacaoRefeicao(validacao.error) });
    return;
  }

  try {
    const imagemUrl = normalizarUrlImagem(validacao.data.imagemUrl);
    const resultado = await pool.query(
      `UPDATE refeicoes
       SET data = $1, periodo = $2, nome = $3, descricao = $4, imagem_url = $5
       WHERE id = $6
       RETURNING id, data::text AS data, periodo, nome,
                 CASE periodo WHEN 'manha' THEN '10:00' WHEN 'almoco' THEN '12:00' ELSE '15:00' END AS "horarioServico",
                 descricao, imagem_url AS "imagemUrl"`,
      [validacao.data.data, validacao.data.periodo, validacao.data.nome, validacao.data.descricao, imagemUrl, idValidado.data],
    );

    if (!resultado.rows[0]) {
      resposta.status(404).json({ erro: "Refeição não encontrada." });
      return;
    }

    resposta.json(resultado.rows[0]);
  } catch (erro) {
    if (typeof erro === "object" && erro && "code" in erro && erro.code === "23505") {
      resposta.status(409).json({ erro: "Já existe uma refeição desse período na data selecionada." });
      return;
    }
    throw erro;
  }
});

rotasRefeicoes.delete("/:id", async (requisicao, resposta) => {
  const idValidado = esquemaId.safeParse(requisicao.params.id);

  if (!idValidado.success) {
    resposta.status(400).json({ erro: "Refeição inválida." });
    return;
  }

  try {
    const resultado = await pool.query("DELETE FROM refeicoes WHERE id = $1 RETURNING id", [idValidado.data]);

    if (!resultado.rows[0]) {
      resposta.status(404).json({ erro: "Refeição não encontrada." });
      return;
    }

    resposta.status(204).send();
  } catch (erro) {
    if (typeof erro === "object" && erro && "code" in erro && erro.code === "23503") {
      resposta.status(409).json({ erro: "A refeição possui avaliações e não pode ser excluída." });
      return;
    }
    throw erro;
  }
});
