"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  encerrarSessaoUsuario,
  obterUsuarioAutenticado,
  useAutenticacaoUsuario,
} from "@/lib/autenticacao";
import { solicitarApi } from "@/lib/api";
import {
  CalendarDays,
  Clock3,
  LogOut,
  MessageSquare,
  Settings2,
  Users,
  Star,
  Utensils,
} from "lucide-react";
import { AlternadorTema } from "@/components/AlternadorTema";
import { AcessoQrCode } from "@/components/AcessoQrCode";
import { ImagemRefeicao } from "@/components/ImagemRefeicao";

type Periodo = "manha" | "almoco" | "tarde";
type RefeicaoPainel = {
  id: number;
  periodo: Periodo;
  horarioServico: string;
  nome: string;
  descricao: string;
  imagemUrl?: string | null;
};
type CardapioHoje = {
  data: string;
  ehDiaLetivo: boolean;
  refeicoes: RefeicaoPainel[];
};
type AvaliacaoResumo = { servidoEm: string };
const nomesPeriodo: Record<Periodo, string> = {
  manha: "Lanche da manhã",
  almoco: "Almoço",
  tarde: "Lanche da tarde",
};
const rotulosTipo = {
  administrador: "Administrador",
  cozinha: "Cozinha",
  aluno: "Aluno",
};

