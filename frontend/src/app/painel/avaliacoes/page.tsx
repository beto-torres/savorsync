"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Pencil,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { AlternadorTema } from "@/components/AlternadorTema";
import { solicitarApi } from "@/lib/api";
import {
  encerrarSessaoUsuario,
  obterUsuarioAutenticado,
  useAutenticacaoUsuario,
} from "@/lib/autenticacao";

type Periodo = "manha" | "almoco" | "tarde";
type Avaliacao = {
  id: string;
  refeicaoId: number;
  servidoEm: string;
  nota: number;
  comentario: string | null;
  criadoEm: string;
  usuarioNome: string;
  periodoRefeicao: Periodo;
  refeicaoDescricao: string;
};
type Refeicao = {
  id: number;
  data?: string;
  periodo: Periodo;
  horarioServico: string;
  nome?: string;
  descricao: string;
  imagemUrl?: string | null;
};
type RelatorioPeriodo = {
  periodo: Periodo;
  quantidade: number;
  media: number;
  positivas: number;
};
type RelatorioNota = { nota: number; quantidade: number };
type Formulario = {
  refeicaoId: number;
  servidoEm: string;
  nota: number;
  comentario: string;
};
const periodos: Record<Periodo, string> = {
  manha: "Lanche da manhã",
  almoco: "Almoço",
  tarde: "Lanche da tarde",
};
const campo =
  "mt-2 w-full border border-borda bg-input-bg px-3 py-3 text-sm text-texto-principal outline-none placeholder:text-input-placeholder focus:border-primaria focus-visible:ring-1 focus-visible:ring-primaria";
