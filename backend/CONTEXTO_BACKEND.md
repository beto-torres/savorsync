# Contexto Codex — Backend

Este arquivo registra o contexto, as decisões de arquitetura e o histórico de trabalho executado no backend deste projeto.

## Historico de prompts

### 2026-09-22 - Carregamento direto de imagens do Google Drive

- Pedido: corrigir um link público do Google Drive que falhava quando incorporado nas refeições.
- Arquivo alterado: `src/lib/imagem.ts` e contexto compartilhado.
- Decisão: normalizar links do Drive para o endereço direto `lh3.googleusercontent.com`, evitando o redirecionamento do endpoint de miniaturas; URLs antigas já salvas continuam sendo reconhecidas pelo parâmetro `id`.
- Validação: `npm run typecheck` concluído sem erros; o frontend confirmou no navegador o carregamento da imagem problemática em 1254 × 1254 px pelo endereço direto.
- Pendências: nenhuma.

| Ordem | Prompt | Resultado |
| --- | --- | --- |
| 1 | `criar o backend Node.js de acordo com o frontend, usando PostgreSQL e Docker` | API Express em TypeScript com autenticação JWT, PostgreSQL conteinerizado e migrações iniciais. |
| 2 | `revisar nomes e termos em ingles e adotar linguagem clara para alunos iniciantes` | Identificadores, tabelas, colunas e contratos da API traduzidos para português do Brasil. |
| 3 | `substituir a entidade aluno por usuario e criar os tipos administrador, cozinha e aluno` | Estrutura de usuários com enum de perfis, senhas com hash bcrypt e validação de permissões no banco. |
| 4 | `implementar a gestao completa dos usuarios` | CRUD de usuários exclusivo para administradores com validações de unicidade de CPF e e-mail. |
| 5 | `implementar a gestao completa das avaliacoes e criar dois relatorios` | Endpoints de CRUD de avaliações, relatório por período (médias e % positivas) e distribuição por notas. |
| 6 | `fixar manhã às 10h, almoço às 12h e tarde às 15h, remover o horario do banco` | Horários de serviço derivados diretamente pelo período da refeição; migração 006 aplicada. |
| 7 | `configurar o backend já no postgreeSQL` | Conexão local porta 5433 configurada com banco/usuário `cardapio`, migrações aplicadas e rotas validadas. |
| 8 | `para listagem das refeições, mostre pelas datas mais atuais` | Listagem ajustada para mostrar primeiro hoje e as próximas datas em ordem crescente; datas passadas aparecem depois, da mais recente para a mais antiga. |
| 9 | `verifique que alguns caracteres estao deformados, ajuste` | Correção de caracteres acentuados no PostgreSQL, conversão do backup para UTF-8 limpo sem BOM e comandos atualizados. |
| 10 | `atualize o bkp do banco via docker, atualize os CONTEXTOS (frontend e backend), vou mudar de pc` | Dump Docker atualizado e validado; estado atual, pendências e roteiro de migração para outro computador documentados. |

## Estado atual

- A API foi desenvolvida em Node.js com TypeScript, Express 5 e PostgreSQL (`pg`), utilizando Docker Compose na porta `3333` e banco na porta `5433`.
- A autenticação utiliza tokens JWT (expiração de 8h), com senhas protegidas por hash bcrypt (custo 10).
- As permissões (`administrador`, `cozinha`, `aluno`) são validadas a cada requisição diretamente no banco de dados via middleware.
- Refeições são vinculadas a datas específicas e aos períodos `manha`, `almoco` e `tarde`, com horários fixos (10:00, 12:00 e 15:00) derivados pela API.
- A listagem de refeições coloca datas de hoje/futuras primeiro (ordem crescente) e datas passadas depois (ordem decrescente), mantendo manhã, almoço e tarde dentro de cada dia; há paginação e filtros por data, período e nome.
- `GET /api/cardapios/proximo` retorna a menor data futura que realmente possui refeições; somente na ausência de cadastro futuro usa o próximo dia letivo como resposta vazia.
- Alunos avaliam as refeições com nota de 1 a 5 estrelas e comentário opcional, respeitando a janela de liberação (após o horário do serviço no mesmo dia).
- O módulo de avaliações fornece relatórios analíticos de desempenho por período e distribuição percentual de notas.
- O banco de dados possui 8 migrações estruturais e massa de dados em `src/database/migrations/`.
- O backup do banco de dados reside em `backups/database_backup.sql`, padronizado em formato texto plano com codificação UTF-8 limpa. Foi atualizado em 2026-09-20 com 14 usuários, 65 refeições, 4 avaliações e 8 migrações.
- A inclusão opcional de imagem nas refeições está planejada, mas ainda não foi implementada. A proposta é adicionar `imagem_url`, expor `imagemUrl` na API e manter compatibilidade com refeições sem imagem.

