import { Router } from "express";
import { partesDaData, proximaDataLetiva } from "../datas.js";
import { pool } from "../database/pool.js";

type LinhaRefeicao = {
  id: number;
  periodo: "manha" | "almoco" | "tarde";
  horarioServico: string;
  descricao: string;
  nome: string;
  imagemUrl: string | null;
};

async function cardapioPara(data: string) {
  const resultado = await pool.query<LinhaRefeicao>(
    `SELECT id, periodo, nome,
            CASE periodo WHEN 'manha' THEN '10:00' WHEN 'almoco' THEN '12:00' ELSE '15:00' END AS "horarioServico",
            descricao, imagem_url AS "imagemUrl"
     FROM refeicoes
     WHERE data = $1
     ORDER BY CASE periodo WHEN 'manha' THEN 1 WHEN 'almoco' THEN 2 ELSE 3 END`,
    [data],
  );

  return { data, ehDiaLetivo: resultado.rows.length > 0, refeicoes: resultado.rows };
}

export const rotasCardapios = Router();

rotasCardapios.get("/hoje", async (_requisicao, resposta) => {
  const hoje = partesDaData();
  resposta.json(await cardapioPara(hoje.dataIso));
});

rotasCardapios.get("/proximo", async (_requisicao, resposta) => {
  const hoje = partesDaData();
  const resultado = await pool.query<{ data: string | null }>(
    "SELECT MIN(data)::text AS data FROM refeicoes WHERE data > $1",
    [hoje.dataIso],
  );
  const proximaDataComRefeicao = resultado.rows[0]?.data ?? proximaDataLetiva().dataIso;
  resposta.json(await cardapioPara(proximaDataComRefeicao));
});
