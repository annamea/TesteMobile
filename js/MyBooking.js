/* ╔════════════════════════════════════════════════════════════════╗
   ║                        SELEÇÃO DO MAIN                           ║
   ║  Seleciona o container principal onde as reservas serão exibidas║
   ╚════════════════════════════════════════════════════════════════╝
*/
const main = document.querySelector('main');

/* ╔════════════════════════════════════════════════════════════════╗
   ║                  CARREGAR RESERVAS SALVAS                       ║
   ║  Recupera do localStorage todas as reservas armazenadas         ║
   ╚════════════════════════════════════════════════════════════════╝
*/
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

/* ╔════════════════════════════════════════════════════════════════╗
   ║                 FUNÇÃO PARA EXIBIR RESERVAS                     ║
   ║  Renderiza todas as reservas dentro do main, mostrando          ║
   ║  mensagem se não houver nenhuma, e adiciona botão de cancelar.  ║
   ╚════════════════════════════════════════════════════════════════╝
*/
function exibirReservas() {
  main.innerHTML = ''; // limpa o conteúdo do main antes de renderizar

  // Verifica se há reservas
  if (reservas.length === 0) {
    const msg = document.createElement('p');
    msg.classList.add('text-center', 'mt-5', 'text-muted');
    msg.textContent = 'Nenhuma reserva encontrada.'; // mensagem de aviso
    main.appendChild(msg);
    return;
  }

  // Ordena as reservas pela data/hora mais próxima
  reservas
    .sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO))
    .forEach((reserva, index) => {

      /* ╔════════════════════════════════════════════════════════════╗
         ║              CRIA O CARD DE CADA RESERVA                   ║
         ║  Cada reserva ganha um container com informações e botão   ║
         ║  de cancelar.                                              ║
         ╚════════════════════════════════════════════════════════════╝
      */
      const div = document.createElement('div');
      div.classList.add('current-reservation-card', 'p-3', 'mb-4');
      div.innerHTML = `
        <p class="small text-muted mb-1">Reserva #${index + 1}</p>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h3 class="me-2 align-self-center text-success">Reserva Confirmada</h3>
            <span class="small text-muted">
                <i class="bi bi-calendar"></i> ${reserva.horario} 
                <i class="bi bi-alarm"></i> ${reserva.dia}
            </span>
        </div>
        <div class="d-flex justify-content-end pt-3 gap-3">
            <button class="btn btn-senai fw-bold cancelar-btn">Cancelar</button>
        </div>
      `;
      main.appendChild(div);

      // Botão de cancelar reserva
      const btnCancelar = div.querySelector('.cancelar-btn');
      btnCancelar.addEventListener('click', () => {
        // Remove a reserva do array
        reservas.splice(index, 1);
        // Atualiza o localStorage
        localStorage.setItem('reservas', JSON.stringify(reservas));
        // Re-renderiza as reservas
        exibirReservas();
      });
    });
}

/* ╔════════════════════════════════════════════════════════════════╗
   ║                         INICIALIZAÇÃO                           ║
   ║  Chama a função para exibir reservas ao carregar a página.      ║
   ╚════════════════════════════════════════════════════════════════╝
*/
exibirReservas();