## Backup e Restauracao do Banco de Dados

Este repositório mantém um backup completo dos dados e da estrutura na pasta `backups/database_backup.sql`.

### Como gerar um novo backup

Com os contêineres do Docker ativos, execute na pasta `backend`:

```bash
docker compose exec -T postgres sh -c "pg_dump -U cardapio -d cardapio --clean --if-exists > /tmp/database_backup.sql"
docker compose cp postgres:/tmp/database_backup.sql backups/database_backup.sql
```

> [!NOTE]
> O parâmetro `--clean --if-exists` inclui os comandos para limpar o banco antes da recriação das tabelas. A geração dentro do contêiner evita conversões de codificação pelo PowerShell.

> [!TIP]
> **Por que usar `.sql` em vez de `.dump`?** O formato em texto plano facilita o versionamento e inspeção de diffs no Git, além de permitir restaurações simplificadas diretamente via `psql`.

### Como restaurar o backup

1. Inicie o contêiner do PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Execute a restauração dentro da pasta `backend`:
   *No Windows PowerShell:*
   ```powershell
   Get-Content -Encoding utf8 backups\database_backup.sql | docker compose exec -T postgres psql -U cardapio -d cardapio
   ```
   *No Linux / macOS / Git Bash:*
   ```bash
   cat backups/database_backup.sql | docker compose exec -T postgres psql -U cardapio -d cardapio
   ```

> [!WARNING]
> A restauração no modo `--clean` apagará os dados correntes das tabelas antes de reinserir os registros do backup.

## Historico de trabalho

### 2026-09-22 - Links compartilhados do Google Drive nas imagens

- Pedido: aceitar links compartilhados do Google Drive além de URLs diretas para imagens das refeições.
- Arquivos alterados: `src/lib/imagem.ts`, rota de refeições e contexto compartilhado.
- Decisão: normalizar links do Drive para uma URL de imagem antes de persistir; outras URLs HTTPS continuam inalteradas.
- Validacao: `npm run build` concluido sem erros; conversao conferida com o link fornecido e com uma URL direta.
- Pendências: nenhuma.

### 2026-08-03 - Criacao inicial da API Node.js com PostgreSQL e Docker

- Pedido: criar a API de backend em Node.js com PostgreSQL e suporte a Docker de acordo com os requisitos do cardápio escolar.
- Arquivos afetados: `src/server.ts`, `src/app.ts`, `src/config.ts`, `src/database/*`, `compose.yaml`, `Dockerfile`, `package.json`.
- Decisoes: arquitetura Express em TypeScript; JWT para sessões; rotas estruturadas para autenticação, cardápio do dia e feedbacks; migrações automáticas no startup; PostgreSQL mapeado para a porta 5433 para evitar conflito com instâncias locais existentes.
- Validacoes: contêineres saudáveis no Docker; testes de endpoints com respostas HTTP 200 e bloqueio 401 sem token.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Gestao completa das refeicoes

- Pedido: criar rotas de gestão de refeições para permitir listagem com filtros, criação, atualização e exclusão.
- Arquivos afetados: `src/routes/refeicoes.ts`, `src/app.ts`.
- Decisoes: endpoints CRUD protegidos por token; suporte a paginação e filtros por data, período e nome; bloqueio de exclusão quando existirem avaliações vinculadas (`foreign key restrict`).
- Validacoes: criação, edição e exclusão de refeições validadas diretamente no banco de dados.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Padronizacao de nomes e termos em portugues do Brasil

- Pedido: traduzir rotas, parâmetros, identificadores e esquema do banco de dados para português claro.
- Arquivos afetados: `src/routes/*`, `src/database/migrations/002_nomes_em_portugues.sql`.
- Decisoes: rotas migradas para `/api/autenticacao`, `/api/cardapios`, `/api/refeicoes`, `/api/avaliacoes`; tabelas e colunas renomeadas no PostgreSQL preservando compatibilidade.
- Validacoes: migração aplicada com sucesso; contratos JSON em português validados com o frontend.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Modelo de usuarios e tipos de acesso

