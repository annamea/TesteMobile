/* ╔════════════════════════════════════════════════════════════════╗
   ║                  FUNÇÕES PRINCIPAIS DO BOOKING                ║
   ╚════════════════════════════════════════════════════════════════╝
*/

//Pega as informações do html e realoca elas em uma const(string)
const diasContainer = document.querySelector('.d-flex.gap-2.mb-4.justify-content-center');
const horariosContainer = document.querySelector('.time-slots-wrapper .d-grid');
const btnConfirmar = document.querySelector('.btn-senai.fw-bold');
const reservaInfo = document.querySelector('.current-reservation-card h3');
const reservaHorario = document.querySelector('.current-reservation-card span.small');

//Definindo valores nulos para os horarios e dias, para que possam ser atualizados conforme o calendario
let diaSelecionado = null;
let horarioSelecionado = null;

/* ╔════════════════════════════════════════════════════════════════╗
   ║                         GERAR DIAS DA SEMANA                   ║
   ║  Cria botões para os dias da semana e destaca o dia atual       ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function gerarDias() {
  //criando uma const com o dia de hoje
  const hoje = new Date();
  const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long' });
  const spanTitulo = diasContainer.querySelector('span');
  //pegando o nome do mês atual
  spanTitulo.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  //selcionando do html os botoes dos dias da semana 
  const botoesDias = diasContainer.querySelectorAll('.day-selector');

  //calculando a data da segunda-feira da semana atual (para que assim os 5 dias da semana fiquem centinhos no painel de disponibilidades)
  const dataInicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();
  const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  dataInicioSemana.setDate(hoje.getDate() + diffSegunda);

  //loop de percorrer cada botao e definir o dia dele com base no calculo acima
  botoesDias.forEach((btn, i) => {
    const dataAtual = new Date(dataInicioSemana);
    dataAtual.setDate(dataInicioSemana.getDate() + i);

    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;

    btn.style.display = 'inline-block';

    //mostra o numero do dia no botao
    btn.textContent = dia.toString().padStart(2, '0');
    //salava a data formatada
    btn.dataset.data = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;

    //interação do botao do dia atual ficar destacado de primeira 
    if (dataAtual.getDate() === hoje.getDate() && dataAtual.getMonth() === hoje.getMonth()) {
      btn.classList.add('active', 'btn-senai');
      btn.classList.remove('btn-senai-outline');
      diaSelecionado = btn.dataset.data;
    } else {
      btn.classList.remove('active', 'btn-senai');
      btn.classList.add('btn-senai-outline');
    }
  });

  //interação de destacar botoes quando clicados 
  botoesDias.forEach(btn => {
    if (btn.style.display !== 'none') {
      btn.addEventListener('click', () => {
        botoesDias.forEach(b => b.classList.remove('active', 'btn-senai'));
        botoesDias.forEach(b => b.classList.add('btn-senai-outline'));
        btn.classList.add('active', 'btn-senai');
        btn.classList.remove('btn-senai-outline');
        diaSelecionado = btn.dataset.data;
        horarioSelecionado = null;
        gerarHorarios();
      });
    }
  });
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                         GERAR HORÁRIOS                         ║
   ║  Cria botões para todos os horários disponíveis                ║
   ║  e gerencia a seleção do usuário                                ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function gerarHorarios() {

  //limpa horarios antigos
  horariosContainer.innerHTML = '';
  //cria uma lista e gera os horarios dos intervalos
  const horarios = [];
  gerarIntervalos('08:00', '11:30', horarios);
  gerarIntervalos('13:30', '17:30', horarios);

  //loop que gra um botao para cada horario de intervalo
  horarios.forEach(h => {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-lg', 'btn-success', 'time-slot', 'fw-bold');
    btn.textContent = h;

    //interação de cor dos botoes, quando o usuario clicar em um horario (verde) ele fica amarelo.
    btn.addEventListener('click', () => {
      if (btn.classList.contains('btn-success')) {
        //remove a seleção e restaura o verde
        horariosContainer.querySelectorAll('.btn').forEach(b => {
          if (b.classList.contains('btn-warning')) b.classList.replace('btn-warning', 'btn-success');
        });
        //se o botao continuar selecionado, continua amarelo
        btn.classList.replace('btn-success', 'btn-warning');
        //guarda o horario selecionado para confirmar depois 
        horarioSelecionado = btn.textContent;
      }
    });

    //adiciona o botao criado dentro do seu lugra, (container de horarios)
    horariosContainer.appendChild(btn);
  });
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                    FUNÇÃO AUXILIAR: gerarIntervalos            ║
   ║  Gera automaticamente os intervalos de tempo com base em       ║
   ║  uma hora de início e fim, sempre de 15 em 15 minutos.         ║
   ║  Exemplo: 08:00 - 08:15, 08:15 - 08:30 ... até o horário final.║
   ╚════════════════════════════════════════════════════════════════╝
*/
function gerarIntervalos(inicio, fim, lista) {
  let [h, m] = inicio.split(':').map(Number);
  const [hFim, mFim] = fim.split(':').map(Number);

  //loop cria os intervalos ate a hora inicial dor menor que a final
  while (h < hFim || (h === hFim && m < mFim)) {
    const horaInicio = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    //soma mais 15 minutos 
    m += 15;
    if (m >= 60) { m -= 60; h++; }

    const horaFim = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    //adiciona o intervalo na lista 
    lista.push(`${horaInicio} - ${horaFim}`);
  }
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                        CONFIRMAR RESERVA                        ║
   ║  Adiciona a reserva ao localStorage, atualiza a reserva mais    ║
   ║  próxima e mostra alerta de confirmação                         ║
   ╚════════════════════════════════════════════════════════════════╝
*/
btnConfirmar.addEventListener('click', () => {
  //verifica se o usuario escolheu um horario e um dia, caso não uma mensagem é mostrada
  if (!diaSelecionado || !horarioSelecionado) {
    alert('Selecione um dia e horário antes de confirmar!');
    return;
  }

  //cria o objeto da nova reserva com as devidas informções 
  const novaReserva = {
    dia: diaSelecionado,
    horario: horarioSelecionado,
    dataISO: converterParaISO(diaSelecionado, horarioSelecionado)
  };

  // Salva no localStorage
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

  //adiciona a nova reserva á lista e salva novamente 
  reservas.push(novaReserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));

  //atualiza a reserva mais ptoxima mostrada no booking
  atualizarReservaMaisProxima();

  //mensagem de confirmação
  alert('Reserva confirmada com sucesso!');

  //limpara o horario selecionado(evitar dupla seleção)
  horarioSelecionado = null;
});

