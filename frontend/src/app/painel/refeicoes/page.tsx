"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AlternadorTema } from "@/components/AlternadorTema";
import { AcessoQrCode } from "@/components/AcessoQrCode";
import { ImagemRefeicao } from "@/components/ImagemRefeicao";
import { solicitarApi } from "@/lib/api";
import {
  encerrarSessaoUsuario,
  obterUsuarioAutenticado,
  useAutenticacaoUsuario,
} from "@/lib/autenticacao";
import { normalizarUrlImagem } from "@/lib/imagem";

type PeriodoRefeicao = "manha" | "almoco" | "tarde";

type Refeicao = {
  id: number;
  data: string;
  periodo: PeriodoRefeicao;
  nome: string;
  horarioServico: string;
  descricao: string;
  imagemUrl?: string | null;
};

type FormularioRefeicao = Omit<Refeicao, "id" | "horarioServico">;
type RespostaPaginada = {
  dados: Refeicao[];
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
};

const periodos: Array<{ value: PeriodoRefeicao; label: string }> = [
  { value: "manha", label: "Lanche da manhã" },
  { value: "almoco", label: "Almoço" },
  { value: "tarde", label: "Lanche da tarde" },
];

function rotuloPeriodo(periodo: PeriodoRefeicao) {
  return periodos.find((opcao) => opcao.value === periodo)?.label ?? periodo;
}

