# Contexto compartilhado do projeto

## Estado atual

- A página inicial oferece um modal com QR Code para acesso móvel pela rede local em `http://192.168.0.179:3000`.
- A página de gestão de avaliações oferece filtros, relatórios, listagem, edição e exclusão com suporte aos temas claro e escuro.
- As refeições aceitam imagem HTTPS opcional, exibida com fallback na página inicial, painel e gestão.
- A recuperação de senha exige solicitação pública e ativação exclusiva por administrador.
- A rota pública `/equipe` apresenta 13 integrantes em cards com retratos ilustrados; os quatro primeiros nomes já são reais e os demais aguardam confirmação.
- Os retratos da equipe são arquivos independentes em `public/integrantes`, enumerados de `01.png` a `15.png`; cada perfil referencia o nome do arquivo diretamente.

## Histórico

### 2026-10-03 — Cursor dos menus públicos

- Pedido: exibir o cursor de ponteiro ao passar sobre todos os itens do menu.
- Arquivos afetados: `src/app/page.tsx`, `src/app/equipe/page.tsx` e `src/components/AlternadorTema.tsx`.
- Decisão: aplicar `hover:cursor-pointer` aos botões, links e ao alternador de tema dos menus públicos.
- Validação: lint e build do frontend.
- Pendências: nenhuma.

### 2026-10-03 — Cursor do botão de acesso móvel

- Pedido: exibir o cursor de ação no botão “Acessar no celular”.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: adicionar a classe `cursor-pointer` somente ao botão do QR Code.
- Validação: lint e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — QR Code para acesso pelo celular

- Pedido: adicionar na página inicial um link que abra um QR Code para `http://192.168.0.179:3000`.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: adicionar um botão responsivo no cabeçalho e um modal acessível com QR Code, instrução de rede e endereço clicável, reutilizando `qrcode.react` já instalado.
- Validação: lint, build de produção, inspeção do modal em desktop e mobile e reconstrução do frontend no Docker.
- Pendências: confirmar o IPv4 do computador no dia da apresentação e atualizar o endereço caso a rede atribua outro IP.

### 2026-10-03 — Espaçamento natural nos textos da equipe

