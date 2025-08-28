document.addEventListener('DOMContentLoaded', async () => {
  const diasSemanaMapa = { '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 };
  const horariosLinhas = [
    '07:00', '07:55', '08:50', '09:45', '10:40', '11:35',
    '13:00', '13:55', '14:50', '15:45', '16:40', '17:35',
    '18:30', '19:25', '20:20', '21:15'
  ];
  const mapaDeHorarios = {
    'M': ['07:00', '07:55', '08:50', '09:45', '10:40', '11:35'],
    'T': ['13:00', '13:55', '14:50', '15:45', '16:40', '17:35'],
    'N': ['18:30', '19:25', '20:20', '21:15']
  };

  const tbody = document.querySelector("#grade-horarios tbody");

  // Cria as linhas da tabela
  horariosLinhas.forEach(hora => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${hora}</td><td></td><td></td><td></td><td></td><td></td><td></td>`;
    tbody.appendChild(tr);
  });
  
  // Pega os dados salvos (uma lista de objetos)
  const data = await chrome.storage.local.get('horariosSalvos');
  const turmasSalvas = data.horariosSalvos || [];

  // Itera sobre a lista de objetos
  turmasSalvas.forEach(turma => {
    const codigoHorario = turma.horario;
    const codigoMateria = turma.materia;

    const regex = /^(?<dias>\d+)(?<turno>[MTN])(?<horas>\d+)$/;
    const grupos = codigoHorario.match(regex)?.groups;
    if (!grupos) return;

    const dias = grupos.dias.split('');
    const horas = grupos.horas.split('');

    dias.forEach(dia => {
      const coluna = diasSemanaMapa[dia];
      if (!coluna) return;

      horas.forEach(horaNum => {
        const horaStr = mapaDeHorarios[grupos.turno][parseInt(horaNum) - 1];
        const linhaIndex = horariosLinhas.indexOf(horaStr);

        if (linhaIndex > -1) {
          const linha = tbody.children[linhaIndex];
          const celula = linha.children[coluna];
          celula.classList.add('horario-preenchido');
          // Usa o código da matéria no texto
          celula.textContent = codigoMateria;
        }
      });
    });
  });
});