# Contexto Codex

Este arquivo registra os prompts executados pelo Codex neste projeto durante a sessao atual.

## Historico de prompts

| Ordem | Prompt | Resultado |
| --- | --- | --- |
| 1 | `defina o projeto C:\\Users\\ESCOLA\\Documents\\CARDAPIO-ETE\\frontend` | Projeto identificado como frontend Next.js 16 com React 19, TypeScript e Tailwind CSS. |
| 2 | `crie um arquivo chamado CONTEXTO_CODEX.MD, nesse arquivo registre todos os prompts criados e executados, registre tambem no readme.md e no agents.md` | Arquivo de contexto criado e referencias adicionadas ao README e ao AGENTS. |
| 3 | `analise e aplique o que está escrito no readme, agents e o contexto_codex` | Interface didatica do cardapio escolar implementada sem backend. |
| 4 | `aplique a logomarca anexa, e estilize a página com as cores da logomarca.` | Logomarca adicionada e identidade visual atualizada com a paleta da marca. |
| 5 | `altere a posicao do botao de login para o menu do cabecalho` | Login consolidado como item textual no menu do cabecalho. |
| 6 | `configure o backend já no postgreeSQL` | PostgreSQL local (porta 5433) configurado com banco/usuario, migrações aplicadas e backend ativo. |
| 7 | `o gitignore esta configurado adequadamente?` | `.gitignore` da raiz atualizado com regras consolidadas para proteção de builds, caches e credenciais. |
| 8 | `lá no frontend, implemente a funcionalidade de alternancia de cores utilizando o localstorage, observe que já temos o padrao de cor para dark, crie agora o padrao de cor para o light com as cores [...]` | Alternância de temas Dark e Light implementada com persistência via localStorage, variáveis semânticas no Tailwind CSS v4, script anti-flash no head e componente AlternadorTema em todas as páginas. |
| 9 | `atualize o bkp do banco via docker, atualize os CONTEXTOS (frontend e backend), vou mudar de pc` | Estado atual do frontend, integração vigente, pendência de imagens e checklist para continuar o projeto em outro computador documentados. |

## Estado atual

- A página inicial consome a API e divide a exibição em duas abas: `Cardápio do dia` e `Próximo`; o botão do cabeçalho seleciona a próxima aba com rolagem suave.
- O cardápio atual usa `/api/cardapios/hoje`, o próximo usa `/api/cardapios/proximo` e as avaliações são enviadas à API com os identificadores reais das refeições.
- O token da autenticacao didatica persiste durante a aba atual com `sessionStorage` e libera as rotas protegidas do painel em `/painel`.
- O backend Node.js com Express e PostgreSQL fica em `../backend`, integrado ao PostgreSQL local na porta 5433 (ou Docker) com rotas para login, cardapios, gestao de refeicoes e feedbacks.
- Credenciais didaticas seguem o README e nao devem ser usadas fora do exercicio.
- A identidade visual usa a logomarca em `public/logo.jpg` e os tons laranja, terracota, creme e marrom dela.
- A identidade visual oferece suporte a alternância de temas Claro e Escuro, com o tema Dark usando a paleta da logomarca e o tema Light utilizando a paleta institucional ETE.
- A página inicial usa estrutura flexível com rodapé no fim da viewport; todas as páginas ficam centralizadas em uma área de até 1536 px, com margens externas e bordas laterais de contraste.
- A gestão de refeições mostra hoje e datas futuras antes das passadas; linhas já servidas recebem fundo atenuado e o marcador `JÁ SERVIDO`.
- A navegação das páginas de gestão está concentrada no cabeçalho.
- A inclusão de URL de imagem para refeições está apenas planejada e ainda não foi implementada no frontend ou backend.

## Padrões de Cores e Identidade Visual (Temas Dark e Light)

A aplicação conta com alternância dinâmica de temas entre **Dark** (tema original da marca) e **Light** (tema institucional ETE), persistida no `localStorage` sob a chave `"cardapio-ete-tema"` e aplicada via atributo HTML `data-theme` com variáveis semânticas mapeadas no Tailwind CSS v4.

