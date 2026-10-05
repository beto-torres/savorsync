ALTER TABLE refeicoes
ADD COLUMN imagem_url VARCHAR(2048);

ALTER TABLE refeicoes
ADD CONSTRAINT refeicoes_imagem_url_valida
CHECK (
  imagem_url IS NULL
  OR imagem_url ~ '^https://'
);
