import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../database/pool.js";
import { exigirAdministrador, exigirAutenticacao } from "../middleware/autenticacao.js";

const tiposUsuario = ["administrador", "cozinha", "aluno"] as const;
const esquemaId = z.string().uuid();
const camposUsuario = {
  nome: z.string().trim().min(3).max(120),
  cpf: z.string().transform((valor) => valor.replace(/\D/g, "")).pipe(z.string().length(11)),
  telefone: z.string().trim().min(8).max(20),
  email: z.string().trim().toLowerCase().email().max(160),
  tipo: z.enum(tiposUsuario),
};
const esquemaCriacao = z.object({ ...camposUsuario, senha: z.string().min(6).max(72) });
const esquemaAtualizacao = z.object({ ...camposUsuario, senha: z.string().min(6).max(72).optional().or(z.literal("")) });

const selecaoUsuario = `
  SELECT id, nome, cpf, telefone, email, tipo, criado_em AS "criadoEm"
  FROM usuarios
`;

function erroDeUnicidade(erro: unknown) {
  if (typeof erro !== "object" || !erro || !("code" in erro) || erro.code !== "23505") return null;
  const restricao = "constraint" in erro ? String(erro.constraint) : "";
  return restricao.includes("cpf") ? "Já existe um usuário com este CPF." : "Já existe um usuário com este e-mail.";
}

export const rotasUsuarios = Router();
rotasUsuarios.use(exigirAutenticacao, exigirAdministrador);

rotasUsuarios.get("/recuperacoes-senha", async (_requisicao, resposta) => {
  const resultado = await pool.query(
    `SELECT s.id, s.usuario_id AS "usuarioId", u.nome, u.cpf, u.email,
            s.solicitado_em AS "solicitadoEm"
     FROM solicitacoes_recuperacao_senha s
     JOIN usuarios u ON u.id = s.usuario_id
     ORDER BY s.solicitado_em ASC`,
  );
  resposta.json(resultado.rows);
});

rotasUsuarios.post("/recuperacoes-senha/:id/ativar", async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  if (!id.success) {
    resposta.status(400).json({ erro: "Solicitação inválida." });
    return;
  }

  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    const solicitacao = await cliente.query<{ usuario_id: string; senha_hash: string }>(
      "SELECT usuario_id, senha_hash FROM solicitacoes_recuperacao_senha WHERE id = $1 FOR UPDATE",
      [id.data],
    );
    if (!solicitacao.rows[0]) {
      await cliente.query("ROLLBACK");
      resposta.status(404).json({ erro: "Solicitação não encontrada." });
      return;
    }
    await cliente.query("UPDATE usuarios SET senha_hash = $1 WHERE id = $2", [solicitacao.rows[0].senha_hash, solicitacao.rows[0].usuario_id]);
    await cliente.query("DELETE FROM solicitacoes_recuperacao_senha WHERE id = $1", [id.data]);
    await cliente.query("COMMIT");
    resposta.json({ mensagem: "Nova senha ativada com sucesso." });
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    cliente.release();
  }
});

rotasUsuarios.delete("/recuperacoes-senha/:id", async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  if (!id.success) {
    resposta.status(400).json({ erro: "Solicitação inválida." });
    return;
  }
  const resultado = await pool.query("DELETE FROM solicitacoes_recuperacao_senha WHERE id = $1 RETURNING id", [id.data]);
  if (!resultado.rows[0]) {
    resposta.status(404).json({ erro: "Solicitação não encontrada." });
    return;
  }
  resposta.status(204).send();
});

rotasUsuarios.get("/", async (_requisicao, resposta) => {
  const resultado = await pool.query(`${selecaoUsuario} ORDER BY nome`);
  resposta.json(resultado.rows);
});

rotasUsuarios.post("/", async (requisicao, resposta) => {
  const validacao = esquemaCriacao.safeParse(requisicao.body);
  if (!validacao.success) {
    resposta.status(400).json({ erro: "Dados do usuário inválidos.", detalhes: validacao.error.flatten() });
    return;
  }

  try {
    const { nome, cpf, telefone, email, tipo, senha } = validacao.data;
    const senhaHash = await bcrypt.hash(senha, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, cpf, telefone, email, tipo, senha_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, cpf, telefone, email, tipo, criado_em AS "criadoEm"`,
      [nome, cpf, telefone, email, tipo, senhaHash],
    );
    resposta.status(201).json(resultado.rows[0]);
  } catch (erro) {
    const mensagem = erroDeUnicidade(erro);
    if (mensagem) {
      resposta.status(409).json({ erro: mensagem });
      return;
    }
    throw erro;
  }
});

rotasUsuarios.put("/:id", async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  const validacao = esquemaAtualizacao.safeParse(requisicao.body);
  if (!id.success || !validacao.success) {
    resposta.status(400).json({ erro: "Dados do usuário inválidos." });
    return;
  }
  if (id.data === requisicao.usuarioId && validacao.data.tipo !== "administrador") {
    resposta.status(409).json({ erro: "Você não pode remover seu próprio acesso de administrador." });
    return;
  }

  try {
    const { nome, cpf, telefone, email, tipo, senha } = validacao.data;
    const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
    const resultado = await pool.query(
      `UPDATE usuarios SET nome = $1, cpf = $2, telefone = $3, email = $4, tipo = $5,
         senha_hash = COALESCE($6, senha_hash)
       WHERE id = $7
       RETURNING id, nome, cpf, telefone, email, tipo, criado_em AS "criadoEm"`,
      [nome, cpf, telefone, email, tipo, senhaHash, id.data],
    );
    if (!resultado.rows[0]) {
      resposta.status(404).json({ erro: "Usuário não encontrado." });
      return;
    }
    resposta.json(resultado.rows[0]);
  } catch (erro) {
    const mensagem = erroDeUnicidade(erro);
    if (mensagem) {
      resposta.status(409).json({ erro: mensagem });
      return;
    }
    throw erro;
  }
});

rotasUsuarios.delete("/:id", async (requisicao, resposta) => {
  const id = esquemaId.safeParse(requisicao.params.id);
  if (!id.success) {
    resposta.status(400).json({ erro: "Usuário inválido." });
    return;
  }
  if (id.data === requisicao.usuarioId) {
    resposta.status(409).json({ erro: "Você não pode excluir seu próprio usuário." });
    return;
  }

  const resultado = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING id", [id.data]);
  if (!resultado.rows[0]) {
    resposta.status(404).json({ erro: "Usuário não encontrado." });
    return;
  }
  resposta.status(204).send();
});
