export function partesDaData(data = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(data);

  const valores = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
  const mapaDiasSemana: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };

  return {
    dataIso: `${valores.year}-${valores.month}-${valores.day}`,
    diaSemana: mapaDiasSemana[valores.weekday ?? "Sun"] ?? 0,
  };
}

export function proximaDataLetiva(data = new Date()) {
  const proximo = new Date(data);

  do {
    proximo.setUTCDate(proximo.getUTCDate() + 1);
  } while ([0, 6].includes(partesDaData(proximo).diaSemana));

  return partesDaData(proximo);
}

export function horarioAtualEmSaoPaulo(data = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(data);
  const valores = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
  return Number(valores.hour) * 60 + Number(valores.minute);
}
