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
) AS refeicao(periodo, horario_servico, descricao)
ON CONFLICT (dia_semana, periodo) DO NOTHING;