### 1. Padrão de Cor - Tema Escuro (Dark Theme - Identidade Original)
- **Primária**: `#f47b35` (Laranja quente vibrante) / Hover: `#ff9a45` / Texto no botão primário: `#2a1b17`
- **Secundária**: `#ff9a45` (Laranja claro) / Hover: `#ffc18e` / Texto no botão secundário: `#2a1b17`
- **Fundo principal**: `#2a1b17` (Marrom café escuro)
- **Superfície / Cards**: `#3a241b` (Terracota escuro)
- **Cabeçalho**: `#2a1b17`
- **Bordas e divisores**: `rgba(246, 200, 156, 0.2)` / Borda forte: `rgba(246, 200, 156, 0.35)`
- **Texto principal**: `#fff5e9` (Creme claro)
- **Texto secundário**: `#f6d2ae` (Creme médio)
- **Texto destaque**: `#ff9a45`
- **Cores de status**:
  - Sucesso: `#7DBB4C` (Verde)
  - Atenção / Estrelas: `#F6C13B` (Amarelo)
  - Erro / Exclusão: `#E53935` (Vermelho)
- **Inputs e formulários**: Fundo `#2a1b17`, Texto `#fff5e9`, Placeholder `#a87456`
- **Modais e caixas de diálogo**: Fundo `#3a241b`, Backdrop `rgba(0, 0, 0, 0.75)`

### 2. Padrão de Cor - Tema Claro (Light Theme - Institucional ETE)
- **Primária**: `#B43636` (vermelho inspirado nos detalhes laterais da marca) / Hover: `#C42323` / Texto no botão primário: `#FFFFFF`
- **Secundária**: `#008EC4` (azul-ciano institucional) / Hover: `#0075A3` / Texto no botão secundário: `#FFFFFF`
- **Fundo principal**: `#F5F6FC`
- **Margens externas**: `#DDE0EB`
- **Superfície / Cards**: `#EEF0F4`
- **Cabeçalho**: `#FFFFFF`
- **Bordas e divisores**: `#DADCF0` / Borda forte: `#B8BCE0` / Borda lateral do layout: `#969BBC`
- **Texto principal**: `#292A68`
- **Texto secundário**: `#5C6080`
- **Texto destaque**: `#403B96`
- **Cores de status**:
  - Sucesso: `#7DBB4C` (Verde)
  - Atenção / Estrelas: `#F6C13B` (Amarelo)
  - Erro / Exclusão: `#E53935` (Vermelho)
- **Inputs e formulários**: Fundo `#FFFFFF`, Texto `#292A68`, Placeholder `#8589A7`
- **Modais e caixas de diálogo**: Fundo `#FFFFFF`, Backdrop `rgba(41, 42, 104, 0.55)`

## Historico de trabalho

### 2026-07-28 - Aplicacao inicial do escopo didatico

- Pedido: analisar e aplicar as orientacoes do README, AGENTS e contexto.
- Arquivos afetados: `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `package.json`, `package-lock.json` e este arquivo.
- Decisoes: interface em Client Component para os estados e eventos; dados estaticos; acesso apenas pelas credenciais didaticas; proximo cardapio pula sabado e domingo.
- Validacoes: `npm run lint` e `npm run build` concluídos com sucesso em 2026-07-28; servidor local respondeu HTTP 200 em `http://localhost:3000`.
- Pendencias: nenhuma funcional; nao ha persistencia propositalmente.

### 2026-07-28 - Aplicacao da identidade visual

- Pedido: aplicar a logomarca fornecida e as cores correspondentes na pagina.
- Arquivos afetados: `public/logo.jpg`, `src/app/page.tsx`, `src/app/globals.css` e este arquivo.
- Decisoes: a logomarca foi posicionada no cabecalho; laranja, terracota, creme e marrom substituem a paleta anterior em toda a interface.
- Validacoes: `npm run lint` e `npm run build` concluídos com sucesso em 2026-07-28.
- Pendencias: nenhuma funcional.

### 2026-07-28 - Posicao do login

