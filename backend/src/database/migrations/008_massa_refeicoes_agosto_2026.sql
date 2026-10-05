INSERT INTO refeicoes (data, periodo, nome, descricao)
VALUES
  ('2026-08-06', 'manha', 'Cachorro-quente', 'Pão com carne moída ao molho e suco de fruta.'),
  ('2026-08-06', 'almoco', 'Arroz, feijão e frango', 'Arroz, feijão, frango assado, salada e fruta.'),
  ('2026-08-06', 'tarde', 'Bolo com vitamina', 'Bolo caseiro acompanhado de vitamina de banana.'),
  ('2026-08-08', 'manha', 'Cuscuz com ovos', 'Cuscuz de milho com ovos mexidos e café com leite.'),
  ('2026-08-08', 'almoco', 'Macarronada com carne', 'Macarrão ao molho de tomate com carne moída e legumes.'),
  ('2026-08-08', 'tarde', 'Sanduíche natural', 'Sanduíche de frango com salada e suco de acerola.')
ON CONFLICT (data, periodo) DO UPDATE
SET nome = EXCLUDED.nome,
    descricao = EXCLUDED.descricao;
