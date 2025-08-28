function inicializarExtensaoSIGAA() {
    // 1. Dicionários e Mapas para tradução
    const diasSemana = {
        '2': 'Segunda', '3': 'Terça', '4': 'Quarta',
        '5': 'Quinta', '6': 'Sexta', '7': 'Sábado'
    };
    const turnos = { 'M': 'Manhã', 'T': 'Tarde', 'N': 'Noite' };
    const mapaDeHorarios = {
        'M': { '1': '07:00 - 07:55', '2': '07:55 - 08:50', '3': '08:50 - 09:45', '4': '09:45 - 10:40', '5': '10:40 - 11:35', '6': '11:35 - 12:30' },
        'T': { '1': '13:00 - 13:55', '2': '13:55 - 14:50', '3': '14:50 - 15:45', '4': '15:45 - 16:40', '5': '16:40 - 17:35', '6': '17:35 - 18:30' },
        'N': { '1': '18:30 - 19:25', '2': '19:25 - 20:20', '3': '20:20 - 21:15', '4': '21:15 - 22:10' }
    };

    // 2. Função de tradução
    function traduzirHorario(codigo) {
        const regex = /^(?<dias>\d+)(?<turno>[MTN])(?<horas>\d+)$/;
        const grupos = codigo.match(regex)?.groups;
        if (!grupos) return codigo;

        const dias = grupos.dias.split('');
        const horas = grupos.horas.split('');
        const diasTraduzidos = dias.map(dia => diasSemana[dia]).join(' e ');
        const turnoTraduzido = turnos[grupos.turno];

        const primeiroHorario = horas[0];
        const ultimoHorario = horas[horas.length - 1];

        const horaInicio = mapaDeHorarios[grupos.turno][primeiroHorario]?.split(' - ')[0];
        const horaFim = mapaDeHorarios[grupos.turno][ultimoHorario]?.split(' - ')[1];

        if (!horaInicio || !horaFim) return codigo;

        return `${diasTraduzidos} (${turnoTraduzido}) - ${horaInicio} - ${horaFim}`;
    }

    // 3. Função que modifica a página
    function converterHorariosNaPagina() {
        const labels = document.querySelectorAll('label[for^="cc_"]');
        labels.forEach(label => {
            if (label.dataset.horarioConvertido) return;

            const textoOriginal = label.textContent.trim();
            const match = textoOriginal.match(/^(\d+[MTN]\d+)/);

            if (match) {
                const codigoHorario = match[0];
                const data = textoOriginal.replace(codigoHorario, '').trim();
                try {
                    const horarioLegivel = traduzirHorario(codigoHorario);
                    label.dataset.codigoOriginal = codigoHorario;
                    label.innerHTML = `<strong>${horarioLegivel}</strong> <span style="font-size:0.9em;">${data}</span>`;
                    label.dataset.horarioConvertido = 'true';
                } catch (e) {
                    console.error("Erro ao traduzir o código:", codigoHorario, e);
                }
            }
        });
    }

    // 4. Funções para o popup
    function monitorarSelecaoDeTurmas() {
        const checkboxes = document.querySelectorAll('input[name="selecaoTurmas"]');
        checkboxes.forEach(check => {
            check.addEventListener('change', salvarHorariosSelecionados);
        });
    }

    async function salvarHorariosSelecionados() {
        const turmasSelecionadas = [];
        const checkboxesMarcados = document.querySelectorAll('input[name="selecaoTurmas"]:checked');

        checkboxesMarcados.forEach(check => {
            const linhaTurma = check.closest('tr');
            if (!linhaTurma) return;

            // 1. Pega o ID do checkbox clicado.
            const checkId = check.id;
            // 2. Procura todas as labels na linha que são para esse checkbox.
            const labelsDaLinha = linhaTurma.querySelectorAll(`label[for="${checkId}"]`);
            
            let labelDoHorario = null;
            // 3. Encontra qual dessas labels tem o nosso código original guardado.
            labelsDaLinha.forEach(lbl => {
                if(lbl.dataset.codigoOriginal) {
                    labelDoHorario = lbl;
                }
            });

            if (labelDoHorario) {
                const codigoHorario = labelDoHorario.dataset.codigoOriginal;
                let linhaAnterior = linhaTurma.previousElementSibling;
                while (linhaAnterior && !linhaAnterior.classList.contains('disciplina')) {
                    linhaAnterior = linhaAnterior.previousElementSibling;
                }

                let codigoMateria = '???';
                if (linhaAnterior) {
                    const textoMateria = linhaAnterior.textContent;
                    const matchMateria = textoMateria.match(/(\w{3,4}\d{3,4})/);
                    if (matchMateria) {
                        codigoMateria = matchMateria[0];
                    }
                }
                turmasSelecionadas.push({ materia: codigoMateria, horario: codigoHorario });
            }
        });
        
        await chrome.storage.local.set({ horariosSalvos: turmasSelecionadas });
    }

    // --- INICIALIZAÇÃO ---
    converterHorariosNaPagina();
    monitorarSelecaoDeTurmas();
    salvarHorariosSelecionados();
}

// Usar 'load' para garantir que a tabela do SIGAA já foi completamente carregada
window.addEventListener('load', inicializarExtensaoSIGAA);
