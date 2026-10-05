CREATE TABLE solicitacoes_recuperacao_senha (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  senha_hash TEXT NOT NULL,
  solicitado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX solicitacoes_recuperacao_senha_data_idx
ON solicitacoes_recuperacao_senha (solicitado_em DESC);
