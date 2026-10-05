ALTER TABLE refeicoes ADD COLUMN data DATE;
ALTER TABLE refeicoes ADD COLUMN nome VARCHAR(120);

UPDATE refeicoes
SET data = CURRENT_DATE + ((dia_semana - EXTRACT(DOW FROM CURRENT_DATE)::integer + 7) % 7),
    nome = CASE periodo
      WHEN 'manha' THEN 'Lanche da manhã'
      WHEN 'almoco' THEN 'Almoço'
      ELSE 'Lanche da tarde'
    END;

ALTER TABLE refeicoes ALTER COLUMN data SET NOT NULL;
ALTER TABLE refeicoes ALTER COLUMN nome SET NOT NULL;
ALTER TABLE refeicoes DROP CONSTRAINT IF EXISTS refeicoes_dia_semana_periodo_key;
ALTER TABLE refeicoes DROP COLUMN dia_semana;
ALTER TABLE refeicoes ADD CONSTRAINT refeicoes_data_periodo_key UNIQUE (data, periodo);

CREATE INDEX refeicoes_data_idx ON refeicoes(data);
CREATE INDEX refeicoes_nome_idx ON refeicoes(nome);