- Pedido: corrigir palavras excessivamente afastadas após o uso de `text-justify` na página da equipe.
- Arquivos alterados: `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: substituir a justificação pelo alinhamento à esquerda no resumo e nas descrições dos integrantes, preservando a altura de linha.
- Validação: lint, build de produção e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — Ampliação da logo da ETE

- Pedido: aumentar em 10% a logo da ETE no cabeçalho da página inicial.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: alterar a altura de 40 para 44 px no mobile e de 44 para 48 px a partir de `sm`, preservando a proporção automática.
- Validação: lint, build de produção e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — Logo da ETE junto à marca do sistema

- Pedido: exibir o símbolo da ETE à esquerda do logotipo do Sabor Sync.
- Arquivos alterados: `src/app/page.tsx`, `next.config.ts`, `public/ete-logo.png` e contexto compartilhado.
- Decisão: integrar as duas marcas no link principal do cabeçalho, com a ETE à esquerda e um divisor discreto, mantendo dimensões responsivas.
- Validação: lint, build de produção, inspeção visual em desktop e mobile e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — Reversão da identidade institucional no início

- Pedido: reverter o exemplo de exposição da logo da ETE.
- Arquivos alterados: `src/app/page.tsx`, `next.config.ts`, `public/ete-logo.png` e contexto compartilhado.
- Decisão: restaurar integralmente o destaque inicial e o rodapé anteriores, removendo também a cópia local da logo e sua permissão específica no otimizador.
- Validação: lint, build de produção e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — Identidade institucional da ETE

- Pedido: destacar a escola responsável pelo projeto para a apresentação na feira de ciências.
- Arquivos alterados: `src/app/page.tsx`, `next.config.ts`, `public/ete-logo.png` e contexto compartilhado.
- Decisão: manter a marca Sabor Sync no cabeçalho e adicionar um bloco institucional da ETE no destaque inicial, com uma assinatura menor no rodapé; a implementação permanece isolada para fácil remoção.
- Validação: lint, build de produção, inspeção responsiva e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-03 — Correção do carregamento do logotipo

- Pedido: corrigir o logotipo quebrado nas páginas do sistema.
- Arquivos alterados: `next.config.ts` e contexto compartilhado.
- Decisão: autorizar explicitamente `/logo.png` nos padrões locais do otimizador de imagens, preservando a regra versionada dos retratos em `/integrantes/**`.
- Validação: lint, build de produção, reconstrução do frontend no Docker e resposta da imagem otimizada.
- Pendências: nenhuma.

### 2026-10-02 — Atualização do retrato 02

- Pedido: fazer o novo retrato do integrante 02 aparecer após a substituição do arquivo.
- Arquivos alterados: `src/app/equipe/page.tsx`, `next.config.ts` e contexto compartilhado.
- Decisão: acrescentar uma versão à URL da imagem 02 para invalidar o cache do otimizador de imagens do Next.js tanto no resumo quanto no card da equipe.
- Validação: lint, build de produção e reconstrução do frontend no Docker.
- Pendências: nenhuma.

### 2026-10-02 — Formatação das páginas internas do painel

- Pedido: tornar o código das páginas internas em `src/app/painel` mais legível e fácil de manter.
- Arquivos alterados: os quatro arquivos `page.tsx` do painel e contexto compartilhado.
- Decisão: aplicar formatação consistente com Prettier, expandindo tipos, JSX, handlers e condicionais que estavam condensados em linhas extensas, sem alterar lógica ou aparência.
- Validação: lint e build de produção do frontend.
- Pendências: nenhuma.

### 2026-10-02 — Limpeza do formulário de login

- Pedido: adicionar um botão de reset para limpar os campos do login.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: usar o reset nativo do formulário e, junto dele, remover a mensagem de erro e voltar o campo de senha ao modo oculto.
- Validação: lint e build de produção do frontend.
- Pendências: nenhuma.

### 2026-10-02 — Exibição da senha no login

- Pedido: permitir mostrar e ocultar a senha no formulário de login.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: adicionar um botão com ícone dentro do campo, estado alternável, textos acessíveis e `autocomplete` apropriado para senha atual.
- Validação: lint e build de produção do frontend.
- Pendências: nenhuma.

### 2026-10-02 — Imagens de refeições sem recorte

- Pedido: manter as imagens das refeições centralizadas e completamente visíveis dentro dos quadros.
- Arquivos alterados: `src/components/ImagemRefeicao.tsx` e contexto compartilhado.
- Decisão: trocar o preenchimento com recorte (`object-cover`) pelo ajuste proporcional centralizado (`object-contain object-center`) em todas as telas que usam o componente compartilhado.
- Validação: lint e build de produção do frontend.
- Pendências: nenhuma.

### 2026-10-02 — Frontend integrado ao Docker Compose

- Pedido: executar frontend, backend e PostgreSQL como três serviços Docker integrados.
- Arquivos alterados: `Dockerfile`, `.dockerignore`, `next.config.ts`, `../compose.yaml` e contexto compartilhado.
- Decisão: gerar a imagem standalone de produção do Next.js e encaminhar `/api` para `http://backend:3333` pela rede interna do Compose; o backend aguarda o banco ficar saudável e o frontend aguarda o backend.
- Validação: configuração do Compose, lint e build do frontend.
- Pendências: nenhuma.

### 2026-09-22 — Direitos autorais no rodapé

- Pedido: adicionar ao rodapé os direitos autorais e a data de criação do sistema.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: registrar o copyright de 2026 e a criação em 28 de julho de 2026, conforme o primeiro marco documentado do projeto, em um bloco responsivo separado visualmente do texto existente.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros; o build não foi executado porque o servidor de desenvolvimento está ativo.
- Pendências: nenhuma.

### 2026-09-22 — Paginação moderna das avaliações

- Pedido: criar uma paginação moderna para a listagem de avaliações recebidas.
- Arquivos alterados: `src/app/painel/avaliacoes/page.tsx` e contexto compartilhado.
- Decisão: exibir cinco avaliações por página, com resumo do intervalo, páginas numeradas, reticências adaptativas e controles anterior/próxima; a busca reinicia automaticamente na primeira página.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual no navegador concluídos sem erros; o conjunto atual de cinco registros exibiu corretamente o resumo, a página ativa e os controles desabilitados nos limites. O build não foi executado porque o servidor de desenvolvimento está ativo.
- Pendências: nenhuma.

### 2026-09-22 — Carregamento direto de imagens do Google Drive

- Pedido: verificar e corrigir um link público do Google Drive que não carregava como imagem de refeição.
- Arquivos alterados: normalizador de imagens do frontend e contexto compartilhado; o normalizador correspondente do backend também foi atualizado.
- Decisão: converter links compartilhados e URLs antigas de miniatura diretamente para `lh3.googleusercontent.com`, evitando o redirecionamento instável de `drive.google.com/thumbnail`.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção no navegador concluídos sem erros; a imagem problemática carregou com 1254 × 1254 px pelo novo endereço direto. O build não foi executado porque o servidor de desenvolvimento está ativo.
- Pendências: nenhuma.

### 2026-09-22 — Opacidade das refeições já servidas

- Pedido: reduzir a opacidade das refeições que já foram servidas, considerando data e horário.
- Arquivos alterados: `src/app/page.tsx` e contexto compartilhado.
- Decisão: comparar o instante local atual com a combinação da data do cardápio e do horário de cada refeição; refeições futuras permanecem com opacidade normal e a mesma regra libera a avaliação das refeições do dia.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros; o build não foi executado porque há processos Node ativos e um lock de desenvolvimento em `.next/dev/lock`.
- Pendências: nenhuma.

### 2026-09-22 — Links compartilhados do Google Drive nas imagens

- Pedido: aceitar tanto URLs diretas quanto links compartilhados do Google Drive nas imagens das refeições.
- Arquivos alterados: utilitário de imagem, componente de exibição, formulário de refeições e contexto compartilhado; o backend correspondente também foi atualizado.
- Decisão: converter links do Drive nos formatos `/file/d/ID/view` e `?id=ID` para o endpoint de miniatura, preservando sem alteração as URLs HTTPS diretas e mantendo compatibilidade com registros existentes.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros; o link fornecido foi convertido corretamente. O build do frontend não foi executado porque havia processos Node ativos e não foi possível confirmar se algum era o servidor de desenvolvimento dessa pasta.
- Pendências: build do frontend em um momento sem servidor de desenvolvimento ativo.

### 2026-09-21 — Largura desktop no painel administrativo

- Pedido: aplicar o limite `max-w-7xl` às telas de painel exibidas nas referências.
- Arquivos alterados: `src/app/painel/page.tsx`, `src/app/painel/refeicoes/page.tsx` e contexto compartilhado.
- Decisão: padronizar cabeçalho, apresentação e conteúdo com largura total abaixo de `lg` e `lg:max-w-7xl` centralizado no desktop; o painel principal também foi ampliado de `max-w-6xl` para `max-w-7xl`.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros; a inspeção autenticada no navegador não foi possível porque a sessão de teste foi redirecionada ao início.
- Pendências: nenhuma.

### 2026-09-21 — Largura máxima para desktop

- Pedido: aplicar `max-w-7xl` aos tamanhos de PC a partir de `lg`.
- Arquivos alterados: `src/app/page.tsx`, `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: manter os contêineres principais com largura total em telas menores e aplicar `lg:max-w-7xl` com centralização no desktop.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual em 1440 × 900 px concluídos sem erros.
- Pendências: nenhuma.

### 2026-09-21 — Marca centralizada no mobile

- Pedido: centralizar a logomarca no cabeçalho de telas móveis.
- Arquivos alterados: `src/app/page.tsx`, `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: centralizar o conjunto de logotipo e textos nas duas rotas no mobile, restaurando o alinhamento à esquerda a partir de `sm`.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual em 360 × 800 px concluídos sem erros.
- Pendências: nenhuma.

### 2026-09-21 — Menu centralizado no mobile

- Pedido: centralizar o menu em telas móveis.
- Arquivos alterados: `src/app/page.tsx`, `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: usar uma linha flexível centralizada no mobile para respeitar a largura natural dos controles, com quebra segura em telas muito estreitas; no desktop, preservar uma única linha.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual em 360 × 800 px concluídos sem erros, cortes ou quebra de linha.
- Pendências: nenhuma.

### 2026-09-21 — Painel de equipe no destaque principal

- Pedido: preencher o espaço vazio à direita da apresentação da equipe.
- Arquivo alterado: `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: adicionar um painel-resumo responsivo com total de integrantes, cinco retratos, indicador dos demais membros e uma mensagem sobre colaboração.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual em 1440 × 900 px e 360 × 800 px concluídos sem erros.
- Pendências: nenhuma.

### 2026-09-21 — Cabeçalho inicial replicado na equipe

- Pedido: copiar exatamente a estrutura e a formatação do cabeçalho da rota `/` para `/equipe`.
- Arquivos alterados: `src/app/equipe/page.tsx`, `src/app/page.tsx` e contexto compartilhado.
- Decisão: preservar as classes fornecidas e adaptar os comportamentos à navegação entre rotas; “Próximo” abre a seção de cardápios e “Entrar” abre o formulário de acesso na página inicial.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual da rota `/equipe` em 360 × 800 px concluídos sem erros.
- Pendências: nenhuma.

### 2026-09-21 — Cabeçalho móvel sem sobreposição

- Pedido: corrigir o menu da página inicial que ficava sobre o logotipo e o nome do projeto no celular.
- Arquivo alterado: `src/app/page.tsx` e contexto compartilhado.
- Decisão: separar marca e navegação em duas linhas no mobile, distribuindo as quatro ações em uma grade; a partir de `sm`, preservar o cabeçalho horizontal.
- Validação: `npm run lint`, `npx tsc --noEmit` e inspeção visual em viewport de 360 × 800 px concluídos sem erros ou sobreposição.
- Pendências: nenhuma.

### 2026-09-21 — Retratos em arquivos separados

- Pedido: substituir a prancha de imagens com coordenadas por arquivos individuais enumerados de 01 a 15.
- Arquivos alterados: `src/app/equipe/page.tsx`, `public/integrantes/01.png` a `15.png` e contexto compartilhado.
- Decisão: recortar as 15 células da prancha original em imagens quadradas de 648 px e referenciá-las pelo campo `imagem`, preservando as trocas 01↔02 e 04↔05 já solicitadas.
- Validação: `npm run lint`, `npx tsc --noEmit` e conferência das 15 imagens em 648 × 648 px concluídos sem erros.
- Pendências: substituir os nomes restantes e trocar os retratos individuais pelos arquivos definitivos quando forem fornecidos.

### 2026-09-21 — Troca dos retratos 04 e 05

- Pedido: trocar entre si as figuras do quarto e do quinto integrantes.
- Arquivo alterado: `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: inverter somente os retratos de Bianca Felipe e do quinto perfil, preservando nomes e demais informações.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros.
- Pendências: substituir os nove nomes restantes e revisar funções e descrições quando os dados forem informados.

### 2026-09-21 — Troca dos retratos 01 e 02

- Pedido: trocar entre si as figuras dos dois primeiros integrantes.
- Arquivo alterado: `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: inverter somente as posições dos retratos de João Gabriel e Ellen Vitória, preservando nomes e demais informações.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros.
- Pendências: substituir os nove nomes restantes e revisar funções e descrições quando os dados forem informados.

### 2026-09-21 — Primeiros nomes da equipe

- Pedido: desfazer a redistribuição da grade e cadastrar os nomes dos quatro primeiros integrantes.
- Arquivo alterado: `src/app/equipe/page.tsx` e contexto compartilhado.
- Decisão: restaurar a grade original e alterar somente os nomes, preservando temporariamente funções, descrições e os nove perfis demonstrativos restantes.
- Validação: `npm run lint` e `npx tsc --noEmit` concluídos sem erros.
- Pendências: substituir os nove nomes restantes e revisar funções e descrições quando os dados forem informados.

### 2026-09-21 — Página da equipe

- Pedido: adicionar ao menu uma página criativa com 13 integrantes.
- Arquivos afetados: página inicial, nova rota de equipe, prancha de retratos, README e contextos.
- Decisão: usar perfis fictícios identificados como demonstrativos e retratos ilustrados originais, evitando atribuir identidades reais sem dados fornecidos.
- Validação: lint, TypeScript e inspeção visual responsiva nos dois temas.
- Pendências: substituir pelos dados reais quando disponíveis.

### 2026-09-21 — Correção do tema na página de avaliações

- Pedido: corrigir a aplicação incorreta do tema claro em `/painel/avaliacoes`.
- Arquivo alterado: `src/app/painel/avaliacoes/page.tsx`.
- Decisão: removidos blocos antigos duplicados com cores escuras fixas, mantendo somente os componentes baseados nas variáveis globais de tema.
- Validação: `npm run lint`, verificação TypeScript e inspeção visual no navegador.
- Pendências: nenhuma.

### 2026-09-21 — Compactação da data e hora

- Pedido: reduzir e aproximar a data e o horário, usando a mesma cor.
- Arquivo afetado: `src/app/painel/page.tsx` e contextos.
- Decisão: fonte menor, divisor fino, espaçamento reduzido e azul secundário uniforme, igual ao rótulo “PROGRAMAÇÃO”.
- Validação: lint e TypeScript.
- Pendências: nenhuma.

### 2026-09-21 — Imagem opcional nas refeições

- Pedido: implementar URL HTTPS opcional de imagem da migration até as telas consumidoras.
- Arquivos afetados: páginas inicial, painel, gestão de refeições e avaliações; novo `ImagemRefeicao.tsx`; README e contextos; backend correspondente.
- Decisão: aceitar hosts HTTPS variados por meio de `<img>` nativo, com proporções consistentes e fallback para ausência ou falha.
- Validação: lint, TypeScript, testes reais da API e inspeção visual responsiva nos dois temas.
- Pendências: nenhuma.

### 2026-09-21 — Recuperação de senha

- Pedido: implementar recuperação de senha com ativação exclusiva por administrador.
- Arquivos afetados: página inicial, gestão de usuários, README e backend correspondente.
- Decisão: a senha solicitada permanece pendente e não substitui a vigente até aprovação; administradores podem ativar ou rejeitar.
- Validação: lint, TypeScript, teste integral da API e inspeção visual.
- Pendências: nenhuma.

### 2026-09-21 — Modelo de data e hora no painel

- Pedido: usar no cardápio do painel o modelo visual com data sobre divisor e horário abaixo.
- Arquivo afetado: `src/app/painel/page.tsx` e contextos.
- Decisão: formato `dd/MM` e `HHhMM`, repetido por refeição e responsivo.
- Validação: lint, TypeScript e revisão das classes responsivas.
- Pendências: nenhuma.
