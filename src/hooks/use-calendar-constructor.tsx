export function useCalendarConstructor() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  // dia 0 do próximo mês = último dia do atual
  const lastDay = new Date(year, month + 1, 0);

  // getDay() retorna 0=domingo, 1=segunda... 6=sábado
  const startWeekDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  // preenche os vazios antes do dia 1
  let week: (number | null)[] = Array(startWeekDay).fill(null);

  for (let day = 1; day <= totalDays; day++) {
    week.push(day);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // última semana incompleta
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return {
    weeks,
    weekDays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    year,
    month: monthNames[month],
  };
}
