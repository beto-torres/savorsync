import { obterTokenAutenticacao } from "@/lib/autenticacao";

type OpcoesApi = RequestInit & {
  autenticado?: boolean;
};

export async function solicitarApi<T>(caminho: string, opcoes: OpcoesApi = {}) {
  const headers = new Headers(opcoes.headers);

  if (opcoes.body) headers.set("Content-Type", "application/json");

  if (opcoes.autenticado) {
    const token = obterTokenAutenticacao();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const resposta = await fetch(caminho, { ...opcoes, headers });

  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
    throw new Error(corpo?.erro ?? "Não foi possível concluir a operação.");
  }

  if (resposta.status === 204) return undefined as T;
  return resposta.json() as Promise<T>;
}