function formatarDataCurta(data?: string) {
  if (!data) return "--/--";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${data.slice(0, 10)}T12:00:00Z`));
}

export default function PaginaPainel() {
  const router = useRouter();
  const estaAutorizado = useAutenticacaoUsuario();
  const usuarioAtual =
    typeof window === "undefined" ? null : obterUsuarioAutenticado();
  const usuarioId = usuarioAtual?.id;
  const tipoUsuario = usuarioAtual?.tipo;
  const [cardapioHoje, definirCardapioHoje] = useState<CardapioHoje | null>(
    null,
  );
  const [quantidadeAvaliacoes, definirQuantidadeAvaliacoes] = useState(0);
  const [agora, definirAgora] = useState(() => new Date());

  useEffect(() => {
    if (estaAutorizado === false) {
      router.replace("/");
    }
  }, [estaAutorizado, router]);

  useEffect(() => {
    if (estaAutorizado !== true || !usuarioId || !tipoUsuario) return;
    const intervalo = window.setInterval(
      () => definirAgora(new Date()),
      60_000,
    );
    solicitarApi<CardapioHoje>("/api/cardapios/hoje")
      .then((cardapio) => {
        definirCardapioHoje(cardapio);
        const rota =
          tipoUsuario === "aluno"
            ? "/api/avaliacoes/minhas"
            : `/api/avaliacoes?inicio=${cardapio.data}&fim=${cardapio.data}`;
        return solicitarApi<AvaliacaoResumo[]>(rota, {
          autenticado: true,
        }).then((avaliacoes) => ({ avaliacoes, data: cardapio.data }));
      })
      .then(({ avaliacoes, data }) =>
        definirQuantidadeAvaliacoes(
          tipoUsuario === "aluno"
            ? avaliacoes.filter(
                (avaliacao) => avaliacao.servidoEm.slice(0, 10) === data,
              ).length
            : avaliacoes.length,
        ),
      )
      .catch(() => definirQuantidadeAvaliacoes(0));
    return () => window.clearInterval(intervalo);
  }, [estaAutorizado, usuarioId, tipoUsuario]);

  const proximaRefeicao = cardapioHoje?.refeicoes.find((refeicao) => {
    const [hora, minuto] = refeicao.horarioServico.split(":").map(Number);
    return agora.getHours() * 60 + agora.getMinutes() < hora * 60 + minuto;
  });
  const resumo = [
    {
      label: "Cardápio de hoje",
      value: cardapioHoje
        ? `${cardapioHoje.refeicoes.length} refeiç${cardapioHoje.refeicoes.length !== 1 ? "ões" : "ão"}`
        : "Carregando",
      description: cardapioHoje?.refeicoes.length
        ? cardapioHoje.refeicoes.map((refeicao) => refeicao.nome).join(" · ")
        : "Nenhuma refeição programada para hoje",
      icon: Utensils,
    },
    {
      label: "Próxima refeição",
      value: proximaRefeicao?.nome ?? "Nenhuma",
      description: proximaRefeicao
        ? `${nomesPeriodo[proximaRefeicao.periodo]} às ${proximaRefeicao.horarioServico.replace(":", "h")}`
        : "Não há outra refeição disponível hoje",
      icon: Clock3,
    },
    {
      label:
        usuarioAtual?.tipo === "aluno"
          ? "Suas avaliações hoje"
          : "Avaliações recebidas hoje",
      value: String(quantidadeAvaliacoes),
      description:
        quantidadeAvaliacoes === 0
          ? "Nenhuma avaliação registrada hoje"
          : `${quantidadeAvaliacoes} avaliação${quantidadeAvaliacoes !== 1 ? "ões" : ""} registrada${quantidadeAvaliacoes !== 1 ? "s" : ""} hoje`,
      icon: Star,
    },
  ];

  function sair() {
    encerrarSessaoUsuario();
    router.replace("/");
  }

  if (estaAutorizado !== true) {
    return (
      <main className="grid min-h-screen place-items-center bg-fundo text-texto-secundario">
        <p className="text-sm">Verificando identificação...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fundo text-texto-principal">
      <header className="border-b border-borda bg-header">
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:max-w-7xl">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="Voltar ao cardápio"
          >
            <Image
              src="/logo.png"
              alt="Logomarca Sabor Sync"
              width={56}
              height={56}
              priority
              className="size-14 shrink-0 rounded-full border border-borda object-cover"
            />
            <span className="min-w-0 leading-tight">
              <strong className="block text-sm tracking-wide text-texto-principal">
                SABOR SYNC
              </strong>
              <span className="block truncate text-xs text-secundaria font-medium">
                Área do usuário
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={sair}
              className="inline-flex items-center gap-2 border border-primaria px-3 py-2 text-sm font-semibold text-secundaria transition hover:bg-primaria hover:text-primaria-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
            >
              <LogOut size={18} aria-hidden="true" />
              Sair
            </button>
            <AcessoQrCode compacto />
            <AlternadorTema />
          </div>
        </div>
      </header>

      <section className="border-b border-borda bg-superficie">
        <div className="mx-auto w-full px-5 py-10 sm:px-8 sm:py-12 lg:max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-secundaria">
            PAINEL
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-texto-principal sm:text-4xl">
            Olá, {usuarioAtual?.nome ?? "usuário"}!
          </h1>
          {usuarioAtual && (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-secundaria">
              Perfil: {rotulosTipo[usuarioAtual.tipo]}
            </p>
          )}
          <p className="mt-3 max-w-2xl text-sm leading-6 text-texto-secundario">
            Acompanhe o cardápio do dia e consulte um resumo das suas
            avaliações.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full space-y-8 px-5 py-8 sm:px-8 sm:py-12 lg:max-w-7xl">
        {usuarioAtual?.tipo === "aluno" && (
          <section
            className="border-l-2 border-primaria bg-superficie p-6"
            aria-labelledby="regra-avaliacao"
          >
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center bg-primaria/15 text-secundaria">
                <Star size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                  SUA AVALIAÇÃO
                </p>
                <h2
                  id="regra-avaliacao"
                  className="mt-2 text-lg font-semibold text-texto-principal"
                >
                  Quando posso avaliar uma refeição?
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-texto-secundario">
                  A avaliação fica disponível após o horário em que a refeição é
                  servida e permanece aberta até o fim do mesmo dia. Refeições
                  futuras ou de dias anteriores não podem ser avaliadas.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-secundaria hover:underline"
                >
                  <MessageSquare size={17} />
                  Ver refeições disponíveis para avaliação
                </Link>
              </div>
            </div>
          </section>
        )}
        {(usuarioAtual?.tipo === "administrador" ||
          usuarioAtual?.tipo === "cozinha") && (
          <section className="flex flex-col gap-4 border-l-2 border-primaria bg-superficie p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-texto-principal">
                Gestão das refeições
              </h2>
              <p className="mt-1 text-sm text-texto-secundario">
                Cadastre, edite e organize o cardápio de segunda a sexta.
              </p>
            </div>
            <Link
              href="/painel/refeicoes"
              className="inline-flex items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
            >
              <Settings2 size={18} aria-hidden="true" />
              Gerenciar refeições
            </Link>
          </section>
        )}

        {usuarioAtual?.tipo === "administrador" && (
          <section className="flex flex-col gap-4 border-l-2 border-primaria bg-superficie p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-texto-principal">
                Gestão de usuários
              </h2>
              <p className="mt-1 text-sm text-texto-secundario">
                Cadastre usuários e controle seus tipos de acesso.
              </p>
            </div>
            <Link
              href="/painel/usuarios"
              className="inline-flex items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
            >
              <Users size={18} aria-hidden="true" />
              Gerenciar usuários
            </Link>
          </section>
        )}

        {(usuarioAtual?.tipo === "administrador" ||
          usuarioAtual?.tipo === "cozinha") && (
          <section className="flex flex-col gap-4 border-l-2 border-primaria bg-superficie p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-texto-principal">
                Gestão das avaliações
              </h2>
              <p className="mt-1 text-sm text-texto-secundario">
                Consulte avaliações e acompanhe os relatórios de satisfação.
              </p>
            </div>
            <Link
              href="/painel/avaliacoes"
              className="inline-flex items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover"
            >
              <Star size={18} aria-hidden="true" />
              Avaliações
            </Link>
          </section>
        )}

        <section aria-labelledby="resumo-title">
          <h2
            id="resumo-title"
            className="text-xl font-semibold text-texto-principal"
          >
            Resumo do dia
          </h2>
          <div className="mt-4 grid gap-px overflow-hidden border border-borda bg-borda md:grid-cols-3">
            {resumo.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.label} className="bg-superficie p-6">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-texto-secundario">
                      {item.label}
                    </p>
                    <Icon
                      size={20}
                      className="text-secundaria"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-texto-principal">
                    {item.value}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-texto-secundario">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="cardapio-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                PROGRAMAÇÃO
              </p>
              <h2
                id="cardapio-title"
                className="mt-2 text-xl font-semibold text-texto-principal"
              >
                Cardápio de hoje
              </h2>
            </div>
            <CalendarDays
              size={22}
              className="text-texto-secundario"
              aria-hidden="true"
            />
          </div>

          <div className="mt-4 divide-y divide-borda border border-borda bg-superficie">
            {cardapioHoje?.refeicoes.map((refeicao) => (
              <article
                key={refeicao.id}
                className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 p-5 sm:grid-cols-[5rem_11rem_6rem_1fr] sm:items-center"
              >
                <div
                  className="w-14 text-center text-sm font-bold leading-none text-secundaria"
                  aria-label={`${formatarDataCurta(cardapioHoje.data)} às ${refeicao.horarioServico.replace(":", "h")}`}
                >
                  <p className="border-b border-secundaria pb-1">
                    {formatarDataCurta(cardapioHoje.data)}
                  </p>
                  <p className="pt-1">
                    {refeicao.horarioServico.replace(":", "h")}
                  </p>
                </div>
                <h3 className="font-semibold text-texto-principal">
                  {refeicao.nome}
                  <span className="mt-1 block text-xs font-normal text-texto-secundario">
                    {nomesPeriodo[refeicao.periodo]}
                  </span>
                </h3>
                <ImagemRefeicao
                  src={refeicao.imagemUrl}
                  nome={refeicao.nome}
                  className="col-span-2 aspect-[4/3] w-full border border-borda sm:col-span-1 sm:w-24"
                />
                <p className="col-span-2 text-sm leading-6 text-texto-secundario sm:col-span-1">
                  {refeicao.descricao}
                </p>
              </article>
            ))}
            {cardapioHoje && cardapioHoje.refeicoes.length === 0 && (
              <p className="p-5 text-sm text-texto-secundario">
                Nenhuma refeição cadastrada para hoje.
              </p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 border-l-2 border-primaria bg-superficie p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-texto-principal">
              Quer avaliar uma refeição?
            </h2>
            <p className="mt-1 text-sm text-texto-secundario">
              Volte ao cardápio para selecionar a refeição desejada.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
          >
            <MessageSquare size={18} aria-hidden="true" />
            Ver cardápio
          </Link>
        </section>
      </div>
    </main>
  );
}
