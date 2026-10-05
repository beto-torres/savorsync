import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { config } from "./config.js";
import { rotasAutenticacao } from "./routes/autenticacao.js";
import { rotasAvaliacoes } from "./routes/avaliacoes.js";
import { rotasCardapios } from "./routes/cardapios.js";
import { rotasRefeicoes } from "./routes/refeicoes.js";
import { rotasUsuarios } from "./routes/usuarios.js";

export const app = express();

const origensPermitidas = config.CORS_ORIGIN.split(",").map((origem) => origem.trim());
app.use(cors({ origin: origensPermitidas }));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/autenticacao", rotasAutenticacao);
app.use("/api/cardapios", rotasCardapios);
app.use("/api/refeicoes", rotasRefeicoes);
app.use("/api/usuarios", rotasUsuarios);
app.use("/api/avaliacoes", rotasAvaliacoes);

app.use((_request, response) => {
  response.status(404).json({ erro: "Rota não encontrada." });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ erro: "Erro interno do servidor." });
});
