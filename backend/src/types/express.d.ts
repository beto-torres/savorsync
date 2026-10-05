declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
      tipoUsuario?: "administrador" | "cozinha" | "aluno";
    }
  }
}

export {};
