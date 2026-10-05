CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE tipo_usuario AS ENUM ('administrador', 'cozinha', 'aluno');

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  tipo tipo_usuario NOT NULL DEFAULT 'aluno',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE periodo_refeicao AS ENUM ('manha', 'almoco', 'tarde');

CREATE TABLE refeicoes (
  id SERIAL PRIMARY KEY,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 5),
  periodo periodo_refeicao NOT NULL,
  horario_servico TIME NOT NULL,
  descricao TEXT NOT NULL,
  UNIQUE (dia_semana, periodo)
);

CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  refeicao_id INTEGER NOT NULL REFERENCES refeicoes(id) ON DELETE RESTRICT,
  servido_em DATE NOT NULL,
  nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario VARCHAR(500),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, refeicao_id, servido_em)
);

CREATE INDEX avaliacoes_usuario_id_idx ON avaliacoes(usuario_id);
CREATE INDEX avaliacoes_servido_em_idx ON avaliacoes(servido_em);

INSERT INTO usuarios (nome, cpf, telefone, email, senha_hash, tipo)
VALUES (
  'Administrador ETE',
  '11111111111',
  '(81) 99999-9999',
  'administrador@ete.local',
  crypt('123456', gen_salt('bf', 10)),
  'administrador'
);

INSERT INTO refeicoes (dia_semana, periodo, horario_servico, descricao)
SELECT
  dia_semana,
  refeicao.periodo::periodo_refeicao,
  refeicao.horario_servico::time,
  refeicao.descricao
FROM generate_series(1, 5) AS dia_semana
CROSS JOIN (
  VALUES
    ('manha', '10:00', 'Uma pausa leve para começar bem o turno.'),
    ('almoco', '12:00', 'Refeição completa preparada para o dia de aula.'),
    ('tarde', '15:00', 'Energia para finalizar as atividades.')
) AS refeicao(periodo, horario_servico, descricao);
