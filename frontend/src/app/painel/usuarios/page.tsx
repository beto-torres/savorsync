"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { AlternadorTema } from "@/components/AlternadorTema";
import { AcessoQrCode } from "@/components/AcessoQrCode";
import { solicitarApi } from "@/lib/api";
import {
  encerrarSessaoUsuario,
  obterUsuarioAutenticado,
  useAutenticacaoUsuario,
} from "@/lib/autenticacao";

type TipoUsuario = "administrador" | "cozinha" | "aluno";
type Usuario = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  tipo: TipoUsuario;
  criadoEm: string;
};
type FormularioUsuario = Omit<Usuario, "id" | "criadoEm"> & { senha: string };
type RecuperacaoSenha = {
  id: string;
  usuarioId: string;
  nome: string;
  cpf: string;
  email: string;
  solicitadoEm: string;
};

const tipos: Array<{ valor: TipoUsuario; rotulo: string }> = [
  { valor: "administrador", rotulo: "Administrador" },
  { valor: "cozinha", rotulo: "Cozinha" },
  { valor: "aluno", rotulo: "Aluno" },
];
const vazio: FormularioUsuario = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  tipo: "aluno",
  senha: "",
};
const classeCampo =
  "mt-2 w-full border border-borda bg-input-bg px-3 py-3 text-sm text-texto-principal outline-none placeholder:text-input-placeholder focus:border-primaria focus-visible:ring-1 focus-visible:ring-primaria";
const porPagina = 8;