- Pedido: mover o botao de login para o menu do cabecalho.
- Arquivos afetados: `src/app/page.tsx` e este arquivo.
- Decisoes: o botao passou a exibir icone e texto no menu do cabecalho; a chamada duplicada da secao inferior foi removida.
- Validacoes: `npm run lint` e `npx tsc --noEmit` concluídos com sucesso em 2026-07-28; o build ficou pendente porque o servidor de desenvolvimento permaneceu ativo.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Mascara de CPF no login

- Pedido: adicionar uma mascara de CPF ao formulario de login.
- Arquivos afetados: `src/app/page.tsx` e este arquivo.
- Decisoes: o campo aceita somente os 11 digitos do CPF e aplica automaticamente o formato `000.000.000-00` durante a digitacao, mantendo a credencial didatica existente.
- Validacoes: `npm run lint` e `npx tsc --noEmit` concluidos com sucesso em 2026-08-03; `git diff --check` nao encontrou erros.
- Pendencias: o build ficou pendente porque o servidor de desenvolvimento esta ativo na mesma pasta.

### 2026-08-03 - Dashboard protegida

- Pedido: criar uma dashboard acessivel somente depois do login bem-sucedido.
- Arquivos afetados: `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/lib/authentication.ts` e este arquivo.
- Decisoes: a sessao didatica usa `sessionStorage`; o login direciona para `/dashboard`; acessos diretos sem identificacao retornam para a pagina inicial; a dashboard apresenta resumo e cardapio com dados estaticos.
- Validacoes: `npm run lint`, `npx tsc --noEmit` e `git diff --check` concluidos com sucesso; no navegador, o acesso direto foi bloqueado, o login abriu a dashboard e o logout encerrou a sessao sem erros no console.
- Pendencias: o build ficou pendente porque o servidor de desenvolvimento esta ativo na mesma pasta.

### 2026-08-03 - Backend Node.js com PostgreSQL no Docker

- Pedido: criar o backend Node.js de acordo com o frontend, usando PostgreSQL e Docker.
- Arquivos afetados: nova estrutura em `../backend`, `README.md` e este arquivo.
- Decisoes: API Express em TypeScript; autenticacao por JWT; senha com hash; cardapio por dia letivo; feedback protegido e unico por aluno, refeicao e data; migracao e dados iniciais automaticos; PostgreSQL publicado em `5433` porque a porta local `5432` ja estava ocupada.
- Validacoes: instalacao sem vulnerabilidades conhecidas, TypeScript e build concluidos; Docker Compose validado; containers da API e PostgreSQL ativos e saudaveis; testes reais de saude, cardapios, login, feedback e resposta `401` sem token concluidos com sucesso.
- Pendencias: integrar o frontend as rotas da API em uma etapa futura.

### 2026-08-03 - Gestao completa das refeicoes

- Pedido: criar no frontend um formulario para gestao completa das refeicoes.
- Arquivos afetados: `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/refeicoes/page.tsx`, `src/lib/api.ts`, `src/lib/authentication.ts`, `README.md`, rotas e documentacao em `../backend` e este arquivo.
- Decisoes: a tela protegida `/dashboard/refeicoes` permite listar por dia util, cadastrar, editar e excluir com confirmacao; o login passou a consumir a API e armazenar o JWT no `sessionStorage`; as operacoes CRUD sao protegidas pelo mesmo token. Nesta etapa didatica, todo aluno autenticado possui acesso a gestao.
- Validacoes: lint e TypeScript do frontend, TypeScript e build do backend, reconstrucao dos containers, CRUD real no PostgreSQL e fluxo no navegador de login, acesso, filtro e preenchimento de edicao concluidos sem erros no console.
- Pendencias: separar perfis de aluno e administrador antes de uso fora do ambiente didatico; integrar cardapio publico e feedback a API.

### 2026-08-03 - Nomes e termos em portugues do Brasil

