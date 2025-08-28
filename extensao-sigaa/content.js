// Função principal que executa quando a página carrega
function converterHorarios() {
  // 1. Dicionários para a "tradução" dos códigos de dia e turno
  const diasSemana = {
    '2': 'Segunda',
    '3': 'Terça',
    '4': 'Quarta',
    '5': 'Quinta',
    '6': 'Sexta',
    '7': 'Sábado'
  };

  const turnos = {
    'M': 'Manhã',
    'T': 'Tarde',
    'N': 'Noite'
  };

  // 2. Mapa com os horários REAIS de início e fim para cada turno
  const mapaDeHorarios = {
    'M': { // Manhã
      '1': '07:00 - 07:55',
      '2': '07:55 - 08:50',
      '3': '08:50 - 09:45',
      '4': '09:45 - 10:40',
      '5': '10:40 - 11:35',
      '6': '11:35 - 12:30'
    },
    'T': { // Tarde
      '1': '13:00 - 13:55',
      '2': '13:55 - 14:50',
      '3': '14:50 - 15:45',
      '4': '15:45 - 16:40',
      '5': '16:40 - 17:35',
      '6': '17:35 - 18:30'
    },
    'N': { // Noite
      '1': '18:30 - 19:25',
      '2': '19:25 - 20:20',
      '3': '20:20 - 21:15',
      '4': '21:15 - 22:10'
    }
  };

  // 3. Função para traduzir um único código de horário
  function traduzirHorario(codigo) {
    const dias = codigo.match(/^\d+/)[0].split('');
    const turnoLetra = codigo.match(/[MTN]/)[0];
    const horariosNumeros = codigo.match(/\d+$/)[0].split('');

    // Traduz dias e turno
    const diasTraduzidos = dias.map(dia => diasSemana[dia]).join(' e ');
    const turnoTraduzido = turnos[turnoLetra];
    
    // Pega o horário de início do primeiro número e o de fim do último número
    const primeiroHorario = horariosNumeros[0];
    const ultimoHorario = horariosNumeros[horariosNumeros.length - 1];
    
    const horaInicio = mapaDeHorarios[turnoLetra][primeiroHorario].split(' - ')[0];
    const horaFim = mapaDeHorarios[turnoLetra][ultimoHorario].split(' - ')[1];

    const horariosFormatados = `${horaInicio} - ${horaFim}`;

    // Monta a string final
    return `${diasTraduzidos} (${turnoTraduzido}) - ${horariosFormatados}`;
  }

  // 4. Encontrar e substituir os horários na página
  const labels = document.querySelectorAll('label[for^="cc_"]');

  labels.forEach(label => {
    const textoOriginal = label.textContent.trim();
    const match = textoOriginal.match(/^(\d+[MTN]\d+)/);

    if (match) {
      const codigoHorario = match[0];
      const data = textoOriginal.replace(codigoHorario, '').trim();
      
      try {
        const horarioLegivel = traduzirHorario(codigoHorario);
        
        // Substitui o conteúdo da label pelo novo formato
        label.innerHTML = `<strong>${horarioLegivel}</strong> <span style="font-size:0.9em;">${data}</span>`;
      } catch (e) {
        console.error("Erro ao traduzir o código:", codigoHorario, e);
      }
    }
  });
}

// Roda a função quando o conteúdo da página estiver carregado
window.addEventListener('load', converterHorarios);
