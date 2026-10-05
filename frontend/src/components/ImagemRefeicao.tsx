"use client";

import { Utensils } from "lucide-react";
import { useState } from "react";
import { normalizarUrlImagem } from "@/lib/imagem";

type PropriedadesImagemRefeicao = {
  src?: string | null;
  nome: string;
  className?: string;
};

export function ImagemRefeicao({ src, nome, className = "" }: PropriedadesImagemRefeicao) {
  const origemImagem = normalizarUrlImagem(src);
  const [origemComErro, definirOrigemComErro] = useState<string | null>(null);
  const exibirImagem = Boolean(origemImagem && origemComErro !== origemImagem);

  return (
    <div className={`relative grid overflow-hidden bg-fundo text-texto-secundario ${className}`}>
      {exibirImagem ? (
        // A origem é cadastrada pelo usuário e pode pertencer a qualquer host HTTPS.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={origemImagem}
          alt={`Imagem da refeição ${nome}`}
          className="size-full object-contain object-center"
          onError={() => definirOrigemComErro(origemImagem)}
        />
      ) : (
        <span className="grid size-full place-items-center" role="img" aria-label={`Sem imagem para ${nome}`}>
          <Utensils className="opacity-45" size={32} aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