- Pedido: revisar nomes e termos em ingles e adotar linguagem clara para alunos iniciantes.
- Arquivos afetados: rotas, paginas e bibliotecas do frontend; rotas, modelo do banco, migracoes e documentacao do backend; `README.md`, `AGENTS.md` e este arquivo.
- Decisoes: `Dashboard` foi substituido por `Painel` e as rotas passaram para `/painel`; identificadores didaticos, contratos da API, tabelas e colunas foram traduzidos; termos tecnicos obrigatorios das bibliotecas e protocolos foram preservados.
- Validacoes: lint e TypeScript do frontend, TypeScript e build do backend, migracao dos dados existentes, rotas da API em portugues e fluxo de entrada ate a gestao no navegador concluidos com sucesso.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Usuarios e tipos de acesso

- Pedido: substituir a entidade aluno por usuario e criar os tipos administrador, cozinha e aluno.
- Arquivos afetados: modelo e migracoes do banco, autenticacao e avaliacoes do backend, textos e biblioteca de autenticacao do frontend, documentacao e este arquivo.
- Decisoes: `usuarios` possui id, nome, CPF, telefone, email, senha com hash, tipo e data de criacao; o enum `tipo_usuario` aceita `administrador`, `cozinha` e `aluno`; a entrada continua por CPF e senha; o usuario didatico atual foi definido como administrador para preservar o acesso a gestao.
- Validacoes: lint e TypeScript do frontend, TypeScript e build do backend, migracoes do PostgreSQL, valores do enum, retorno seguro do usuario, entrada por CPF e senha e preservacao das refeicoes foram verificados com sucesso.
- Pendencias: aplicar autorizacao diferente para cada tipo de usuario quando as regras de acesso forem definidas.

### 2026-08-03 - Refeicoes sem nome e itens

- Pedido: remover os campos nome e itens das refeicoes.
- Arquivos afetados: telas de cardapio, painel e gestao no frontend; rotas, migracoes e documentacao do backend; este arquivo.
- Decisoes: cada refeicao passou a ser identificada pelo periodo (`manha`, `almoco` ou `tarde`); o formulario mantem somente dia, periodo, horario e descricao; a migracao `005` remove as duas colunas existentes no PostgreSQL.
- Validacoes: lint e TypeScript do frontend, TypeScript e build do backend, reconstrucao dos containers, aplicacao da migracao, estrutura da tabela e resposta real da API concluidos com sucesso.
- Pendencias: o build do frontend ficou pendente porque o servidor de desenvolvimento esta ativo na mesma pasta.

### 2026-08-05 - Gestao completa dos usuarios

- Pedido: implementar a gestao completa dos usuarios.
- Arquivos afetados: autenticacao, painel e nova pagina `src/app/painel/usuarios/page.tsx` no frontend; middleware, registro de rotas e nova rota `src/routes/usuarios.ts` no backend; este arquivo.
- Decisoes: somente administradores podem listar, cadastrar, editar e excluir usuarios; CPF e telefone possuem mascara na interface; CPF e e-mail sao unicos; senha e obrigatoria no cadastro e opcional na edicao; o hash nunca e retornado; o administrador nao pode excluir a propria conta nem remover o proprio acesso administrativo.
- Validacoes: lint e TypeScript do frontend, TypeScript e build do backend concluidos com sucesso; validacao funcional da API registrada ao fim da tarefa.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Gestao completa das avaliacoes e relatorios

- Pedido: implementar a gestao completa das avaliacoes e criar dois relatorios.
- Arquivos afetados: nova pagina `src/app/painel/avaliacoes/page.tsx`, painel, rotas e documentacao de avaliacoes do backend e este arquivo.
- Decisoes: administradores podem listar com filtro de datas, pesquisar, editar e excluir avaliacoes; o relatorio por periodo mostra media, volume e percentual de notas positivas; o relatorio de distribuicao mostra os totais de uma a cinco estrelas; ambos seguem o mesmo intervalo de datas.
- Validacoes: lint, TypeScript e build do frontend; TypeScript e build do backend; CRUD real e consultas dos dois relatorios no PostgreSQL com dados temporarios.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Identificacao e permissoes por perfil

