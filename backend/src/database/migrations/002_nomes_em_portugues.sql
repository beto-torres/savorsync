DO $$
BEGIN
  IF to_regclass('public.students') IS NOT NULL THEN
    ALTER TABLE students RENAME TO alunos;
    ALTER TABLE alunos RENAME COLUMN name TO nome;
    ALTER TABLE alunos RENAME COLUMN password_hash TO senha_hash;
    ALTER TABLE alunos RENAME COLUMN created_at TO criado_em;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'meal_period') THEN
    ALTER TYPE meal_period RENAME TO periodo_refeicao;
    ALTER TYPE periodo_refeicao RENAME VALUE 'morning' TO 'manha';
    ALTER TYPE periodo_refeicao RENAME VALUE 'lunch' TO 'almoco';
    ALTER TYPE periodo_refeicao RENAME VALUE 'afternoon' TO 'tarde';
  END IF;

  IF to_regclass('public.meals') IS NOT NULL THEN
    ALTER TABLE meals RENAME TO refeicoes;
    ALTER TABLE refeicoes RENAME COLUMN weekday TO dia_semana;
    ALTER TABLE refeicoes RENAME COLUMN period TO periodo;
    ALTER TABLE refeicoes RENAME COLUMN name TO nome;
    ALTER TABLE refeicoes RENAME COLUMN service_time TO horario_servico;
    ALTER TABLE refeicoes RENAME COLUMN description TO descricao;
    ALTER TABLE refeicoes RENAME COLUMN items TO itens;
  END IF;

  IF to_regclass('public.feedbacks') IS NOT NULL THEN
    ALTER TABLE feedbacks RENAME TO avaliacoes;
    ALTER TABLE avaliacoes RENAME COLUMN student_id TO aluno_id;
    ALTER TABLE avaliacoes RENAME COLUMN meal_id TO refeicao_id;
    ALTER TABLE avaliacoes RENAME COLUMN served_on TO servido_em;
    ALTER TABLE avaliacoes RENAME COLUMN rating TO nota;
    ALTER TABLE avaliacoes RENAME COLUMN comment TO comentario;
    ALTER TABLE avaliacoes RENAME COLUMN created_at TO criado_em;
  END IF;
END
$$;