- Pedido: evoluir a entidade de usuário para suportar os tipos administrador, cozinha e aluno.
- Arquivos afetados: `src/database/migrations/003_usuarios_e_tipos.sql`, `src/routes/autenticacao.ts`.
- Decisoes: tabela `usuarios` com nome, CPF único (apenas números), telefone, e-mail único, hash bcrypt da senha e enum `tipo_usuario`; retorno sanitizado de dados de perfil.
- Validacoes: autenticação testada para todos os tipos de perfil com integridade de restrições única no PostgreSQL.
- Pendencias: nenhuma funcional.

### 2026-08-03 - Refeicoes identificadas por periodo

- Pedido: remover campos de itens complexos e identificar as refeições pelos períodos fixos.
- Arquivos afetados: `src/database/migrations/005_remover_nome_e_itens_refeicoes.sql`, `src/routes/refeicoes.ts`.
- Decisoes: simplificação da estrutura de cardápio centrada nos períodos `manha`, `almoco` e `tarde`.
- Validacoes: migração executada sem perdas de registros; esquema validado no PostgreSQL.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Modulo de gestao de usuarios

- Pedido: implementar gestão administrativa de usuários (CRUD).
- Arquivos afetados: `src/routes/usuarios.ts`, `src/app.ts`, `src/middleware/autenticacao.ts`.
- Decisoes: acesso exclusivo para administradores; proteção contra autoexclusão e auto-remoção do próprio papel administrativo; senha opcional na edição; unicidade tratada com mensagens amigáveis de erro (409 Conflict).
- Validacoes: operações CRUD executadas com sucesso; validações de CPF e e-mail duplicados confirmadas.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Gestao completa de avaliacoes e relatorios

- Pedido: implementar rotas para consulta e moderação de avaliações, além de relatórios analíticos de satisfação.
- Arquivos afetados: `src/routes/avaliacoes.ts`, `src/app.ts`.
- Decisoes: relatórios agregados via SQL: `/relatorios/periodos` (média, contagem e percentual positivo) e `/relatorios/notas` (distribuição de 1 a 5 estrelas via `generate_series`); filtros por intervalo de datas.
- Validacoes: consultas analíticas testadas com dados reais e filtros combinados.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Identificacao e permissoes por perfil

- Pedido: proteger endpoints da API de acordo com os papéis `administrador`, `cozinha` e `aluno`.
- Arquivos afetados: `src/middleware/autenticacao.ts`, `src/routes/*`.
- Decisoes: consulta do perfil no banco em tempo real a cada requisição para invalidar imediatamente permissões revogadas ou contas excluídas; middleware utilitário `exigirTipos(...)`.
- Validacoes: matriz de permissões testada com retornos HTTP 200, 401 e 403 adequados a cada perfil.
- Pendencias: nenhuma funcional.

### 2026-08-05 - Horarios fixos derivados por periodo

- Pedido: padronizar horários das refeições (10h, 12h, 15h) e remover armazenamento redundante de horário no banco.
- Arquivos afetados: `src/database/migrations/006_horarios_fixos_refeicoes.sql`, `src/routes/cardapios.ts`, `src/routes/refeicoes.ts`.
- Decisoes: coluna `horario_servico` removida; horários derivados via SQL `CASE periodo` e lógica utilitária na API; simplificação do cadastro e manutenção.
- Validacoes: migração 006 executada; retornos da API continuam entregando o horário de serviço formatado.
- Pendencias: nenhuma funcional.

### 2026-08-12 - Configuracao do backend com PostgreSQL local

- Pedido: configurar conexão direta com PostgreSQL na porta 5433 e validar migrações.
- Arquivos afetados: `backend/.env`.
- Decisoes: criação do banco e usuário `cardapio`; aplicação sequencial de todas as 8 migrações; testes dos endpoints `/health` e `/api/cardapios/hoje`.
- Validacoes: conexão validada; integridade do banco confirmada.
- Pendencias: nenhuma funcional.

### 2026-09-18 - Ordenacao de refeicoes por data mais recente

- Pedido: listar as refeições mostrando as datas mais atuais no topo da listagem.
- Arquivos afetados: `src/routes/refeicoes.ts`.
- Decisoes: alteração da cláusula SQL na rota `GET /api/refeicoes` de `ORDER BY data ASC` para `ORDER BY data DESC`, preservando a ordem cronológica interna do dia (`CASE periodo WHEN 'manha' THEN 1 WHEN 'almoco' THEN 2 ELSE 3 END`).
- Validacoes: consulta SQL validada no PostgreSQL; refeições recentes exibidas na primeira página.
- Pendencias: nenhuma funcional.

### 2026-09-20 - Datas válidas, próximo cardápio e backup para migração