- Pedido: identificar o usuario apos a entrada e revisar as permissoes de administrador, cozinha e aluno.
- Arquivos afetados: middleware e rotas protegidas do backend; entrada, painel e paginas de gestao do frontend; documentacao e este arquivo.
- Decisoes: o painel exibe nome e perfil; administrador acessa todas as gestoes; cozinha gerencia refeicoes e avaliacoes/relatorios; aluno acessa apenas recursos pessoais e pode enviar avaliacoes; o backend consulta o perfil atual no banco a cada requisicao para invalidar imediatamente usuarios removidos ou permissoes alteradas.
- Validacoes: lint, TypeScript e build das aplicacoes; matriz dos tres perfis testada na API com respostas `200` e `403` esperadas; contas temporarias removidas.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Correcao do registro das avaliacoes

- Pedido: revisar avaliacoes que nao estavam sendo registradas.
- Arquivos afetados: `src/app/page.tsx` e este arquivo.
- Causa: o formulario apenas alterava o estado visual de sucesso e usava identificadores estaticos, sem enviar a avaliacao para a API.
- Decisoes: o cardapio de hoje passou a vir da API; o envio usa o identificador real da refeicao e a data oficial do backend; a confirmacao aparece somente apos persistencia; erros e duplicidades sao apresentados ao aluno.
- Validacoes: lint, TypeScript e build do frontend; envio real, consulta da avaliacao persistida e bloqueio de duplicidade no PostgreSQL; usuario, avaliacao e refeicao temporarios removidos.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Instalacao com PostgreSQL local ou Docker

- Pedido: permitir uso com PostgreSQL instalado, manter Docker e documentar instalacao em outro computador e apresentacao do projeto.
- Arquivos afetados: README principal, READMEs do frontend e backend, exemplos de ambiente, `.gitignore` e este arquivo.
- Decisoes: `backend/.env.example` usa PostgreSQL local na porta padrao `5432`; o Compose continua publicando `5433`; foi criado um exemplo de URL da API para o frontend; o guia principal cobre apresentacao, perfis, instalacao, migracoes, execucao, atualizacao e problemas comuns.
- Validacoes: arquivos de ambiente conferidos, configuracao Docker preservada, lint e builds registrados ao fim da tarefa.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Horarios fixos das refeicoes e resumo real

- Pedido: fixar manhã às 10h, almoço às 12h e tarde às 15h, remover o horario do banco e ajustar o resumo do dia.
- Arquivos afetados: rotas e nova migracao `006_horarios_fixos_refeicoes.sql` no backend; pagina publica, gestao de refeicoes e painel no frontend; documentacao e este arquivo.
- Decisoes: o PostgreSQL nao armazena mais `horario_servico`; a API deriva o horario pelo periodo; o formulario nao solicita horario; o painel calcula quantidade de refeicoes, proxima refeicao e avaliacoes do dia usando dados reais.
- Validacoes: TypeScript e build do backend; migracao aplicada no PostgreSQL; coluna removida; cadastro e edicao sem horario testados; lint, TypeScript e build do frontend.
- Pendencias: nenhuma funcional.

### 2026-08-06 - Correcao da conexao do frontend com a API

- Pedido: corrigir o erro `Failed to fetch` ao entrar no sistema.
- Arquivos afetados: configuracao e cliente da API do frontend, exemplos de ambiente, documentacao e este arquivo.
- Causa: o navegador tentava acessar diretamente um endereco IP antigo da rede local, que nao pertencia mais ao computador.
- Decisoes: as chamadas para `/api` passaram a usar a mesma origem do frontend; o Next.js encaminha essas chamadas para a API configurada por `API_URL`, evitando IP fixo no navegador e dependencia de CORS no acesso pela rede local.
- Validacoes: lint, TypeScript, build e fluxo real de autenticacao registrados ao fim da tarefa.
- Pendencias: nenhuma funcional.

### 2026-08-06 - Repositorio completo com frontend e backend

- Pedido: publicar o repositorio `cardapio` completo no GitHub.
- Arquivos afetados: estrutura Git da raiz, frontend, backend, documentacao e este arquivo.
- Decisoes: o repositorio principal passou para a pasta `cardapio`; o frontend foi organizado em `frontend/` e o backend em `backend/`; dependencias, builds, caches, ambientes locais e o backup do Git anterior permanecem ignorados.
- Validacoes: lint e TypeScript do frontend; TypeScript e build do backend; revisao dos arquivos versionados e do remoto.
- Pendencias: nenhuma funcional.