/* ╔════════════════════════════════════════════════════════════════╗
   ║                    FUNÇÃO: converterParaISO                     ║
   ║  Converte a data e o horário escolhidos para o formato padrão   ║
   ║  ISO (ex: "2025-10-21T13:30:00.000Z").                         ║
   ║  Isso facilita a comparação de datas e ordenação das reservas.  ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function converterParaISO(dia, horario) {
  const [d, m] = dia.split('/').map(Number);  // Separa dia e mês
  const [inicio] = horario.split(' - '); // Pega a hora inicial do intervalo
  const [h, min] = inicio.split(':').map(Number);// Divide hora e minuto
   const data = new Date();
  data.setMonth(m - 1, d);  // Define mês e dia
  data.setHours(h, min, 0, 0);   // Define horário exato
  return data.toISOString();  // Retorna no formato ISO
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                  EXIBIR A RESERVA MAIS PRÓXIMA                 ║
   ║  Este bloco controla a exibição da "Reserva Mais Próxima"      ║
   ║  na página Booking.                                             ║
   ║                                                                  ║
   ║  Funções principais:                                           ║
   ║   - atualizarReservaMaisProxima(): atualiza o card da reserva  ║
   ║   - mostrarReservaMaisProxima(): mostra a reserva ao carregar  ║
   ║   - converterParaData(): converte dia/horário em objeto Date   ║
   ╚════════════════════════════════════════════════════════════════╝
*/

