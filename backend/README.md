# Servidor — Cardápio ETE

API Node.js com TypeScript, Express e PostgreSQL para autenticação, cardápios e avaliações.

## Executar com Docker

```bash
docker compose up --build
```

A API ficará disponível em `http://localhost:3333` e o PostgreSQL em `localhost:5433`.

Para encerrar:

```bash
docker compose down
```

Os dados permanecem no volume `cardapio_postgres_data`. Para remover também os dados:

```bash
docker compose down -v
```

## Credencial inicial

- CPF: `111.111.111-11`
- Senha: `123456`

## Rotas

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| GET | `/health` | Não | Estado da API |
| POST | `/api/autenticacao/entrar` | Não | Identifica o usuário e cria uma sessão |
| POST | `/api/autenticacao/recuperar-senha` | Não | Solicita uma nova senha para aprovação administrativa |
| GET | `/api/cardapios/hoje` | Não | Cardápio de hoje |
| GET | `/api/cardapios/proximo` | Não | Próximo dia letivo |
| GET | `/api/refeicoes?data=2026-08-10&periodo=almoco&nome=frango` | Administrador ou cozinha | Lista e filtra refeições para gestão |
| POST | `/api/refeicoes` | Administrador ou cozinha | Cadastra uma refeição |
| PUT | `/api/refeicoes/:id` | Administrador ou cozinha | Atualiza uma refeição |
| DELETE | `/api/refeicoes/:id` | Administrador ou cozinha | Exclui uma refeição sem avaliações |
| GET | `/api/usuarios/recuperacoes-senha` | Administrador | Lista recuperações de senha pendentes |
| POST | `/api/usuarios/recuperacoes-senha/:id/ativar` | Administrador | Ativa a nova senha solicitada |
| DELETE | `/api/usuarios/recuperacoes-senha/:id` | Administrador | Rejeita a recuperação solicitada |
| POST | `/api/avaliacoes` | Aluno | Envia uma avaliação |
| GET | `/api/avaliacoes/minhas` | Aluno | Lista avaliações do usuário |
| GET | `/api/avaliacoes` | Administrador | Lista e filtra todas as avaliações |
| PUT | `/api/avaliacoes/:id` | Administrador ou cozinha | Atualiza uma avaliação |
| DELETE | `/api/avaliacoes/:id` | Administrador ou cozinha | Exclui uma avaliação |
| GET | `/api/avaliacoes/relatorios/periodos` | Administrador ou cozinha | Relatório por período da refeição |
| GET | `/api/avaliacoes/relatorios/notas` | Administrador ou cozinha | Relatório de distribuição das notas |

### Entrada do usuário

```json
{
  "cpf": "111.111.111-11",
  "senha": "123456"
}
```

### Avaliação

```json
{
  "refeicaoId": 1,
  "servidoEm": "2026-08-03",
  "nota": 5,
  "comentario": "Refeição muito boa."
}
```

Use no cabeçalho: `Authorization: Bearer <token>`.

### Recuperação de senha

O usuário solicita uma nova senha informando CPF e senha desejada. A API sempre devolve uma resposta neutra para não revelar CPFs cadastrados. A senha atual permanece válida durante a análise, e a nova senha é armazenada somente como hash. Apenas um administrador pode ativá-la ou rejeitar a solicitação pela gestão de usuários.

### Refeição

As refeições são identificadas pelo período. O cadastro e a edição recebem somente:

```json
{
  "data": "2026-08-10",
  "periodo": "manha",
  "nome": "Cuscuz com ovos",
  "descricao": "Uma pausa leve para começar bem o turno.",
  "imagemUrl": "https://exemplo.com/cuscuz-com-ovos.jpg"
}
```

Os períodos aceitos são `manha`, `almoco` e `tarde`.
Os horários não são armazenados no banco: `manha` é sempre 10h, `almoco` é sempre 12h e `tarde` é sempre 15h.
`imagemUrl` é opcional, aceita somente endereços HTTPS com até 2048 caracteres e pode ser removida enviando uma string vazia. URLs diretas são preservadas; links compartilhados do Google Drive são convertidos automaticamente para exibição da imagem. O arquivo do Drive precisa estar liberado para qualquer pessoa com o link.

## Modelo de usuário

Cada usuário possui:

- `id`: identificador único;
- `nome`;
- `cpf`: usado na entrada e armazenado apenas com números;
- `telefone`;
- `email`;
- `senha_hash`: a senha nunca é armazenada em texto puro;
- `tipo`: `administrador`, `cozinha` ou `aluno`;
- `criado_em`: data e horário do cadastro.

O usuário didático inicial possui o tipo `administrador`. Administradores acessam todas as gestões; o perfil cozinha gerencia refeições e avaliações; alunos acessam apenas as próprias avaliações. As permissões são verificadas no banco em cada requisição autenticada.

## PostgreSQL instalado diretamente no computador

Com o PostgreSQL local ativo, crie o usuário e o banco:

```sql
CREATE USER cardapio WITH PASSWORD 'cardapio';
CREATE DATABASE cardapio OWNER cardapio;
```

Copie `.env.example` para `.env`. O exemplo usa a porta local padrão `5432`; ajuste a conexão e a chave JWT quando necessário. Depois execute:

```bash
npm install
npm run db:migrate
npm run dev
```

O Docker continua usando sua própria configuração interna e publica o PostgreSQL em `localhost:5433`.
