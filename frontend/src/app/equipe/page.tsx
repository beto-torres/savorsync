"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Code2, HeartHandshake, Lightbulb, LogIn, Sparkles, Users } from "lucide-react";
import { AlternadorTema } from "@/components/AlternadorTema";
import { useAutenticacaoUsuario } from "@/lib/autenticacao";

const integrantes = [
  { nome: "João Gabriel", funcao: "Produto e estratégia", descricao: "Transforma necessidades da escola em prioridades claras para o produto.", habilidades: ["Produto", "Pesquisa"], imagem: "01" },
  { nome: "Ellen Vitória", funcao: "Desenvolvimento frontend", descricao: "Constrói interfaces rápidas, acessíveis e agradáveis em qualquer dispositivo.", habilidades: ["React", "Acessibilidade"], imagem: "02" },
  { nome: "Claudiana Rakelly", funcao: "Design de experiência", descricao: "Cuida dos fluxos, protótipos e detalhes visuais que tornam o sistema simples.", habilidades: ["UX", "UI"], imagem: "03" },
  { nome: "Bianca Felipe", funcao: "Desenvolvimento backend", descricao: "Conecta regras de negócio, autenticação e dados em uma API confiável.", habilidades: ["Node.js", "API"], imagem: "04" },
  { nome: "George Guilherme", funcao: "Dados e relatórios", descricao: "Organiza os dados e transforma avaliações em informações úteis para a equipe.", habilidades: ["PostgreSQL", "Análise"], imagem: "05" },
  { nome: "Vitor Tales", funcao: "Infraestrutura", descricao: "Mantém os ambientes consistentes e simplifica a execução com contêineres.", habilidades: ["Docker", "DevOps"], imagem: "06" },
  { nome: "Murilo Felipe", funcao: "Qualidade de software", descricao: "Explora cenários, previne regressões e protege a experiência dos usuários.", habilidades: ["Testes", "Qualidade"], imagem: "07" },
  { nome: "José Arthur", funcao: "Acessibilidade", descricao: "Garante navegação inclusiva com teclado, leitores de tela e bons contrastes.", habilidades: ["WCAG", "Inclusão"], imagem: "08" },
  { nome: "Alessandro Silva", funcao: "Conteúdo e comunicação", descricao: "Escreve textos claros e aproxima o projeto da comunidade escolar.", habilidades: ["Conteúdo", "Comunicação"], imagem: "09" },
  { nome: "Kaua de Melo", funcao: "Segurança da aplicação", descricao: "Revisa acessos, validações e fluxos para proteger contas e informações.", habilidades: ["Segurança", "Autenticação"], imagem: "10" },
  { nome: "Sandro Ricardo", funcao: "Pesquisa com usuários", descricao: "Escuta estudantes e equipe da cozinha para orientar melhorias relevantes.", habilidades: ["Entrevistas", "Descoberta"], imagem: "11" },
  { nome: "Weslley Fernandes", funcao: "Integrações", descricao: "Faz as diferentes partes do sistema conversarem de forma estável.", habilidades: ["Integração", "Arquitetura"], imagem: "12" },
  { nome: "Gustavo Ariel", funcao: "Documentação", descricao: "Registra decisões e cria materiais que ajudam todos a evoluir o projeto.", habilidades: ["Documentação", "Ensino"], imagem: "13" },
];

const versoesImagens: Partial<Record<string, string>> = {
  "02": "20261002-0617",
};

function caminhoImagemIntegrante(imagem: string) {
  const versao = versoesImagens[imagem];
  return `/integrantes/${imagem}.jpeg${versao ? `?v=${versao}` : ""}`;
}

