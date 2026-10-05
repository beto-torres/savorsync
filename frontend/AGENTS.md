# AGENTS.md 

Este arquivo orienta qualquer agente de IA que trabalhe neste repositório.
As instruções valem para todo o projeto, salvo quando outro `AGENTS.md` mais
específico existir em um subdiretório.

## Objetivo do projeto

O **Cardápio - ETE** Projeto didático desenvolvido com Next.js, React, TypeScript e Tailwind CSS.
A aplicação apresenta três refeições e encerra cada uma automaticamente conforme o horário. O cardápio funciona de segunda a sexta e o próximo dia letivo pula o fim de semana. Depois de se identificar, o aluno pode avaliar cada refeição com uma nota de 1 a 5 estrelas e um comentário opcional. O servidor Node.js com PostgreSQL fica em `../backend`.

Prioridades:

1. Manter o código simples, legível e adequado para alunos.
2. Fazer somente o que foi solicitado.
3. Preservar a organização e o padrão visual já existentes.
4. Explicar decisões e conceitos em português do Brasil, de forma objetiva.
5. Entregar alterações funcionais e verificadas.

## Stack obrigatória

- Next.js 16 com App Router
- React 19
- TypeScript com modo estrito
- Tailwind CSS 4 para toda a estilização
- Lucide React para ícones
- Componentes e páginas em `.tsx`
- Alias `@/*` apontando para `src/*`

Não adicionar outra biblioteca, framework de estilos ou gerenciador de estado
sem necessidade clara ou solicitação do usuário.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any Next.js code. Heed
deprecation notices.
<!-- END:nextjs-agent-rules -->

## Antes de alterar código

- Leia os arquivos relacionados à tarefa e entenda o fluxo atual.
- Leia `CONTEXTO_CODEX.md` para conhecer o estado atual, as decisões anteriores
  e o histórico de trabalho compartilhado entre computadores.
- Consulte a documentação local relevante do Next.js em
  `node_modules/next/dist/docs/`.
- Verifique APIs nos tipos e na documentação instalados quando houver aviso de
  depreciação; não use uma API apenas por memória.
- Preserve mudanças existentes do usuário e evite reformatações sem relação
  com a tarefa.
- Não crie backend, API, banco de dados ou funcionalidade real quando o pedido
  disser que a tela é apenas demonstrativa ou sem backend.

## Continuidade entre computadores

O arquivo `CONTEXTO_CODEX.md` é a memória compartilhada e versionada deste
projeto. Ele permite que outra instalação do Codex retome o trabalho depois que
o repositório for enviado ao Git e atualizado em outro computador.

- Sempre leia `CONTEXTO_CODEX.md` antes de planejar ou executar alterações.
- Ao criar, editar ou remover arquivos do projeto, atualize
  `CONTEXTO_CODEX.md` na mesma tarefa.
- Registre apenas um resumo objetivo do pedido, arquivos afetados, decisões
  importantes, validações executadas e pendências reais.
- Preserve os registros anteriores; acrescente uma nova entrada no histórico
  em vez de reescrevê-los.
- Atualize a seção "Estado atual" quando a alteração mudar funcionalidades,
  rotas, dependências ou a etapa didática do projeto.
- Não registre senhas reais, tokens, dados pessoais, conteúdo sensível nem o
  texto integral de conversas.
- Pedidos que envolvam somente análise ou explicação, sem mudança em arquivos,
  não exigem uma nova entrada.
- O histórico local de conversas não substitui este arquivo. A continuidade só
  estará disponível no outro computador depois de `commit`, `push` e
  `git pull` ou de um novo clone.

## Organização do código

- Páginas ficam em `src/app/<rota>/page.tsx`.
- Componentes compartilhados ficam em `src/components`.
- Regras auxiliares e dados didáticos reutilizáveis ficam em `src/lib`.
- Use Server Components por padrão. Adicione `"use client"` somente quando o
  componente realmente precisar de estado, eventos ou APIs do navegador.