const avaliacoesPorPagina = 3;
function dataBr(data: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${data.slice(0, 10)}T12:00:00Z`),
  );
}

function montarPaginasVisiveis(paginaAtual: number, totalPaginas: number) {
  const paginas = new Set([
    1,
    totalPaginas,
    paginaAtual - 1,
    paginaAtual,
    paginaAtual + 1,
  ]);
  const validas = [...paginas]
    .filter((pagina) => pagina >= 1 && pagina <= totalPaginas)
    .sort((a, b) => a - b);
  const itens: Array<number | string> = [];
  validas.forEach((pagina, indice) => {
    if (indice > 0 && pagina - validas[indice - 1] > 1)
      itens.push(`reticencias-${pagina}`);
    itens.push(pagina);
  });
  return itens;
}

export default function PaginaAvaliacoes() {
  const router = useRouter();
  const autenticado = useAutenticacaoUsuario();
  const usuario =
    typeof window === "undefined" ? null : obterUsuarioAutenticado();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [porPeriodo, setPorPeriodo] = useState<RelatorioPeriodo[]>([]);
  const [porNota, setPorNota] = useState<RelatorioNota[]>([]);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);
  const [idExclusao, setIdExclusao] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<Formulario>({
    refeicaoId: 0,
    servidoEm: "",
    nota: 5,
    comentario: "",
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    const parametros = new URLSearchParams();
    if (inicio) parametros.set("inicio", inicio);
    if (fim) parametros.set("fim", fim);
    const sufixo = parametros.size ? `?${parametros}` : "";
    try {
      const [lista, refeicoesLista, periodosLista, notasLista] =
        await Promise.all([
          solicitarApi<Avaliacao[]>(`/api/avaliacoes${sufixo}`, {
            autenticado: true,
          }),
          solicitarApi<Refeicao[]>("/api/refeicoes", { autenticado: true }),
          solicitarApi<RelatorioPeriodo[]>(
            `/api/avaliacoes/relatorios/periodos${sufixo}`,
            { autenticado: true },
          ),
          solicitarApi<RelatorioNota[]>(
            `/api/avaliacoes/relatorios/notas${sufixo}`,
            { autenticado: true },
          ),
        ]);
      setAvaliacoes(lista);
      setPagina(1);
      setRefeicoes(refeicoesLista);
      setPorPeriodo(periodosLista);
      setPorNota(notasLista);
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar as avaliações.",
      );
    } finally {
      setCarregando(false);
    }
  }, [inicio, fim]);
  useEffect(() => {
    if (autenticado === false) router.replace("/");
    else if (autenticado === true && usuario?.tipo === "aluno")
      router.replace("/painel");
    else if (autenticado === true) {
      const t = setTimeout(() => void carregar(), 0);
      return () => clearTimeout(t);
    }
  }, [autenticado, usuario?.tipo, router, carregar]);
  const filtradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return termo
      ? avaliacoes.filter((a) =>
          `${a.usuarioNome} ${a.comentario ?? ""} ${periodos[a.periodoRefeicao]}`
            .toLocaleLowerCase("pt-BR")
            .includes(termo),
        )
      : avaliacoes;
  }, [avaliacoes, busca]);
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradas.length / avaliacoesPorPagina),
  );
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicioPagina = (paginaAtual - 1) * avaliacoesPorPagina;
  const avaliacoesDaPagina = filtradas.slice(
    inicioPagina,
    inicioPagina + avaliacoesPorPagina,
  );
  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas);
  const totalNotas = porNota.reduce((s, item) => s + item.quantidade, 0);
  const maiorQuantidade = Math.max(
    1,
    ...porNota.map((item) => item.quantidade),
  );
  function editar(a: Avaliacao) {
    setIdEdicao(a.id);
    setFormulario({
      refeicaoId: a.refeicaoId,
      servidoEm: a.servidoEm.slice(0, 10),
      nota: a.nota,
      comentario: a.comentario ?? "",
    });
    setErro("");
    setMensagem("");
  }
  function cancelar() {
    setIdEdicao(null);
    setFormulario({ refeicaoId: 0, servidoEm: "", nota: 5, comentario: "" });
    setErro("");
  }
  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!idEdicao) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await solicitarApi(`/api/avaliacoes/${idEdicao}`, {
        method: "PUT",
        autenticado: true,
        body: JSON.stringify(formulario),
      });
      setMensagem("Avaliação atualizada com sucesso.");
      cancelar();
      await carregar();
    } catch (f) {
      setErro(
        f instanceof Error
          ? f.message
          : "Não foi possível atualizar a avaliação.",
      );
    } finally {
      setSalvando(false);
    }
  }
  async function excluir(id: string) {
    setErro("");
    try {
      await solicitarApi<void>(`/api/avaliacoes/${id}`, {
        method: "DELETE",
        autenticado: true,
      });
      setIdExclusao(null);
      setMensagem("Avaliação excluída com sucesso.");
      await carregar();
    } catch (f) {
      setErro(
        f instanceof Error
          ? f.message
          : "Não foi possível excluir a avaliação.",
      );
    }
  }
  function sair() {
    encerrarSessaoUsuario();
    router.replace("/");
  }
  if (autenticado !== true || usuario?.tipo === "aluno")
    return (
      <main className="grid min-h-screen place-items-center bg-fundo text-sm text-texto-secundario">
        Verificando autorização...
      </main>
    );
  return (
    <main className="min-h-screen bg-fundo text-texto-principal">
      <header className="border-b border-borda bg-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/painel" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logomarca Sabor Sync"
              width={56}
              height={56}
              className="size-14 rounded-full border border-borda object-cover"
            />
            <span>
              <strong className="block text-sm tracking-wide text-texto-principal">
                SABOR SYNC
              </strong>
              <span className="text-xs text-secundaria font-medium">
                Gestão de avaliações
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
            <AlternadorTema />
          </div>
        </div>
      </header>
      <section className="border-b border-borda bg-superficie">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-xs font-bold tracking-[.18em] text-secundaria">
            ADMINISTRAÇÃO
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-texto-principal">
            Gestão das avaliações
          </h1>
          <p className="mt-3 text-sm text-texto-secundario">
            Acompanhe a satisfação dos usuários e mantenha os registros.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        <section className="border border-borda bg-superficie p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void carregar();
            }}
            className="flex flex-wrap items-end gap-4"
          >
            <label className="text-sm text-texto-secundario">
              Data inicial
              <input
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className={campo}
              />
            </label>
            <label className="text-sm text-texto-secundario">
              Data final
              <input
                type="date"
                min={inicio}
                value={fim}
                onChange={(e) => setFim(e.target.value)}
                className={campo}
              />
            </label>
            <button className="bg-primaria px-5 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover">
              Aplicar aos relatórios
            </button>
            <button
              type="button"
              onClick={() => {
                setInicio("");
                setFim("");
              }}
              className="border border-borda px-5 py-3 text-sm text-texto-principal hover:bg-fundo"
            >
              Limpar
            </button>
          </form>
        </section>
        <section
          className="grid gap-5 lg:grid-cols-2"
          aria-label="Relatórios de avaliações"
        >
          <article className="border border-borda bg-superficie p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-secundaria" />
              <div>
                <p className="text-xs font-bold tracking-[.14em] text-secundaria">
                  RELATÓRIO 1
                </p>
                <h2 className="text-xl font-semibold text-texto-principal">
                  Desempenho por período
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {porPeriodo.length === 0 && (
                <p className="text-sm text-texto-secundario">
                  Sem dados no período.
                </p>
              )}
              {porPeriodo.map((item) => (
                <div key={item.periodo}>
                  <div className="flex justify-between text-sm">
                    <strong className="text-texto-principal">
                      {periodos[item.periodo]}
                    </strong>
                    <span className="text-texto-secundario">
                      {item.media.toFixed(1)} / 5 · {item.quantidade} avaliações
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden bg-fundo border border-borda">
                    <div
                      className="h-full bg-primaria"
                      style={{ width: `${item.media * 20}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-texto-secundario">
                    {item.quantidade
                      ? Math.round((item.positivas / item.quantidade) * 100)
                      : 0}
                    % positivas (4 ou 5 estrelas)
                  </p>
                </div>
              ))}
            </div>
          </article>
          <article className="border border-borda bg-superficie p-6">
            <div className="flex items-center gap-3">
              <Star className="text-secundaria" />
              <div>
                <p className="text-xs font-bold tracking-[.14em] text-secundaria">
                  RELATÓRIO 2
                </p>
                <h2 className="text-xl font-semibold text-texto-principal">
                  Distribuição das notas
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {porNota.map((item) => (
                <div
                  key={item.nota}
                  className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm"
                >
                  <span className="text-texto-principal">
                    {item.nota} estrela{item.nota !== 1 && "s"}
                  </span>
                  <div className="h-5 overflow-hidden bg-fundo border border-borda">
                    <div
                      className="h-full bg-secundaria"
                      style={{
                        width: `${(item.quantidade / maiorQuantidade) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-texto-secundario">
                    {item.quantidade}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-xs text-texto-secundario">
                Total no período: {totalNotas} avaliações
              </p>
            </div>
          </article>
        </section>
        <section
          className={
            usuario?.tipo === "administrador"
              ? "grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start"
              : ""
          }
        >
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[.14em] text-secundaria">
                  REGISTROS
                </p>
                <h2 className="mt-2 text-xl font-semibold text-texto-principal">
                  Avaliações recebidas
                </h2>
              </div>
              <label className="relative">
                <span className="sr-only">Pesquisar</span>
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-texto-secundario"
                />
                <input
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Usuário ou comentário"
                  className="border border-borda bg-input-bg py-2.5 pl-10 pr-3 text-sm text-texto-principal outline-none placeholder:text-input-placeholder focus:border-primaria"
                />
              </label>
            </div>
            <div className="mt-5 space-y-3">
              {carregando && (
                <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                  Carregando...
                </p>
              )}
              {!carregando && filtradas.length === 0 && (
                <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                  Nenhuma avaliação encontrada.
                </p>
              )}
              {avaliacoesDaPagina.map((a) => (
                <article
                  key={a.id}
                  className="border border-borda bg-superficie p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-secundaria">
                        {periodos[a.periodoRefeicao]} · {dataBr(a.servidoEm)}
                      </span>
                      <h3 className="mt-1 font-semibold text-texto-principal">
                        {a.usuarioNome}
                      </h3>
                      <p
                        className="mt-2 text-atencao text-base"
                        aria-label={`${a.nota} de 5 estrelas`}
                      >
                        {"★".repeat(a.nota)}
                        <span className="opacity-25">
                          {"★".repeat(5 - a.nota)}
                        </span>
                      </p>
                      {a.comentario && (
                        <p className="mt-2 text-sm text-texto-secundario">
                          {a.comentario}
                        </p>
                      )}
                    </div>
                    <div className="flex">
                      {usuario?.tipo === "administrador" && (
                        <button
                          onClick={() => editar(a)}
                          className="grid size-10 place-items-center text-secundaria hover:bg-fundo"
                          aria-label="Editar avaliação"
                        >
                          <Pencil size={17} />
                        </button>
                      )}
                      {usuario?.tipo === "administrador" && (
                        <button
                          onClick={() => setIdExclusao(a.id)}
                          className="grid size-10 place-items-center text-erro hover:bg-fundo"
                          aria-label="Excluir avaliação"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                  {idExclusao === a.id && (
                    <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-borda pt-4">
                      <span className="text-sm text-erro font-medium">
                        Confirma a exclusão?
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIdExclusao(null)}
                          className="border border-borda px-3 py-2 text-xs text-texto-principal hover:bg-fundo"
                        >
                          <X size={15} />
                        </button>
                        <button
                          onClick={() => void excluir(a.id)}
                          className="bg-erro px-3 py-2 text-xs font-bold text-white hover:opacity-90"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
            {!carregando && filtradas.length > 0 && (
              <nav
                className="mt-5 flex flex-col gap-3 border border-borda bg-superficie p-3 sm:flex-row sm:items-center sm:justify-between"
                aria-label="Paginação das avaliações"
              >
                <p className="text-center text-xs text-texto-secundario sm:text-left">
                  Exibindo{" "}
                  <strong className="text-texto-principal">
                    {inicioPagina + 1}–
                    {Math.min(
                      inicioPagina + avaliacoesPorPagina,
                      filtradas.length,
                    )}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-texto-principal">
                    {filtradas.length}
                  </strong>
                </p>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="grid size-9 place-items-center border border-borda text-texto-secundario transition hover:border-primaria hover:text-secundaria disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={17} />
                  </button>
                  {paginasVisiveis.map((item) =>
                    typeof item === "number" ? (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPagina(item)}
                        aria-current={item === paginaAtual ? "page" : undefined}
                        className={`grid size-9 place-items-center border text-sm font-semibold transition ${item === paginaAtual ? "border-primaria bg-primaria text-primaria-texto" : "border-borda text-texto-secundario hover:border-primaria hover:text-secundaria"}`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span
                        key={item}
                        className="grid size-9 place-items-center text-texto-secundario"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setPagina((p) => Math.min(totalPaginas, p + 1))
                    }
                    disabled={paginaAtual === totalPaginas}
                    className="grid size-9 place-items-center border border-borda text-texto-secundario transition hover:border-primaria hover:text-secundaria disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Próxima página"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </nav>
            )}
          </div>
          {usuario?.tipo === "administrador" && (
            <aside className="border border-borda bg-superficie p-6">
              <p className="text-xs font-bold tracking-[.14em] text-secundaria">
                EDIÇÃO
              </p>
              <h2 className="mt-2 text-xl font-semibold text-texto-principal">
                Editar avaliação
              </h2>
              {!idEdicao ? (
                <p className="mt-4 text-sm text-texto-secundario">
                  Selecione uma avaliação na lista.
                </p>
              ) : (
                <form onSubmit={salvar} className="mt-5">
                  <label className="text-sm text-texto-secundario">
                    Refeição
                    <select
                      required
                      value={formulario.refeicaoId}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          refeicaoId: Number(e.target.value),
                        })
                      }
                      className={campo}
                    >
                      {refeicoes.map((r) => (
                        <option
                          key={r.id}
                          value={r.id}
                          className="bg-input-bg text-texto-principal"
                        >
                          {r.nome || periodos[r.periodo]} ·{" "}
                          {r.data
                            ? r.data.slice(0, 10).split("-").reverse().join("/")
                            : "data não informada"}{" "}
                          · {periodos[r.periodo]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mt-4 block text-sm text-texto-secundario">
                    Data
                    <input
                      required
                      type="date"
                      value={formulario.servidoEm}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          servidoEm: e.target.value,
                        })
                      }
                      className={campo}
                    />
                  </label>
                  <label className="mt-4 block text-sm text-texto-secundario">
                    Nota
                    <select
                      value={formulario.nota}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          nota: Number(e.target.value),
                        })
                      }
                      className={campo}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option
                          key={n}
                          value={n}
                          className="bg-input-bg text-texto-principal"
                        >
                          {n} estrela{n !== 1 && "s"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mt-4 block text-sm text-texto-secundario">
                    Comentário
                    <textarea
                      maxLength={500}
                      rows={4}
                      value={formulario.comentario}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          comentario: e.target.value,
                        })
                      }
                      className={`${campo} resize-none`}
                    />
                  </label>
                  <div className="mt-5 flex gap-2">
                    <button
                      disabled={salvando}
                      className="inline-flex flex-1 items-center justify-center gap-2 bg-primaria px-3 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover"
                    >
                      <Check size={17} />
                      {salvando ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelar}
                      className="border border-borda px-3 text-texto-principal hover:bg-fundo"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </form>
              )}
              {erro && (
                <p role="alert" className="mt-4 text-sm text-erro">
                  {erro}
                </p>
              )}
              {mensagem && (
                <p role="status" className="mt-4 text-sm text-sucesso">
                  {mensagem}
                </p>
              )}
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