- Pedido: priorizar próximas refeições, buscar a próxima data realmente cadastrada e preparar banco e documentação para uso em outro computador.
- Arquivos afetados: `src/routes/refeicoes.ts`, `src/routes/cardapios.ts`, `backups/database_backup.sql` e este arquivo.
- Decisões: a listagem separa registros atuais/futuros dos passados; `/api/cardapios/proximo` consulta `MIN(data)` estritamente futura; o dump foi produzido dentro do PostgreSQL Docker e copiado sem transformação de codificação.
- Validações: contêineres `api` e `postgres` ativos; PostgreSQL saudável; dump de 20.322 bytes sem BOM, com blocos `COPY` para usuários, refeições e avaliações; contagens confirmadas em 14 usuários, 65 refeições, 4 avaliações e 8 migrações.
- Pendências: implementar, em etapa futura, a URL opcional de imagem das refeições (migração 009, contratos da API e validação de URL). Nenhuma parte dessa funcionalidade foi criada ainda.

## Transferencia para outro computador

1. Antes de trocar de máquina, revise e envie separadamente as alterações dos repositórios `backend` e `frontend` ao remoto Git. Não versione arquivos `.env`.
2. No novo computador, instale Git, Node.js compatível com o projeto e Docker Desktop; clone/atualize os dois repositórios.
3. Na pasta `backend`, execute `docker compose up -d postgres` e aguarde o estado saudável.
4. Restaure `backups/database_backup.sql` usando o comando documentado acima. A restauração é destrutiva para os dados que já estiverem no banco de destino.
5. Suba a API com `docker compose up -d --build api` ou instale as dependências e execute localmente conforme o README.
6. Recrie configurações locais a partir de `.env.example`; segredos e arquivos `.env` não acompanham o Git.
7. Confirme `GET /health`, `GET /api/cardapios/hoje` e `GET /api/cardapios/proximo` antes de iniciar o frontend.

### 2026-09-18 - Correcao de caracteres acentuados deformados

- Pedido: corrigir caracteres especiais e acentuações que estavam corrompidos como `??`.
- Causa: arquivo de backup gerado ou restaurado sem codificação UTF-8 explícita no PowerShell.
- Arquivos afetados: `backups/database_backup.sql`, banco de dados PostgreSQL, `CONTEXTO_BACKEND.md`.
- Decisoes: execução de script SQL de correção em todas as tabelas afetadas (`refeicoes`, `usuarios` e `avaliacoes`); conversão e regravação do arquivo `backups/database_backup.sql` em UTF-8 limpo sem BOM; atualização dos comandos de backup e restauração com parâmetro explícito `-Encoding utf8`.
- Validacoes: consultas no banco retornaram 0 ocorrências de `??`; arquivo de backup verificado sem caracteres corrompidos.
- Pendencias: nenhuma funcional.

## Manutencao

Antes de alterar o projeto, leia este arquivo. Ao criar, editar ou remover arquivos, acrescente um resumo objetivo ao historico, preservando os registros anteriores e sem incluir dados sensiveis.

### 2026-09-21 - Imagem HTTPS opcional nas refeições

- Pedido: permitir uma imagem opcional por refeição em todas as rotas de gestão e cardápio.
- Arquivos afetados: migration `009_adicionar_imagem_url_refeicoes.sql`, rotas `refeicoes.ts` e `cardapios.ts`, README, backup e este arquivo.
- Decisões: `imagem_url` aceita `NULL` ou URL iniciada por `https://`, com limite de 2048 caracteres e restrição também no PostgreSQL; string vazia é normalizada para `NULL`.
- Validações: typecheck e build; migration aplicada no Docker; criação sem imagem, rejeição de HTTP, atualização HTTPS, remoção da imagem, retorno no GET e limpeza do registro temporário.
- Pendências: nenhuma funcional.

### 2026-09-21 - Recuperação de senha com aprovação administrativa

- Pedido: permitir recuperação de senha, exigindo ativação exclusiva por administrador.
- Arquivos afetados: migration `010_solicitacoes_recuperacao_senha.sql`, rotas de autenticação e usuários, README, backup e este arquivo.
- Decisões: a solicitação pública armazena somente o hash da senha desejada e devolve resposta neutra; a senha vigente continua funcionando até a aprovação; somente administradores podem listar, ativar ou rejeitar solicitações.
- Validações: solicitação `202`; senha nova rejeitada antes da aprovação e aceita depois; senha anterior invalidada na ativação; rejeição preserva a senha vigente; usuário temporário removido.
- Pendências: nenhuma funcional.