### 2026-08-12 - Configuração do backend com PostgreSQL local

- Pedido: configurar o backend já no PostgreSQL.
- Arquivos afetados: `backend/.env`, `frontend/CONTEXTO_CODEX.MD`.
- Decisoes: o servico PostgreSQL local ativo na porta `5433` foi configurado com o usuario `cardapio` (senha `cardapio`) e a base de dados `cardapio`; o arquivo `backend/.env` foi criado apontando para `postgresql://cardapio:cardapio@localhost:5433/cardapio`; todas as 8 migracoes SQL foram executadas e o backend dev server foi iniciado e validado.
- Validacoes: conexao com PostgreSQL confirmada; migracoes `001` a `008` concluidas com sucesso; endpoints `/health` e `/api/cardapios/hoje` responderam HTTP 200 via API direta (`http://localhost:3333`) e via proxy do frontend Next.js (`http://localhost:3000/api/cardapios/hoje`).
- Pendencias: nenhuma funcional.

### 2026-08-12 - Consolidação do .gitignore da raiz

- Pedido: verificar e configurar adequadamente o `.gitignore` para envio ao GitHub.
- Arquivos afetados: `.gitignore`, `frontend/CONTEXTO_CODEX.MD`.
- Decisoes: o arquivo `.gitignore` da raiz foi complementado para cobrir globalmente pastas de build (`dist`, `.next`, `out`, `build`), dependências (`node_modules`), arquivos de ambiente (`.env*`, preservando `.env.example`), logs e arquivos de sistema/IDEs.
- Validacoes: simulação de `git add` validada sem inclusão de arquivos temporários, caches ou credenciais locais.
- Pendencias: nenhuma funcional.

### 2026-09-18 - Ordenação de refeições por data mais recente

- Pedido: listar as refeições priorizando as datas mais atuais no topo da listagem.
- Arquivos afetados: `backend/src/routes/refeicoes.ts`, `frontend/CONTEXTO_FRONTEND.MD`.
- Decisoes: alterada a cláusula de ordenação na rota `GET /api/refeicoes` de `ORDER BY data ASC` para `ORDER BY data DESC`, mantendo a ordenação cronológica interna por período (`manha`, `almoco`, `tarde`) para o mesmo dia.
- Validacoes: query SQL revisada; backend atualizado.
- Pendencias: nenhuma funcional.

### 2026-09-18 - Correção de caracteres acentuados deformados

- Pedido: corrigir caracteres especiais e acentuações corrompidos (como `??`) exibidos na listagem de refeições.
- Causa: o arquivo de backup `database_backup.sql` havia sido gerado/salvo com codificação UTF-16LE no PowerShell sem conversão de caracteres, transformando bytes UTF-8 não-ASCII (`ç`, `ã`, `á`, etc.) em `??`.
- Decisoes: corrigidos todos os registros nas tabelas `refeicoes`, `usuarios` e `avaliacoes` no PostgreSQL via SQL UPDATE; restaurado e re-salvo o arquivo `backend/backups/database_backup.sql` em UTF-8 limpo sem BOM; documentados os comandos com codificação UTF-8 explícita no PowerShell em `CONTEXTO_BACKEND.md`.
- Validacoes: consultas SQL no banco confirmaram 0 registros com `??`; arquivo de backup validado sem caracteres corrompidos.
- Pendencias: nenhuma funcional.

### 2026-09-20 - Alternância de temas Dark e Light com localStorage

