# Publicação — SavorSync

Repositório: https://github.com/beto-torres/savorsync

## Serviços

- Frontend: https://savorsync-gamma.vercel.app (projeto Vercel `savorsync`, pasta `frontend`).
- API: https://savorsync-api.vercel.app (projeto Vercel `savorsync-api`, pasta `backend`).
- Banco: Neon `savorsync`, projeto `lively-voice-99620873`, branch `production`, banco `savorsync`, região São Paulo.

Os dois projetos da Vercel estão vinculados ao mesmo repositório, com produção na branch `main`. Cada projeto deve manter seu próprio Root Directory. As alterações locais só participam dos próximos deploys por Git depois de commit e push.

## Variáveis de produção

No backend, configure `DATABASE_URL` com a conexão pooled do Neon (host com `-pooler`, SSL habilitado) e `JWT_SECRET` com uma chave aleatória. No frontend, configure `API_URL=https://savorsync-api.vercel.app` antes do build. Nenhum segredo deve receber o prefixo `NEXT_PUBLIC_`.

O navegador acessa `/api` no próprio frontend, e o Next.js encaminha as requisições ao backend. Para clientes web que chamem a API diretamente, configure `CORS_ORIGIN` com suas origens separadas por vírgula. As regras de data já usam explicitamente `America/Sao_Paulo`; não cadastre `TZ` na Vercel, pois é uma variável reservada.

## Migrações

As migrações `001` a `010` estão aplicadas. Em 10/11/2026, `backend/backups/database_backup.sql` foi restaurado no banco de produção: 14 usuários, 65 refeições, 364 avaliações e nenhuma solicitação de recuperação pendente. A senha administrativa online foi preservada. O estado anterior está guardado na branch Neon `backup-before-import-20261110` (`br-fragrant-king-b67l2j29`), sem compute. Para migrações futuras, use a conexão direta do Neon em `DATABASE_URL` e execute na pasta `backend`:

```powershell
npm ci
npm run db:migrate
```

O executor registra cada arquivo em `schema_migrations`. Não execute migrações automaticamente em builds de preview usando o banco de produção. Previews que precisem do banco devem usar uma branch Neon separada.

## Acesso administrativo inicial

O CPF inicial é `111.111.111-11`. A senha didática foi substituída por uma senha aleatória no Neon. Ela está na variável `INITIAL_ADMIN_PASSWORD` de `backend/.env.production`, somente neste computador; esse arquivo é ignorado pelo Git e pelo upload da Vercel. Essa variável é um registro local, não uma configuração da API. O banco local não foi alterado.

## Verificação

- `GET https://savorsync-api.vercel.app/health`
- `GET https://savorsync-gamma.vercel.app/api/cardapios/hoje`
- Entrada do usuário, carregamento do painel e QR Code com o endereço público.

Verificados em 10/11/2026: página inicial, saúde da API e cardápios atual/próximo com HTTP 200; login administrativo e consulta autenticada de usuários com HTTP 200; lint e build do frontend, typecheck e build do backend aprovados.

A inspeção visual não foi executada porque nenhum navegador estava disponível na automação.

Para desenvolvimento local e Docker, continuam valendo as instruções nos READMEs de cada pasta.
