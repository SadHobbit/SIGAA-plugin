// Função principal que executa quando a página carrega
function converterHorarios() {
  // 1. Dicionários para a "tradução" dos códigos
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

  // 2. Função para traduzir um único código de horário
  function traduzirHorario(codigo) {
    // Separa os dias, turno e horários usando expressões regulares
    const dias = codigo.match(/^\d+/)[0].split('');
    const turnoLetra = codigo.match(/[MTN]/)[0];
    const horariosNumeros = codigo.match(/\d+$/)[0].split('');

    // Traduz cada parte
    const diasTraduzidos = dias.map(dia => diasSemana[dia]).join(' e ');
    const turnoTraduzido = turnos[turnoLetra];
    const horariosFormatados = horariosNumeros.map(h => `${h}º`).join(', ');

    // Monta a string final
    return `${diasTraduzidos} (${turnoTraduzido}) - Horários: ${horariosFormatados}`;
  }

  // 3. Encontrar todos os elementos que contêm os horários
  // Pela análise do HTML, os horários estão em labels dentro de TDs.
  // Selecionamos todas as labels que começam com "cc_" no atributo 'for'.
  const labels = document.querySelectorAll('label[for^="cc_"]');

  labels.forEach(label => {
    // Pega o texto da label, ex: "24T12 (01/09/2025 - 10/01/2026)"
    const textoOriginal = label.textContent.trim();

    // Usa uma expressão regular para encontrar o padrão de código de horário
    const match = textoOriginal.match(/^(\d+[MTN]\d+)/);

    if (match) {
      const codigoHorario = match[0];
      const data = textoOriginal.replace(codigoHorario, '').trim();
      
      try {
        const horarioLegivel = traduzirHorario(codigoHorario);
        
        // 4. Substitui o conteúdo da label pelo novo formato
        // Mantemos a data original para não perder informação
        label.innerHTML = `<strong>${horarioLegivel}</strong> <span style="font-size:0.9em;">${data}</span>`;
      } catch (e) {
        // Se der algum erro na tradução, não faz nada e mantém o original.
        console.error("Erro ao traduzir o código:", codigoHorario, e);
      }
    }
  });
}

// Roda a função quando o conteúdo da página estiver carregado
window.addEventListener('load', converterHorarios);