function dataHoje() {
  const agora = new Date();
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

function dataBr(data?: string) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${data.slice(0, 10)}T12:00:00Z`),
  );
}

function formularioVazio(data = dataHoje()): FormularioRefeicao {
  return {
    data,
    periodo: "manha",
    nome: "",
    descricao: "",
    imagemUrl: "",
  };
}

const classeCampo =
  "mt-2 w-full border border-borda bg-input-bg px-3 py-3 text-sm text-texto-principal outline-none placeholder:text-input-placeholder focus:border-primaria focus-visible:ring-1 focus-visible:ring-primaria";

export default function PaginaGestaoRefeicoes() {
  const router = useRouter();
  const estaAutorizado = useAutenticacaoUsuario();
  const usuarioAtual =
    typeof window === "undefined" ? null : obterUsuarioAutenticado();
  const [filtroData, definirFiltroData] = useState("");
  const [filtroPeriodo, definirFiltroPeriodo] = useState("");
  const [filtroNome, definirFiltroNome] = useState("");
  const [pagina, definirPagina] = useState(1);
  const [total, definirTotal] = useState(0);
  const [totalPaginas, definirTotalPaginas] = useState(1);
  const [refeicoes, definirRefeicoes] = useState<Refeicao[]>([]);
  const [formulario, definirFormulario] = useState<FormularioRefeicao>(() =>
    formularioVazio(),
  );
  const [formularioAberto, definirFormularioAberto] = useState(false);
  const [idEmEdicao, definirIdEmEdicao] = useState<number | null>(null);
  const [idEmExclusao, definirIdEmExclusao] = useState<number | null>(null);
  const [estaCarregando, definirCarregando] = useState(true);
  const [estaSalvando, definirSalvando] = useState(false);
  const [mensagem, definirMensagem] = useState("");
  const [erro, definirErro] = useState("");

  const carregarRefeicoes = useCallback(async () => {
    try {
      definirCarregando(true);
      const parametros = new URLSearchParams();
      if (filtroData) parametros.set("data", filtroData);
      if (filtroPeriodo) parametros.set("periodo", filtroPeriodo);
      if (filtroNome.trim()) parametros.set("nome", filtroNome.trim());
      parametros.set("pagina", String(pagina));
      parametros.set("limite", "8");
      const resultado = await solicitarApi<RespostaPaginada>(
        `/api/refeicoes?${parametros}`,
        {
          autenticado: true,
        },
      );
      definirRefeicoes(resultado.dados);
      definirTotal(resultado.total);
      definirTotalPaginas(resultado.totalPaginas);
      if (pagina > resultado.totalPaginas)
        definirPagina(resultado.totalPaginas);
    } catch (erroCarregamento) {
      definirErro(
        erroCarregamento instanceof Error
          ? erroCarregamento.message
          : "Não foi possível carregar as refeições.",
      );
    } finally {
      definirCarregando(false);
    }
  }, [filtroData, filtroNome, filtroPeriodo, pagina]);

  useEffect(() => {
    if (estaAutorizado === false) {
      router.replace("/");
      return;
    }

    if (estaAutorizado === true && usuarioAtual?.tipo === "aluno") {
      router.replace("/painel");
      return;
    }

    if (estaAutorizado === true) {
      const timeout = window.setTimeout(() => void carregarRefeicoes(), 250);
      return () => window.clearTimeout(timeout);
    }
  }, [estaAutorizado, usuarioAtual?.tipo, carregarRefeicoes, router]);

  function limparFormulario(data = dataHoje()) {
    definirFormulario(formularioVazio(data));
    definirIdEmEdicao(null);
    definirMensagem("");
    definirErro("");
  }

  function iniciarEdicao(refeicao: Refeicao) {
    definirIdEmEdicao(refeicao.id);
    definirFormulario({
      data: refeicao.data?.slice(0, 10) || dataHoje(),
      periodo: refeicao.periodo,
      nome: refeicao.nome || rotuloPeriodo(refeicao.periodo),
      descricao: refeicao.descricao,
      imagemUrl: refeicao.imagemUrl ?? "",
    });
    definirMensagem("");
    definirErro("");
    definirFormularioAberto(true);
  }

  function abrirCadastro() {
    limparFormulario();
    definirFormularioAberto(true);
  }

  function fecharFormulario() {
    definirFormularioAberto(false);
    definirIdEmEdicao(null);
    definirErro("");
  }

  async function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    definirSalvando(true);
    definirMensagem("");
    definirErro("");

    const dadosRefeicao = {
      data: formulario.data,
      periodo: formulario.periodo,
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      imagemUrl: normalizarUrlImagem(formulario.imagemUrl),
    };

    try {
      await solicitarApi<Refeicao>(
        idEmEdicao ? `/api/refeicoes/${idEmEdicao}` : "/api/refeicoes",
        {
          method: idEmEdicao ? "PUT" : "POST",
          autenticado: true,
          body: JSON.stringify(dadosRefeicao),
        },
      );
      definirMensagem(
        idEmEdicao
          ? "Refeição atualizada com sucesso."
          : "Refeição cadastrada com sucesso.",
      );
      definirFormulario(formularioVazio(formulario.data));
      definirIdEmEdicao(null);
      definirFormularioAberto(false);
      definirCarregando(true);
      await carregarRefeicoes();
    } catch (erroSalvamento) {
      definirErro(
        erroSalvamento instanceof Error
          ? erroSalvamento.message
          : "Não foi possível salvar a refeição.",
      );
    } finally {
      definirSalvando(false);
    }
  }

  async function excluirRefeicao(id: number) {
    definirErro("");
    definirMensagem("");

    try {
      await solicitarApi<void>(`/api/refeicoes/${id}`, {
        method: "DELETE",
        autenticado: true,
      });
      definirIdEmExclusao(null);
      definirMensagem("Refeição excluída com sucesso.");
      if (idEmEdicao === id) limparFormulario();
      definirCarregando(true);
      await carregarRefeicoes();
    } catch (erroExclusao) {
      definirErro(
        erroExclusao instanceof Error
          ? erroExclusao.message
          : "Não foi possível excluir a refeição.",
      );
    }
  }

  function sair() {
    encerrarSessaoUsuario();
    router.replace("/");
  }

  function dataJaPassou(data: string) {
    return data.slice(0, 10) < dataHoje();
  }

  if (estaAutorizado !== true || usuarioAtual?.tipo === "aluno") {
    return (
      <main className="grid min-h-screen place-items-center bg-fundo text-sm text-texto-secundario">
        Verificando identificação...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fundo text-texto-principal">
      <header className="border-b border-borda bg-header">
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:max-w-7xl">
          <Link
            href="/painel"
            className="flex items-center gap-3"
            aria-label="Voltar ao painel"
          >
            <Image
              src="/logo.png"
              alt="Logomarca Sabor Sync"
              width={56}
              height={56}
              priority
              className="size-14 rounded-full border border-borda object-cover"
            />
            <span>
              <strong className="block text-sm tracking-wide text-texto-principal">
                SABOR SYNC
              </strong>
              <span className="text-xs text-secundaria font-medium">
                Gestão de refeições
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/painel"
              className="inline-flex items-center gap-2 border border-borda px-3 py-2 text-sm font-semibold text-texto-secundario hover:bg-borda/20 hover:text-texto-principal"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Painel
            </Link>
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
        <div className="mx-auto w-full px-5 py-8 sm:px-8 lg:max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-secundaria">
            ADMINISTRAÇÃO
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-texto-principal">
            Gestão das refeições
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-texto-secundario">
            Programe, edite e exclua refeições para datas específicas.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full px-5 py-8 sm:px-8 lg:max-w-7xl">
        <section aria-labelledby="lista-title">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                  PROGRAMAÇÃO
                </p>
                <h2
                  id="lista-title"
                  className="mt-2 text-xl font-semibold text-texto-principal"
                >
                  Refeições cadastradas
                </h2>
              </div>
              <button
                type="button"
                onClick={abrirCadastro}
                className="inline-flex items-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover"
              >
                <Plus size={18} />
                Nova refeição
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <label className="text-sm text-texto-secundario">
                Data
                <input
                  type="date"
                  value={filtroData}
                  onChange={(event) => {
                    definirFiltroData(event.target.value);
                    definirPagina(1);
                  }}
                  className={classeCampo}
                />
              </label>
              <label className="text-sm text-texto-secundario">
                Período
                <select
                  value={filtroPeriodo}
                  onChange={(event) => {
                    definirFiltroPeriodo(event.target.value);
                    definirPagina(1);
                  }}
                  className={classeCampo}
                >
                  <option value="">Todos</option>
                  {periodos.map((periodo) => (
                    <option key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-texto-secundario">
                Nome
                <span className="relative block">
                  <Search
                    size={16}
                    className="absolute left-3 top-5 text-texto-secundario"
                  />
                  <input
                    value={filtroNome}
                    onChange={(event) => {
                      definirFiltroNome(event.target.value);
                      definirPagina(1);
                    }}
                    placeholder="Buscar refeição"
                    className={`${classeCampo} pl-9`}
                  />
                </span>
              </label>
            </div>
            {(filtroData || filtroPeriodo || filtroNome) && (
              <button
                type="button"
                onClick={() => {
                  definirFiltroData("");
                  definirFiltroPeriodo("");
                  definirFiltroNome("");
                  definirPagina(1);
                }}
                className="mt-3 text-xs font-semibold text-secundaria hover:underline"
              >
                Limpar filtros
              </button>
            )}
            {mensagem && !formularioAberto && (
              <p
                className="mt-3 inline-flex items-center gap-2 text-sm text-sucesso font-medium"
                role="status"
              >
                <Check size={17} />
                {mensagem}
              </p>
            )}
          </div>

          <div className="mt-5" aria-live="polite">
            {estaCarregando && (
              <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                Carregando refeições...
              </p>
            )}
            {!estaCarregando && refeicoes.length === 0 && (
              <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                Nenhuma refeição encontrada.
              </p>
            )}
            {!estaCarregando && refeicoes.length > 0 && (
              <div className="overflow-x-auto border border-borda bg-superficie">
                <table className="w-full min-w-[840px] border-collapse text-left text-sm">
                  <thead className="bg-fundo text-xs uppercase tracking-wide text-texto-secundario">
                    <tr>
                      <th className="px-4 py-3">Imagem</th>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Período</th>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borda">
                    {refeicoes.map((refeicao) => (
                      <tr
                        key={refeicao.id}
                        className={
                          idEmExclusao === refeicao.id
                            ? "bg-erro/15"
                            : dataJaPassou(refeicao.data)
                              ? "bg-texto-secundario/20 hover:bg-texto-secundario/15"
                              : "hover:bg-borda/20"
                        }
                      >
                        <td className="px-4 py-3">
                          <ImagemRefeicao
                            src={refeicao.imagemUrl}
                            nome={refeicao.nome}
                            className="h-12 w-16 border border-borda"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <strong className="block text-texto-principal">
                            {dataBr(refeicao.data)}
                          </strong>
                          <span className="text-xs text-secundaria">
                            {refeicao.horarioServico}
                          </span>
                          {dataJaPassou(refeicao.data) && (
                            <span className="ml-2 border border-borda-forte px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                              JÁ SERVIDO
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-texto-secundario">
                          {rotuloPeriodo(refeicao.periodo)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-texto-principal">
                          {refeicao.nome || rotuloPeriodo(refeicao.periodo)}
                        </td>
                        <td className="max-w-xs px-4 py-4 text-texto-secundario">
                          <span className="line-clamp-2">
                            {refeicao.descricao}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => iniciarEdicao(refeicao)}
                              className="grid size-9 place-items-center text-secundaria hover:bg-borda/30"
                              aria-label={`Editar ${refeicao.nome}`}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => definirIdEmExclusao(refeicao.id)}
                              className="grid size-9 place-items-center text-erro hover:bg-borda/30"
                              aria-label={`Excluir ${refeicao.nome}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {idEmExclusao !== null && (
              <div
                onClick={() => definirIdEmExclusao(null)}
                className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-5"
                role="dialog"
                aria-modal="true"
                aria-labelledby="exclusao-title"
              >
                <section
                  onClick={(event) => event.stopPropagation()}
                  className="relative w-full max-w-md border border-erro/40 bg-superficie p-6 shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => definirIdEmExclusao(null)}
                    className="absolute right-4 top-4 grid size-9 place-items-center text-texto-secundario hover:text-texto-principal"
                    aria-label="Fechar confirmação"
                  >
                    <X size={19} />
                  </button>
                  <div className="grid size-11 place-items-center bg-erro/15 text-erro">
                    <Trash2 size={22} />
                  </div>
                  <p className="mt-5 text-xs font-bold tracking-[0.16em] text-erro">
                    EXCLUSÃO
                  </p>
                  <h3
                    id="exclusao-title"
                    className="mt-2 text-xl font-semibold text-texto-principal"
                  >
                    Excluir refeição?
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-texto-secundario">
                    A refeição{" "}
                    <strong className="text-texto-principal">
                      {refeicoes.find((item) => item.id === idEmExclusao)
                        ?.nome ?? "selecionada"}
                    </strong>{" "}
                    será removida permanentemente.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => definirIdEmExclusao(null)}
                      className="flex-1 border border-borda px-4 py-3 text-sm font-semibold text-texto-secundario hover:bg-borda/30"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => void excluirRefeicao(idEmExclusao)}
                      className="inline-flex flex-1 items-center justify-center gap-2 bg-erro px-4 py-3 text-sm font-bold text-white hover:opacity-90"
                    >
                      <Trash2 size={17} />
                      Excluir
                    </button>
                  </div>
                </section>
              </div>
            )}
            {!estaCarregando && total > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-texto-secundario">
                <p>
                  {total} refeição{total !== 1 && "ões"} · Página {pagina} de{" "}
                  {totalPaginas}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pagina === 1}
                    onClick={() =>
                      definirPagina((atual) => Math.max(1, atual - 1))
                    }
                    className="inline-flex items-center gap-1 border border-borda px-3 py-2 disabled:opacity-40 hover:bg-borda/20"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={pagina === totalPaginas}
                    onClick={() =>
                      definirPagina((atual) =>
                        Math.min(totalPaginas, atual + 1),
                      )
                    }
                    className="inline-flex items-center gap-1 border border-borda px-3 py-2 disabled:opacity-40 hover:bg-borda/20"
                  >
                    Próxima
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {formularioAberto && (
          <div
            onClick={fecharFormulario}
            className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-black/60 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="formulario-title"
          >
            <section
              onClick={(event) => event.stopPropagation()}
              className="relative my-auto w-full max-w-2xl border border-borda bg-superficie p-6 shadow-2xl"
              aria-labelledby="formulario-title"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                    {idEmEdicao ? "EDIÇÃO" : "CADASTRO"}
                  </p>
                  <h2
                    id="formulario-title"
                    className="mt-2 text-xl font-semibold text-texto-principal"
                  >
                    {idEmEdicao ? "Editar refeição" : "Nova refeição"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={fecharFormulario}
                  className="grid size-9 place-items-center text-texto-secundario hover:text-texto-principal"
                  aria-label="Fechar formulário"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={enviarFormulario} className="mt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-texto-secundario">
                    Data
                    <input
                      required
                      type="date"
                      value={formulario.data}
                      onChange={(event) =>
                        definirFormulario({
                          ...formulario,
                          data: event.target.value,
                        })
                      }
                      className={classeCampo}
                    />
                  </label>
                  <label className="text-sm text-texto-secundario">
                    Período
                    <select
                      required
                      value={formulario.periodo}
                      onChange={(event) =>
                        definirFormulario({
                          ...formulario,
                          periodo: event.target.value as PeriodoRefeicao,
                        })
                      }
                      className={classeCampo}
                    >
                      {periodos.map((periodo) => (
                        <option key={periodo.value} value={periodo.value}>
                          {periodo.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-4 border-l-2 border-primaria bg-fundo px-3 py-2 text-xs text-texto-secundario">
                  Horários fixos: manhã às 10h, almoço às 12h e tarde às 15h.
                </p>
                <label className="mt-4 block text-sm text-texto-secundario">
                  Nome
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={formulario.nome}
                    onChange={(event) =>
                      definirFormulario({
                        ...formulario,
                        nome: event.target.value,
                      })
                    }
                    className={classeCampo}
                    placeholder="Ex.: Cuscuz com ovos"
                  />
                </label>
                <label className="mt-4 block text-sm text-texto-secundario">
                  Descrição
                  <textarea
                    required
                    minLength={3}
                    maxLength={500}
                    rows={3}
                    value={formulario.descricao}
                    onChange={(event) =>
                      definirFormulario({
                        ...formulario,
                        descricao: event.target.value,
                      })
                    }
                    className={`${classeCampo} resize-none`}
                    placeholder="Descreva brevemente a refeição."
                  />
                </label>
                <label className="mt-4 block text-sm text-texto-secundario">
                  URL da imagem{" "}
                  <span className="text-texto-secundario/70">(opcional)</span>
                  <input
                    type="url"
                    maxLength={2048}
                    pattern="https://.*"
                    value={formulario.imagemUrl ?? ""}
                    onChange={(event) =>
                      definirFormulario({
                        ...formulario,
                        imagemUrl: event.target.value,
                      })
                    }
                    className={classeCampo}
                    placeholder="URL direta ou link compartilhado do Google Drive"
                  />
                  <span className="mt-1.5 block text-xs text-texto-secundario/80">
                    No Google Drive, permita o acesso a qualquer pessoa com o
                    link.
                  </span>
                </label>
                <ImagemRefeicao
                  src={formulario.imagemUrl}
                  nome={formulario.nome || "refeição"}
                  className="mt-4 aspect-video w-full border border-borda"
                />

                {erro && (
                  <p
                    className="mt-4 text-sm text-erro font-medium"
                    role="alert"
                  >
                    {erro}
                  </p>
                )}
                {mensagem && (
                  <p
                    className="mt-4 inline-flex items-center gap-2 text-sm text-sucesso font-medium"
                    role="status"
                  >
                    <Check size={17} />
                    {mensagem}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    disabled={estaSalvando}
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover disabled:cursor-wait disabled:opacity-60"
                  >
                    {idEmEdicao ? <Pencil size={18} /> : <Plus size={18} />}
                    {estaSalvando
                      ? "Salvando..."
                      : idEmEdicao
                        ? "Salvar alterações"
                        : "Cadastrar refeição"}
                  </button>
                  <button
                    type="button"
                    onClick={() => limparFormulario()}
                    className="border border-borda px-4 py-3 text-sm font-semibold text-texto-secundario hover:bg-borda/30"
                  >
                    Limpar
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
