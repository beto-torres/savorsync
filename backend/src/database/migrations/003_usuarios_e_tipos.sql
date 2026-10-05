DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario') THEN
    CREATE TYPE tipo_usuario AS ENUM ('administrador', 'cozinha', 'aluno');
  END IF;

  IF to_regclass('public.alunos') IS NOT NULL THEN
    ALTER TABLE alunos RENAME TO usuarios;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'avaliacoes' AND column_name = 'aluno_id'
  ) THEN
    ALTER TABLE avaliacoes RENAME COLUMN aluno_id TO usuario_id;
  END IF;
END
$$;

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email VARCHAR(160);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo tipo_usuario NOT NULL DEFAULT 'aluno';

UPDATE usuarios
SET telefone = COALESCE(telefone, '(81) 99999-9999'),
    email = COALESCE(email, 'administrador@ete.local'),
    nome = CASE WHEN cpf = '11111111111' THEN 'Administrador ETE' ELSE nome END,
    tipo = CASE WHEN cpf = '11111111111' THEN 'administrador'::tipo_usuario ELSE tipo END;

ALTER TABLE usuarios ALTER COLUMN telefone SET NOT NULL;
ALTER TABLE usuarios ALTER COLUMN email SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_unico_idx ON usuarios(email);
CREATE INDEX IF NOT EXISTS avaliacoes_usuario_id_idx ON avaliacoes(usuario_id);