function formatarCpf(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function formatarTelefone(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
}
function rotuloTipo(tipo: TipoUsuario) {
  return tipos.find((item) => item.valor === tipo)?.rotulo ?? tipo;
}

export default function PaginaGestaoUsuarios() {
  const router = useRouter();
  const estaAutorizado = useAutenticacaoUsuario();
  const usuarioAtual =
    typeof window === "undefined" ? null : obterUsuarioAutenticado();
  const [usuarios, definirUsuarios] = useState<Usuario[]>([]);
  const [recuperacoes, definirRecuperacoes] = useState<RecuperacaoSenha[]>([]);
  const [formulario, definirFormulario] = useState<FormularioUsuario>(vazio);
  const [formularioAberto, definirFormularioAberto] = useState(false);
  const [idEmEdicao, definirIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, definirIdEmExclusao] = useState<string | null>(null);
  const [busca, definirBusca] = useState("");
  const [pagina, definirPagina] = useState(1);
  const [carregando, definirCarregando] = useState(true);
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState("");
  const [mensagem, definirMensagem] = useState("");

  const carregar = useCallback(async () => {
    try {
      const [listaUsuarios, listaRecuperacoes] = await Promise.all([
        solicitarApi<Usuario[]>("/api/usuarios", { autenticado: true }),
        solicitarApi<RecuperacaoSenha[]>("/api/usuarios/recuperacoes-senha", {
          autenticado: true,
        }),
      ]);
      definirUsuarios(listaUsuarios);
      definirRecuperacoes(listaRecuperacoes);
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar os usuários.",
      );
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (estaAutorizado === false) router.replace("/");
    else if (estaAutorizado === true && usuarioAtual?.tipo !== "administrador")
      router.replace("/painel");
    else if (estaAutorizado === true) {
      const temporizador = window.setTimeout(() => void carregar(), 0);
      return () => window.clearTimeout(temporizador);
    }
  }, [estaAutorizado, usuarioAtual?.tipo, carregar, router]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return termo
      ? usuarios.filter((usuario) =>
          `${usuario.nome} ${usuario.email} ${usuario.cpf} ${rotuloTipo(usuario.tipo)}`
            .toLocaleLowerCase("pt-BR")
            .includes(termo),
        )
      : usuarios;
  }, [busca, usuarios]);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const usuariosExibidos = filtrados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina,
  );

  function limpar() {
    definirFormulario(vazio);
    definirIdEmEdicao(null);
    definirErro("");
  }
  function abrirCadastro() {
    limpar();
    definirMensagem("");
    definirFormularioAberto(true);
  }
  function fecharFormulario() {
    definirFormularioAberto(false);
    limpar();
  }
  function editar(usuario: Usuario) {
    definirIdEmEdicao(usuario.id);
    definirFormulario({
      nome: usuario.nome,
      cpf: formatarCpf(usuario.cpf),
      telefone: usuario.telefone,
      email: usuario.email,
      tipo: usuario.tipo,
      senha: "",
    });
    definirErro("");
    definirMensagem("");
    definirFormularioAberto(true);
  }
  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    definirSalvando(true);
    definirErro("");
    definirMensagem("");
    try {
      await solicitarApi(
        idEmEdicao ? `/api/usuarios/${idEmEdicao}` : "/api/usuarios",
        {
          method: idEmEdicao ? "PUT" : "POST",
          autenticado: true,
          body: JSON.stringify(formulario),
        },
      );
      definirMensagem(
        idEmEdicao
          ? "Usuário atualizado com sucesso."
          : "Usuário cadastrado com sucesso.",
      );
      definirFormularioAberto(false);
      limpar();
      await carregar();
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível salvar o usuário.",
      );
    } finally {
      definirSalvando(false);
    }
  }
  async function excluir(id: string) {
    definirErro("");
    definirMensagem("");
    try {
      await solicitarApi<void>(`/api/usuarios/${id}`, {
        method: "DELETE",
        autenticado: true,
      });
      definirIdEmExclusao(null);
      definirMensagem("Usuário excluído com sucesso.");
      await carregar();
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível excluir o usuário.",
      );
      definirIdEmExclusao(null);
    }
  }
  async function ativarNovaSenha(id: string) {
    definirErro("");
    definirMensagem("");
    try {
      const resultado = await solicitarApi<{ mensagem: string }>(
        `/api/usuarios/recuperacoes-senha/${id}/ativar`,
        { method: "POST", autenticado: true },
      );
      definirMensagem(resultado.mensagem);
      await carregar();
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível ativar a nova senha.",
      );
    }
  }
  async function rejeitarRecuperacao(id: string) {
    definirErro("");
    definirMensagem("");
    try {
      await solicitarApi<void>(`/api/usuarios/recuperacoes-senha/${id}`, {
        method: "DELETE",
        autenticado: true,
      });
      definirMensagem("Solicitação de recuperação rejeitada.");
      await carregar();
    } catch (falha) {
      definirErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível rejeitar a solicitação.",
      );
    }
  }
  function sair() {
    encerrarSessaoUsuario();
    router.replace("/");
  }

  if (estaAutorizado !== true || usuarioAtual?.tipo !== "administrador")
    return (
      <main className="grid min-h-screen place-items-center bg-fundo text-sm text-texto-secundario">
        Verificando autorização...
      </main>
    );

  return (
    <main className="min-h-screen bg-fundo text-texto-principal">
      <header className="border-b border-borda bg-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
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
                Gestão de usuários
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
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-xs font-bold tracking-[0.18em] text-secundaria">
            ADMINISTRAÇÃO
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-texto-principal">
            Gestão de usuários
          </h1>
          <p className="mt-3 text-sm text-texto-secundario">
            Cadastre, edite, pesquise e exclua usuários do sistema.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="mb-8" aria-labelledby="recuperacoes-title">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center bg-primaria/15 text-secundaria">
              <KeyRound size={22} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                SEGURANÇA
              </p>
              <h2
                id="recuperacoes-title"
                className="mt-1 text-xl font-semibold text-texto-principal"
              >
                Recuperações de senha pendentes
              </h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {recuperacoes.length === 0 ? (
              <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                Nenhuma solicitação pendente.
              </p>
            ) : (
              recuperacoes.map((recuperacao) => (
                <article
                  key={recuperacao.id}
                  className="flex flex-col gap-4 border border-borda bg-superficie p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-texto-principal">
                      {recuperacao.nome}
                    </h3>
                    <p className="mt-1 text-sm text-texto-secundario">
                      {formatarCpf(recuperacao.cpf)} · {recuperacao.email}
                    </p>
                    <p className="mt-1 text-xs text-texto-secundario">
                      Solicitada em{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(recuperacao.solicitadoEm))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void rejeitarRecuperacao(recuperacao.id)}
                      className="inline-flex items-center gap-2 border border-erro px-3 py-2 text-sm font-semibold text-erro hover:bg-erro/10"
                    >
                      <X size={17} />
                      Rejeitar
                    </button>
                    <button
                      type="button"
                      onClick={() => void ativarNovaSenha(recuperacao.id)}
                      className="inline-flex items-center gap-2 bg-primaria px-3 py-2 text-sm font-bold text-primaria-texto hover:bg-primaria-hover"
                    >
                      <ShieldCheck size={17} />
                      Ativar nova senha
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
        <section aria-labelledby="lista-usuarios">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
                USUÁRIOS
              </p>
              <h2
                id="lista-usuarios"
                className="mt-2 text-xl font-semibold text-texto-principal"
              >
                Pessoas cadastradas
              </h2>
            </div>
            <button
              onClick={abrirCadastro}
              className="inline-flex items-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover"
            >
              <Plus size={18} />
              Novo usuário
            </button>
          </div>
          <label className="relative mt-5 block max-w-sm">
            <span className="sr-only">Pesquisar usuários</span>
            <Search
              className="absolute left-3 top-3 text-texto-secundario"
              size={17}
            />
            <input
              value={busca}
              onChange={(e) => {
                definirBusca(e.target.value);
                definirPagina(1);
              }}
              placeholder="Nome, CPF ou e-mail"
              className="w-full border border-borda bg-input-bg py-2.5 pl-10 pr-3 text-sm text-texto-principal outline-none placeholder:text-input-placeholder focus:border-primaria"
            />
          </label>
          {mensagem && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-sucesso">
              <Check size={17} />
              {mensagem}
            </p>
          )}
          {erro && !formularioAberto && (
            <p className="mt-4 text-sm text-erro">{erro}</p>
          )}
          <div className="mt-5" aria-live="polite">
            {carregando && (
              <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                Carregando usuários...
              </p>
            )}
            {!carregando && filtrados.length === 0 && (
              <p className="border border-borda bg-superficie p-5 text-sm text-texto-secundario">
                Nenhuma avaliação encontrada.
              </p>
            )}
            {!carregando && usuariosExibidos.length > 0 && (
              <div className="overflow-x-auto border border-borda bg-superficie">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-fundo text-xs uppercase tracking-wide text-texto-secundario">
                    <tr>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">CPF</th>
                      <th className="px-4 py-3">Telefone</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3">Perfil</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borda">
                    {usuariosExibidos.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-fundo/60">
                        <td className="px-4 py-4 font-semibold text-texto-principal">
                          {usuario.nome}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-texto-secundario">
                          {formatarCpf(usuario.cpf)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-texto-secundario">
                          {usuario.telefone}
                        </td>
                        <td className="px-4 py-4 text-texto-secundario">
                          {usuario.email}
                        </td>
                        <td className="px-4 py-4">
                          <span className="whitespace-nowrap bg-fundo border border-borda px-2 py-1 text-xs font-semibold text-secundaria">
                            {rotuloTipo(usuario.tipo)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => editar(usuario)}
                              className="grid size-9 place-items-center text-secundaria hover:bg-fundo"
                              aria-label={`Editar ${usuario.nome}`}
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              disabled={usuario.id === usuarioAtual.id}
                              onClick={() => definirIdEmExclusao(usuario.id)}
                              className="grid size-9 place-items-center text-erro hover:bg-fundo disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Excluir ${usuario.nome}`}
                              title={
                                usuario.id === usuarioAtual.id
                                  ? "Seu próprio usuário não pode ser excluído"
                                  : "Excluir usuário"
                              }
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
          </div>
          {!carregando && filtrados.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-texto-secundario">
              <p>
                {filtrados.length} usuário{filtrados.length !== 1 && "s"} ·
                Página {paginaAtual} de {totalPaginas}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={() =>
                    definirPagina((atual) => Math.max(1, atual - 1))
                  }
                  className="inline-flex items-center gap-1 border border-borda px-3 py-2 text-texto-principal hover:bg-superficie disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <button
                  disabled={paginaAtual === totalPaginas}
                  onClick={() =>
                    definirPagina((atual) => Math.min(totalPaginas, atual + 1))
                  }
                  className="inline-flex items-center gap-1 border border-borda px-3 py-2 text-texto-principal hover:bg-superficie disabled:opacity-40"
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {formularioAberto && (
        <div
          onClick={fecharFormulario}
          className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-black/70 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="formulario-usuario"
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-2xl border border-borda bg-modal-fundo p-6 shadow-2xl text-texto-principal"
          >
            <button
              onClick={fecharFormulario}
              className="absolute right-4 top-4 grid size-9 place-items-center text-texto-secundario hover:text-texto-principal"
              aria-label="Fechar formulário"
            >
              <X size={19} />
            </button>
            <p className="text-xs font-bold tracking-[0.16em] text-secundaria">
              {idEmEdicao ? "EDIÇÃO" : "CADASTRO"}
            </p>
            <h2
              id="formulario-usuario"
              className="mt-2 text-xl font-semibold text-texto-principal"
            >
              {idEmEdicao ? "Editar usuário" : "Novo usuário"}
            </h2>
            <form onSubmit={enviar} className="mt-5">
              <label className="block text-sm text-texto-secundario">
                Nome completo
                <input
                  required
                  minLength={3}
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(e) =>
                    definirFormulario({ ...formulario, nome: e.target.value })
                  }
                  className={classeCampo}
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-texto-secundario">
                  CPF
                  <input
                    required
                    inputMode="numeric"
                    value={formulario.cpf}
                    onChange={(e) =>
                      definirFormulario({
                        ...formulario,
                        cpf: formatarCpf(e.target.value),
                      })
                    }
                    className={classeCampo}
                    placeholder="000.000.000-00"
                  />
                </label>
                <label className="text-sm text-texto-secundario">
                  Telefone
                  <input
                    required
                    type="tel"
                    value={formulario.telefone}
                    onChange={(e) =>
                      definirFormulario({
                        ...formulario,
                        telefone: formatarTelefone(e.target.value),
                      })
                    }
                    className={classeCampo}
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm text-texto-secundario">
                E-mail
                <input
                  required
                  type="email"
                  maxLength={160}
                  value={formulario.email}
                  onChange={(e) =>
                    definirFormulario({ ...formulario, email: e.target.value })
                  }
                  className={classeCampo}
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-texto-secundario">
                  Tipo de acesso
                  <select
                    value={formulario.tipo}
                    onChange={(e) =>
                      definirFormulario({
                        ...formulario,
                        tipo: e.target.value as TipoUsuario,
                      })
                    }
                    className={classeCampo}
                  >
                    {tipos.map((tipo) => (
                      <option
                        key={tipo.valor}
                        value={tipo.valor}
                        className="bg-input-bg text-texto-principal"
                      >
                        {tipo.rotulo}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-texto-secundario">
                  Senha{" "}
                  {idEmEdicao && <span className="text-xs">(opcional)</span>}
                  <input
                    required={!idEmEdicao}
                    minLength={6}
                    maxLength={72}
                    type="password"
                    autoComplete="new-password"
                    value={formulario.senha}
                    onChange={(e) =>
                      definirFormulario({
                        ...formulario,
                        senha: e.target.value,
                      })
                    }
                    className={classeCampo}
                    placeholder={
                      idEmEdicao
                        ? "Manter a senha atual"
                        : "Mínimo de 6 caracteres"
                    }
                  />
                </label>
              </div>
              {erro && (
                <p className="mt-4 text-sm text-erro" role="alert">
                  {erro}
                </p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  disabled={salvando}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-primaria px-4 py-3 text-sm font-bold text-primaria-texto hover:bg-primaria-hover disabled:opacity-60"
                >
                  {idEmEdicao ? <Pencil size={18} /> : <Plus size={18} />}{" "}
                  {salvando
                    ? "Salvando..."
                    : idEmEdicao
                      ? "Salvar alterações"
                      : "Cadastrar usuário"}
                </button>
                <button
                  type="button"
                  onClick={limpar}
                  className="border border-borda px-4 py-3 text-sm text-texto-principal hover:bg-fundo"
                >
                  Limpar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {idEmExclusao && (
        <div
          onClick={() => definirIdEmExclusao(null)}
          className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exclusao-usuario"
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md border border-erro/40 bg-modal-fundo p-6 shadow-2xl text-texto-principal"
          >
            <button
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
            <h2
              id="exclusao-usuario"
              className="mt-2 text-xl font-semibold text-texto-principal"
            >
              Excluir usuário?
            </h2>
            <p className="mt-3 text-sm leading-6 text-texto-secundario">
              O usuário{" "}
              <strong className="text-texto-principal">
                {usuarios.find((item) => item.id === idEmExclusao)?.nome ??
                  "selecionado"}
              </strong>{" "}
              será removido permanentemente.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => definirIdEmExclusao(null)}
                className="flex-1 border border-borda px-4 py-3 text-sm font-semibold text-texto-principal hover:bg-fundo"
              >
                Cancelar
              </button>
              <button
                onClick={() => void excluir(idEmExclusao)}
                className="inline-flex flex-1 items-center justify-center gap-2 bg-erro px-4 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                <Trash2 size={17} />
                Excluir
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