export default function PaginaEquipe() {
  const router = useRouter();
  const estaAutenticado = useAutenticacaoUsuario();

  function mostrarProximoCardapio() {
    router.push("/#cardapios");
  }

  function definirFormularioAcessoAberto(aberto: boolean) {
    if (aberto) router.push("/?entrar=1");
  }

  return (
    <main className="min-h-screen bg-fundo text-texto-principal">
      <header className="border-b border-borda bg-header">
        <div className="mx-auto flex w-full flex-col items-stretch gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 lg:max-w-7xl">
          <Link href="/" className="flex min-w-0 items-center justify-center gap-3 sm:justify-start" aria-label="Sabor Sync, início">
            <Image src="/logo.png" alt="Logomarca Sabor Sync" width={64} height={64} priority className="rounded-full size-14 shrink-0 border border-borda object-cover" />
            <span className="min-w-0 leading-tight">
              <strong className="block text-sm tracking-wide text-texto-principal">SABOR SYNC</strong>
              <span className="block truncate text-xs text-secundaria font-medium">Cardápio ETE</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-1 sm:flex-nowrap sm:justify-start sm:gap-2" aria-label="Navegação principal">

            <button
              type="button"
              onClick={mostrarProximoCardapio}
              className="inline-flex items-center justify-center gap-2 bg-primaria px-1 py-2 text-xs font-bold text-primaria-texto shadow-md shadow-black/10 transition hover:cursor-pointer hover:bg-primaria-hover sm:px-4 sm:text-sm"
            >
              <CalendarDays size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Ver próximo cardápio</span>
              <span className="sm:hidden">Próximo</span>
            </button>
            <Link href="/equipe" className="inline-flex items-center justify-center gap-2 border border-borda bg-superficie px-1 py-2 text-xs font-bold text-texto-principal transition hover:cursor-pointer hover:bg-borda/30 sm:px-3 sm:text-sm"><Users size={17} aria-hidden="true" /><span className="hidden sm:inline">Nossa equipe</span><span className="sm:hidden">Equipe</span></Link>
            <button
              type="button"
              onClick={() => {
                if (estaAutenticado) {
                  router.push("/painel");
                  return;
                }

                definirFormularioAcessoAberto(true);
              }}
              className="inline-flex items-center justify-center gap-2 border border-borda bg-superficie px-1 py-2 text-xs font-bold text-texto-principal transition hover:cursor-pointer hover:bg-borda/30 sm:px-3 sm:text-sm"
              aria-label={estaAutenticado ? "Usuário identificado" : "Identificar usuário"}
              title={estaAutenticado ? "Usuário identificado" : "Identificar usuário"}
            >
              {estaAutenticado ? <Check size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
              <span>{estaAutenticado ? "Painel" : "Entrar"}</span>
            </button>
            <AlternadorTema />
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-borda bg-superficie">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-secundaria/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-primaria/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid w-full gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:max-w-7xl lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-stretch">
          <div>
            <div className="inline-flex items-center gap-2 border border-borda bg-fundo px-3 py-2 text-xs font-bold tracking-[0.16em] text-secundaria"><Sparkles size={15} />QUEM FAZ ACONTECER</div>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold sm:text-5xl">Ideias diferentes, um propósito em comum.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-texto-secundario sm:text-base">Uma equipe multidisciplinar que une tecnologia, escuta e cuidado para melhorar a experiência das refeições na escola.</p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="border-l-2 border-secundaria bg-fundo p-4"><Code2 className="text-secundaria" size={20} /><strong className="mt-3 block text-sm">Tecnologia com propósito</strong></div>
              <div className="border-l-2 border-primaria bg-fundo p-4"><HeartHandshake className="text-primaria" size={20} /><strong className="mt-3 block text-sm">Construção colaborativa</strong></div>
              <div className="border-l-2 border-atencao bg-fundo p-4"><Lightbulb className="text-atencao" size={20} /><strong className="mt-3 block text-sm">Aprendizado contínuo</strong></div>
            </div>
          </div>

          <aside className="relative flex min-h-72 flex-col justify-between overflow-hidden border border-borda bg-fundo p-6 sm:p-8" aria-label="Resumo da equipe">
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primaria/10 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-bold tracking-[0.16em] text-secundaria">NOSSO TIME</p>
              <p className="mt-3 text-6xl font-semibold text-texto-principal">13</p>
              <p className="mt-1 text-sm font-semibold text-texto-secundario">integrantes construindo juntos</p>
            </div>
            <div className="relative mt-8">
              <div className="flex -space-x-3" aria-hidden="true">
                {integrantes.slice(0, 5).map((integrante) => (
                  <div key={integrante.nome} className="relative size-12 overflow-hidden rounded-full border-2 border-fundo bg-superficie">
                    <Image src={caminhoImagemIntegrante(integrante.imagem)} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                ))}
                <span className="relative grid size-12 place-items-center rounded-full border-2 border-fundo bg-primaria text-xs font-bold text-primaria-texto">+8</span>
              </div>
              <p className="mt-5 border-l-2 border-primaria pl-4 text-left text-sm leading-6 text-texto-secundario">Cada pessoa contribui com uma perspectiva para transformar ideias em uma experiência melhor para a escola.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full px-5 py-10 sm:px-8 sm:py-14 lg:max-w-7xl" aria-labelledby="integrantes-title">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.16em] text-secundaria">DESENVOLVEDORES</p><h2 id="integrantes-title" className="mt-2 text-2xl font-semibold">Conheça a equipe</h2></div><p className="font-bold text-lg text-blue-400">ETE - Turma 3DSB</p></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {integrantes.map((integrante, indice) => (
            <article key={integrante.nome} className="group overflow-hidden border border-borda bg-superficie transition hover:-translate-y-1 hover:border-borda-forte hover:shadow-xl hover:shadow-black/10">
              <div className="relative aspect-square overflow-hidden bg-fundo" role="img" aria-label={`Retrato ilustrado de ${integrante.nome}`}>
                <Image
                  src={caminhoImagemIntegrante(integrante.imagem)}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 288px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 grid size-8 place-items-center bg-header/90 text-xs font-bold text-secundaria">{String(indice + 1).padStart(2, "0")}</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-secundaria">{integrante.funcao}</p>
                <h3 className="mt-2 text-lg font-semibold">{integrante.nome}</h3>
                <p className="mt-3 min-h-16 text-left text-sm leading-6 text-texto-secundario">{integrante.descricao}</p>
                <div className="mt-4 flex flex-wrap gap-2">{integrante.habilidades.map((habilidade) => <span key={habilidade} className="border border-borda bg-fundo px-2 py-1 text-[11px] font-semibold text-texto-secundario">{habilidade}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