/* ╔════════════════════════════════════════════════════════════════╗
   ║                  FUNÇÃO: atualizarReservaMaisProxima           ║
   ║  Atualiza o card de "Minha Reserva Atual" exibindo apenas a    ║
   ║  reserva futura mais próxima.                                   ║
   ║                                                                  ║
   ║  Passos:                                                        ║
   ║   1. Busca reservas no localStorage                             ║
   ║   2. Verifica se há reservas; se não, esconde o card           ║
   ║   3. Ordena por data e hora                                     ║
   ║   4. Encontra a primeira reserva futura                         ║
   ║   5. Atualiza o card com informações                            ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function atualizarReservaMaisProxima() {
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

  // Se não houver reservas, esconde a div
  if (reservas.length === 0) {
    reservaInfo.style.display = 'none';
    return;
  }

  // Ordena reservas por data/hora (mais próxima primeiro)
  reservas.sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));
  const proxima = reservas.find(r => new Date(r.dataISO) >= new Date());

  // Se não houver reserva futura, esconde o card
  if (!proxima) {
    reservaInfo.style.display = 'none';
    return;
  }

  // Exibe o card e atualiza informações
  reservaInfo.style.display = 'block';
  reservaInfo.textContent = 'Reserva Confirmada';
  reservaInfo.classList.add('text-success');
  reservaHorario.innerHTML = `<i class="bi bi-calendar"></i> ${proxima.horario} <i class="bi bi-alarm"></i> ${proxima.dia}`;
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║           EXIBIR RESERVA MAIS PRÓXIMA AO CARREGAR             ║
   ║  Ao abrir a página Booking, esta função mostra a reserva       ║
   ║  mais próxima dentro do card principal.                        ║
   ╚════════════════════════════════════════════════════════════════╝
*/

//garante que o código só rode depois que toda a página HTML estiver carregada.
document.addEventListener('DOMContentLoaded', () => {
  mostrarReservaMaisProxima();
});

//le as reservas no local storege, trasforma em string e em um array de objets
function mostrarReservaMaisProxima() {
  const reservasSalvas = JSON.parse(localStorage.getItem('reservas')) || [];
  if (reservasSalvas.length === 0) return;

  // Converte data e hora para objeto Date e ordena
  const reservasOrdenadas = reservasSalvas
    .map(r => ({
      ...r,
      dataHora: converterParaData(r.data, r.horario)
    }))
    .sort((a, b) => a.dataHora - b.dataHora);

    //cria um avariavel agr com data e hora atual
  const agora = new Date();

  // Encontra a reserva futura mais próxima
  const proxima = reservasOrdenadas.find(r => r.dataHora >= agora);
  if (!proxima) return;

  //seleciona o card q mostratra a reserva mais proxima
  const card = document.querySelector('.current-reservation-card');
  if (!card) return;

  // Atualiza o conteúdo do card com informações da reserva
  card.innerHTML = `
    <p class="small text-muted mb-1">Próxima Reserva</p>
    <div class="d-flex justify-content-between align-items-center mb-2">
        <h3 class="me-2 align-self-center text-success">Reserva Confirmada</h3>
        <span class="small text-muted">
            <i class="bi bi-calendar"></i> ${proxima.horario} <i class="bi bi-alarm"></i> ${proxima.data}
        </span>
    </div>
  `;
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                  FUNÇÃO AUXILIAR: converterParaData            ║
   ║  Converte uma data "dd/mm" e horário "hh:mm - hh:mm"           ║
   ║  em um objeto Date para facilitar comparações e ordenação.      ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function converterParaData(dataStr, horarioStr) {
  const [dia, mes] = dataStr.split('/').map(Number);
  const [horaInicio] = horarioStr.split(' - ')[0].split(':').map(Number);
  const [minutoInicio] = horarioStr.split(' - ')[0].split(':').map(Number);
  const ano = new Date().getFullYear();
  return new Date(ano, mes - 1, dia, horaInicio, minutoInicio);
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                          INICIALIZAÇÃO                          ║
   ║  Chama as funções para gerar dias, horários e atualizar a       ║
   ║  reserva mais próxima, garantindo que o card inicie invisível. ║
   ╚════════════════════════════════════════════════════════════════╝
*/
gerarDias();
gerarHorarios();
atualizarReservaMaisProxima();
reservaInfo.style.display = 'none';
