import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { pool } from "../database/pool.js";

type TokenPayload = {
  sub: string;
  tipo: "administrador" | "cozinha" | "aluno";
};

export async function exigirAutenticacao(
  requisicao: Request,
  resposta: Response,
  proximo: NextFunction,
) {
  const autorizacao = requisicao.headers.authorization;

  if (!autorizacao?.startsWith("Bearer ")) {
    resposta.status(401).json({ erro: "Autenticação necessária." });
    return;
  }

  try {
    const token = autorizacao.slice("Bearer ".length);
    const dadosToken = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    const resultado = await pool.query<{ tipo: "administrador" | "cozinha" | "aluno" }>(
      "SELECT tipo FROM usuarios WHERE id = $1",
      [dadosToken.sub],
    );
    if (!resultado.rows[0]) {
      resposta.status(401).json({ erro: "Usuário da sessão não existe mais." });
      return;
    }
    requisicao.usuarioId = dadosToken.sub;
    requisicao.tipoUsuario = resultado.rows[0].tipo;
    proximo();
  } catch {
    resposta.status(401).json({ erro: "Sessão inválida ou expirada." });
  }
}

export function exigirTipos(...tiposPermitidos: Array<"administrador" | "cozinha" | "aluno">) {
  return (requisicao: Request, resposta: Response, proximo: NextFunction) => {
    if (!requisicao.tipoUsuario || !tiposPermitidos.includes(requisicao.tipoUsuario)) {
      resposta.status(403).json({ erro: "Seu perfil não possui permissão para esta funcionalidade." });
      return;
    }
    proximo();
  };
}

export function exigirAdministrador(
  requisicao: Request,
  resposta: Response,
  proximo: NextFunction,
) {
  if (requisicao.tipoUsuario !== "administrador") {
    resposta.status(403).json({ erro: "Acesso permitido somente para administradores." });
    return;
  }

  proximo();
}
