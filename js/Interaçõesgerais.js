/* ╔════════════════════════════════════════════════════════════════╗
   ║               SELEÇÃO DO INPUT DE SENHA E ÍCONE                ║
   ║  Pega o campo de senha e o ícone do olho para alternar         ║
   ║  visibilidade.                                                  ║
   ╚════════════════════════════════════════════════════════════════╝
*/
// Seleciona o input de senha
const senhaInput = document.getElementById('senha');
// Seleciona o segundo span do parent (que contém o ícone do olho)
const olhoSpan = senhaInput.parentElement.querySelectorAll('span')[1];
// Seleciona o ícone dentro do span
const olhoIcon = olhoSpan.querySelector('i');

/* ╔════════════════════════════════════════════════════════════════════╗
   ║                 FUNÇÃO DE TOGGLE DA SENHA                          ║
   ║  Alterna entre tipo "password" e "text" quando o usuário           ║
   ║  clica no ícone, trocando também o ícone para indicar visibilidade ║
   ╚════════════════════════════════════════════════════════════════════╝
*/
olhoSpan.addEventListener('click', () => {
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text'; // deixa a senha visível
        olhoIcon.classList.remove('bi-eye'); // remove ícone de olho normal
        olhoIcon.classList.add('bi-eye-slash-fill'); // adiciona ícone de olho riscado
    } else {
        senhaInput.type = 'password'; // esconde a senha
        olhoIcon.classList.remove('bi-eye-slash-fill'); // remove ícone de olho riscado
        olhoIcon.classList.add('bi-eye'); // adiciona ícone de olho normal
    }
});