- Pedido: implementar a alternância de cores entre Dark e Light utilizando o localStorage no frontend, mantendo o padrão Dark existente e criando o padrão Light institucional com as cores fornecidas (#3F439E, #0C9FE3, #F8FAFC, #FFFFFF, #E5E7EB, #1F2937, #6B7280, status #7DBB4C, #F6C13B, #E53935), documentando ambos os padrões no CONTEXTO_FRONTEND.
- Arquivos afetados:
  - `src/lib/tema.ts`: criação do módulo de gerenciamento de tema com funções reativas (`obterTemaAtual`, `definirTema`, `alternarTema`, `useTema` com `useSyncExternalStore`), escutador de eventos personalizados e de `storage` para sincronização em tempo real entre abas.
  - `src/app/globals.css`: configuração de variáveis CSS para `:root, [data-theme="dark"]` e `[data-theme="light"]`, mapeando variáveis de tokens semânticos (`--color-fundo`, `--color-superficie`, `--color-primaria`, `--color-secundaria`, `--color-borda`, etc.) no `@theme inline` do Tailwind CSS v4.
  - `src/app/layout.tsx`: inclusão de script inline síncrono no `<head>` para verificação imediata do tema no `localStorage` antes da pintura da tela (evitando FOIT/flash de tema) e adição de `suppressHydrationWarning` na tag `<html>`.
  - `src/components/AlternadorTema.tsx`: componente acessível de alternância de tema com ícones animados `Sun` e `Moon` da biblioteca `lucide-react`.
  - `src/app/page.tsx`: integração do botão na navbar e conversão das cores fixas para tokens semânticos no cabeçalho, hero, cards das refeições e modais (login, próximo cardápio e avaliação).
  - `src/app/painel/page.tsx`: integração do alternador de tema e estilização semântica de banners, cards de resumo e botões de atalho.
  - `src/app/painel/refeicoes/page.tsx`: integração do alternador e suporte aos dois temas nos filtros, listagem, paginação e modais de criação, edição e exclusão.
  - `src/app/painel/avaliacoes/page.tsx`: integração do alternador e suporte aos dois temas nos filtros de datas, relatórios 1 e 2 com barras de progresso, listagem, estrelas e formulário de edição/exclusão.
  - `src/app/painel/usuarios/page.tsx`: integração do alternador e suporte aos dois temas na barra de pesquisa, tabela com perfis de usuários e modais de cadastro, edição e exclusão.
  - `CONTEXTO_FRONTEND.MD`: documentação completa das tabelas e especificações de cores dos padrões Dark e Light.
- Decisoes:
  - Abordagem via atributo `data-theme` no elemento raiz `<html>`, garantindo que toda a árvore de componentes responda instantaneamente à troca de classe e variável.
  - Script no `<head>` garante experiência fluida sem piscar a tela no carregamento da página.
  - Preservação de todos os termos e convenções do projeto em português brasileiro (pt-BR).
- Validacoes: checagem de tipos com `npx tsc --noEmit` concluída com 0 erros; verificação do linter com `npm run lint` concluída com 0 erros.
- Pendencias: nenhuma funcional.

### 2026-09-20 - Consolidação visual, cardápios por data e preparação para migração

- Pedido: corrigir o layout, priorizar próximas refeições, diferenciar datas passadas, reorganizar a página inicial e preparar o projeto para continuar em outro computador.
- Arquivos afetados: `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, páginas de `src/app/painel/`, `next.config.ts` e este arquivo.
- Decisões: página inicial com abas para hoje e próximo cardápio; navegação suave respeitando `prefers-reduced-motion`; rodapé no fim da viewport; conteúdo centralizado e delimitado; tema claro aproximado das cores da ETE; gestão com registros futuros primeiro e linhas passadas atenuadas.
- Integração: chamadas do navegador usam `/api`; o Next.js encaminha para `API_URL`, cujo padrão é `http://localhost:3333`.
- Validações: `npm run lint`, `npx tsc --noEmit` e `npm run build` concluídos com sucesso em 2026-09-20.
- Próxima implementação planejada: adicionar imagem opcional às refeições. No frontend, incluir `imagemUrl?: string | null` nos tipos, campo URL com pré-visualização na gestão, componente reutilizável com fallback e exibição nas duas abas da página inicial. Não há código parcial dessa funcionalidade.

## Transferência para outro computador

1. Antes da troca, revise e envie separadamente as alterações dos repositórios `frontend` e `backend` ao remoto Git; este contexto não substitui commit e push.
2. Não copie nem versione `.env`; recrie o arquivo local a partir de `.env.example`. Para Docker local, `API_URL=http://localhost:3333` atende ao proxy do Next.js.
3. No novo computador, instale uma versão atual do Node.js compatível com Next.js 16, execute `npm install` na pasta `frontend` e inicie com `npm run dev`.
4. Suba e restaure primeiro o backend seguindo `../backend/CONTEXTO_BACKEND.md`; depois confirme que `/api/cardapios/hoje` e `/api/cardapios/proximo` respondem pelo frontend.
5. Se o acesso ocorrer por outro dispositivo da rede, atualize `allowedDevOrigins` em `next.config.ts` e `CORS_ORIGIN` do backend para os novos endereços; não preserve os IPs atuais por suposição.
6. Antes de continuar o desenvolvimento, execute `npm run lint`, `npx tsc --noEmit` e `npm run build`.

## Manutencao

Antes de alterar o projeto, leia este arquivo. Ao criar, editar ou remover arquivos, acrescente um resumo objetivo ao historico, preservando os registros anteriores e sem incluir dados sensiveis.

### 2026-09-21 - Página pública da equipe

- Pedido: adicionar item de menu e apresentar 13 integrantes em cards criativos com foto, nome e informações.
- Arquivos afetados: `src/app/page.tsx`, nova rota `src/app/equipe/page.tsx`, `public/equipe-retratos.png`, README e arquivos de contexto.
- Decisões: os 13 perfis são explicitamente demonstrativos e facilmente substituíveis; uma prancha original de retratos ilustrados fictícios é recortada por CSS para manter estilo e carregamento consistentes; os cards incluem função, resumo e habilidades.
- Validações: lint, TypeScript e inspeção visual responsiva nos temas claro e escuro.
- Pendências: substituir nomes, textos e retratos quando os dados da equipe real forem fornecidos.

### 2026-09-21 - Imagens opcionais das refeições

- Pedido: exibir imagens opcionais nas refeições, com cadastro por URL e fallback visual.
- Arquivos afetados: `src/components/ImagemRefeicao.tsx`, página inicial, painel, gestão de refeições, tipo auxiliar da gestão de avaliações, README e arquivos de contexto.
- Decisões: componente reutilizável usa imagem HTML nativa para aceitar qualquer host HTTPS sem liberar origens no `next.config.ts`; ausência e falha de carregamento exibem fallback; cards públicos usam proporção 16:9 e a gestão mostra prévia e miniaturas.
- Validações: lint, TypeScript e verificação visual responsiva nos temas claro e escuro.
- Pendências: nenhuma funcional.

### 2026-09-21 - Recuperação de senha aprovada por administrador

- Pedido: criar recuperação de senha cuja ativação seja exclusiva do administrador.
- Arquivos afetados: página inicial, gestão de usuários, README e arquivos de contexto.
- Decisões: o modal público coleta CPF, nova senha e confirmação; informa que a ativação depende de aprovação; a gestão administrativa lista solicitações pendentes e oferece ações de ativar ou rejeitar.
- Validações: lint, TypeScript, fluxo real da API e inspeção visual no navegador.
- Pendências: nenhuma funcional.

### 2026-09-21 - Modelo visual de data e hora no cardápio do painel

- Pedido: aplicar o modelo `dd/MM`, divisor horizontal e horário `HHhMM` ao cardápio de hoje.
- Arquivo afetado: `src/app/painel/page.tsx` e arquivos de contexto.
- Decisão: data e hora formam um bloco compacto por refeição, com cores semânticas compatíveis com os temas e reorganização responsiva em telas pequenas.
- Validação: lint, TypeScript e revisão das classes responsivas.
- Pendências: nenhuma.

### 2026-09-21 - Compactação do modelo de data e hora

- Pedido: diminuir a fonte, aproximar data e horário e usar a mesma cor.
- Arquivo afetado: `src/app/painel/page.tsx` e arquivos de contexto.
- Decisão: bloco reduzido para fonte pequena, espaçamento de 0,25rem e azul secundário compartilhado com o rótulo “PROGRAMAÇÃO”.
- Validação: lint e TypeScript.
- Pendências: nenhuma.