- Prefira componentes pequenos, nomes descritivos e fluxo direto.
- Evite abstrações prematuras, arquivos genéricos e padrões complexos que
  dificultem a explicação em aula.
- Use `next/link` para navegação interna e `next/image` quando adequado.
- Garanta chaves únicas e estáveis em listas renderizadas com `map`.

## TypeScript e React

- Não use `any` quando for possível definir um tipo simples e explícito.
- Não silencie erros com `@ts-ignore`, casts desnecessários ou regras de lint
  desativadas.
- Não use tipos ou APIs marcados como depreciados.
- Em formulários, obtenha os dados a partir do elemento correto e mantenha a
  tipagem compatível com a versão instalada do React.
- Trate valores de campos como dados externos: normalize e valide antes de
  utilizá-los.
- Remova imports, variáveis e estados que deixarem de ser usados.

## Estilo visual

- Use classes do Tailwind para a formatação; mantenha CSS global apenas para
  estilos realmente globais, como fonte e cores-base.
- Preserve a identidade visual atual: fonte Poppins, fundo escuro próximo ao
  preto, verde como destaque e cantos sem arredondamento.
- Mantenha layouts discretos, responsivos e consistentes entre entrada do aluno,
  painel e páginas internas.
- Evite espaçamentos acidentais entre sidebar e conteúdo.
- Use elementos HTML semânticos e mantenha foco visível, `label` associado aos
  campos e atributos de acessibilidade apropriados.
- Use `aria-current="page"` somente no link que representa a rota atual.

## Autenticação didática

A autenticação deste projeto evolui por etapas durante as aulas. Respeite a
etapa solicitada pelo usuário:

1. Credenciais fixas e recebimento de dados do formulário.
2. Persistência com `localStorage`.
3. Persistência com `sessionStorage`.
4. Cookies e controles de acesso mais completos.

Não avance automaticamente para cookies, `AuthGuard`, backend ou práticas de
produção. Quando a aula estiver demonstrando intencionalmente uma abordagem
inicial, mantenha o exemplo pequeno e isolado. Só inclua alertas de segurança,
comparações ou melhorias futuras quando forem solicitados.

O exercício em `src/app/autenticacao/aula01` deve continuar independente da
entrada principal, salvo solicitação expressa.

## Conteúdo e dados

- Todo texto visível deve estar em português do Brasil.- 
- Dados sem backend devem ser claramente estáticos.
- Datas exibidas e filtros devem seguir o padrão brasileiro.

## Validação obrigatória

Após alterações de código:

1. Execute `npm run lint`.
2. Antes de executar `npm run build`, confirme que não existe um servidor
   `npm run dev` ativo na mesma pasta. Os dois processos compartilham `.next` e
   não devem ser executados simultaneamente.
3. Execute `npm run build` quando a mudança afetar páginas, rotas, configuração
   ou comportamento da aplicação.
4. Se o servidor de desenvolvimento não puder ser interrompido, use uma
   verificação que não altere `.next`, como `npx tsc --noEmit`, e registre que o
   build ficou pendente.
5. Revise o diff para confirmar que apenas arquivos relacionados mudaram.
6. Quando houver interface interativa, teste o fluxo principal no navegador se
   o ambiente estiver disponível.

Não declare sucesso se houver erro relevante. Informe de forma objetiva o que
foi validado e qualquer limitação encontrada.

## Git e escopo

- Não faça commit, push, mudança de visibilidade ou alteração de branches sem
  solicitação do usuário.
- Nunca descarte alterações do usuário.
- Não edite arquivos gerados, como `.next`, nem versione segredos ou arquivos
  de ambiente.
- Faça mudanças pequenas e focadas; não refatore áreas não relacionadas.

## Comunicação

- Responda em português do Brasil.
- Comece pelo resultado alcançado.
- Explique apenas os conceitos necessários para a etapa atual.
- Quando o pedido for apenas uma explicação, não altere arquivos.
- Se uma decisão realmente impedir o avanço ou mudar materialmente o resultado,
  faça uma pergunta curta; caso contrário, adote a opção mais simples e
  consistente com o projeto.
