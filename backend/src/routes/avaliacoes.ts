import { Router } from "express";
import { z } from "zod";
import { pool } from "../database/pool.js";
import { exigirAutenticacao, exigirTipos } from "../middleware/autenticacao.js";
import { horarioAtualEmSaoPaulo, partesDaData } from "../datas.js";

const esquemaAvaliacao = z.object({
  refeicaoId: z.number().int().positive(),
  servidoEm: z.iso.date(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().trim().max(500).optional().transform((value) => value || null),
});
const esquemaId = z.string().uuid();
const esquemaFiltros = z.object({
  inicio: z.iso.date().optional(),
  fim: z.iso.date().optional(),
  nota: z.coerce.number().int().min(1).max(5).optional(),
  periodo: z.enum(["manha", "almoco", "tarde"]).optional(),
});

async function validarRefeicaoNaData(refeicaoId: number, servidoEm: string, validarJanela = true) {
  const refeicao = await pool.query<{ data: string; periodo: "manha" | "almoco" | "tarde" }>(
    "SELECT data::text AS data, periodo FROM refeicoes WHERE id = $1",
    [refeicaoId],
  );
  if (!refeicao.rows[0]) return "Refeição não encontrada.";
  if (refeicao.rows[0].data !== servidoEm) return "A refeição não corresponde à data informada.";
  if (!validarJanela) return null;
  const hoje = partesDaData().dataIso;
  if (servidoEm > hoje) return "Refeições futuras ainda não podem ser avaliadas.";
  if (servidoEm < hoje) return "O prazo para avaliar esta refeição foi encerrado.";
  const minutosPorPeriodo = { manha: 10 * 60, almoco: 12 * 60, tarde: 15 * 60 };
  if (horarioAtualEmSaoPaulo() < minutosPorPeriodo[refeicao.rows[0].periodo]) {
    return "A avaliação ficará disponível após o horário da refeição.";
  }
  return null;
}

function montarFiltro(query: unknown) {
  const validacao = esquemaFiltros.safeParse(query);
  if (!validacao.success) return null;
  const condicoes: string[] = [];
  const valores: Array<string | number> = [];
  const adicionar = (sql: string, valor: string | number) => {
    valores.push(valor);
    condicoes.push(sql.replace("?", `$${valores.length}`));
  };
  if (validacao.data.inicio) adicionar("a.servido_em >= ?", validacao.data.inicio);
  if (validacao.data.fim) adicionar("a.servido_em <= ?", validacao.data.fim);
  if (validacao.data.nota) adicionar("a.nota = ?", validacao.data.nota);
  if (validacao.data.periodo) adicionar("r.periodo = ?", validacao.data.periodo);
  return { clausula: condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "", valores };
}

export const rotasAvaliacoes = Router();

rotasAvaliacoes.use(exigirAutenticacao);

rotasAvaliacoes.post("/", exigirTipos("aluno"), async (requisicao, resposta) => {
  const validacao = esquemaAvaliacao.safeParse(requisicao.body);

  if (!validacao.success) {
    resposta.status(400).json({ erro: "Avaliação inválida.", detalhes: validacao.error.flatten() });
    return;
  }

  const erroRefeicao = await validarRefeicaoNaData(validacao.data.refeicaoId, validacao.data.servidoEm);
  if (erroRefeicao) {
    resposta.status(erroRefeicao === "Refeição não encontrada." ? 404 : 400).json({ erro: erroRefeicao });
    return;
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO avaliacoes (usuario_id, refeicao_id, servido_em, nota, comentario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, refeicao_id AS "refeicaoId", servido_em AS "servidoEm", nota, comentario, criado_em AS "criadoEm"`,
      [requisicao.usuarioId, validacao.data.refeicaoId, validacao.data.servidoEm, validacao.data.nota, validacao.data.comentario],
    );
    resposta.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (typeof erro === "object" && erro && "code" in erro && erro.code === "23505") {
      resposta.status(409).json({ erro: "Esta refeição já foi avaliada por você." });
      return;
    }
    throw erro;
  }
});

rotasAvaliacoes.get("/minhas", exigirTipos("aluno"), async (requisicao, resposta) => {
  const resultado = await pool.query(
    `SELECT f.id, f.refeicao_id AS "refeicaoId", m.periodo AS "periodoRefeicao",
            f.servido_em AS "servidoEm", f.nota, f.comentario,
            f.criado_em AS "criadoEm"
     FROM avaliacoes f
     JOIN refeicoes m ON m.id = f.refeicao_id
     WHERE f.usuario_id = $1
     ORDER BY f.criado_em DESC`,
    [requisicao.usuarioId],
  );

  resposta.json(resultado.rows);
});

rotasAvaliacoes.get("/", exigirTipos("administrador", "cozinha"), async (requisicao, resposta) => {
  const filtro = montarFiltro(requisicao.query);
  if (!filtro) { resposta.status(400).json({ erro: "Filtros inválidos." }); return; }
  const resultado = await pool.query(
    `SELECT a.id, a.refeicao_id AS "refeicaoId", a.servido_em AS "servidoEm", a.nota,
            a.comentario, a.criado_em AS "criadoEm", u.nome AS "usuarioNome",
            r.periodo AS "periodoRefeicao", r.descricao AS "refeicaoDescricao"
     FROM avaliacoes a JOIN usuarios u ON u.id = a.usuario_id JOIN refeicoes r ON r.id = a.refeicao_id
     ${filtro.clausula} ORDER BY a.servido_em DESC, a.criado_em DESC`, filtro.valores);
  resposta.json(resultado.rows);
});

rotasAvaliacoes.get("/relatorios/periodos", exigirTipos("administrador", "cozinha"), async (requisicao, resposta) => {
  const filtro = montarFiltro(requisicao.query);
  if (!filtro) { resposta.status(400).json({ erro: "Filtros inválidos." }); return; }
  const resultado = await pool.query(
    `SELECT r.periodo, COUNT(*)::int AS quantidade, ROUND(AVG(a.nota)::numeric, 2)::float AS media,
            COUNT(*) FILTER (WHERE a.nota >= 4)::int AS positivas
     FROM avaliacoes a JOIN refeicoes r ON r.id = a.refeicao_id ${filtro.clausula}
     GROUP BY r.periodo ORDER BY r.periodo`, filtro.valores);
  resposta.json(resultado.rows);
});

rotasAvaliacoes.get("/relatorios/notas", exigirTipos("administrador", "cozinha"), async (requisicao, resposta) => {
  const filtro = montarFiltro(requisicao.query);
  if (!filtro) { resposta.status(400).json({ erro: "Filtros inválidos." }); return; }
  const conectorNota = filtro.clausula ? "AND" : "WHERE";
  const resultado = await pool.query(
    `SELECT serie.nota,
            (SELECT COUNT(*)::int FROM avaliacoes a JOIN refeicoes r ON r.id = a.refeicao_id
             ${filtro.clausula} ${conectorNota} a.nota = serie.nota) AS quantidade
     FROM generate_series(1, 5) AS serie(nota) ORDER BY serie.nota`, filtro.valores);
  resposta.json(resultado.rows);
});

rotasAvaliacoes.put("/:id", exigirTipos("administrador"), async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  const validacao = esquemaAvaliacao.safeParse(requisicao.body);
  if (!id.success || !validacao.success) { resposta.status(400).json({ erro: "Avaliação inválida." }); return; }
  const erroRefeicao = await validarRefeicaoNaData(validacao.data.refeicaoId, validacao.data.servidoEm, false);
  if (erroRefeicao) { resposta.status(erroRefeicao.includes("não encontrada") ? 404 : 400).json({ erro: erroRefeicao }); return; }
  try {
    const resultado = await pool.query(
      `UPDATE avaliacoes SET refeicao_id=$1, servido_em=$2, nota=$3, comentario=$4 WHERE id=$5
       RETURNING id, refeicao_id AS "refeicaoId", servido_em AS "servidoEm", nota, comentario, criado_em AS "criadoEm"`,
      [validacao.data.refeicaoId, validacao.data.servidoEm, validacao.data.nota, validacao.data.comentario, id.data]);
    if (!resultado.rows[0]) { resposta.status(404).json({ erro: "Avaliação não encontrada." }); return; }
    resposta.json(resultado.rows[0]);
  } catch (erro) {
    if (typeof erro === "object" && erro && "code" in erro && erro.code === "23505") { resposta.status(409).json({ erro: "Este usuário já avaliou essa refeição na data informada." }); return; }
    throw erro;
  }
});

rotasAvaliacoes.delete("/:id", exigirTipos("administrador"), async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  if (!id.success) { resposta.status(400).json({ erro: "Avaliação inválida." }); return; }
  const resultado = await pool.query("DELETE FROM avaliacoes WHERE id=$1 RETURNING id", [id.data]);
  if (!resultado.rows[0]) { resposta.status(404).json({ erro: "Avaliação não encontrada." }); return; }
  resposta.status(204).send();
});
