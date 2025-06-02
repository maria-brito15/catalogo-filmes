// AUTENTICAÇÃO DE LOGIN

const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

if (!usuario) {
  alert("Sessão Finalizada. Efetue o Login Novamente!");
  window.location.href = 'login.html';
}

// AUTENTICAÇÃO DE ADMIN

const adminMenu = document.getElementById("adminMenu");

if (adminMenu) {
  if (usuario.id === '187cb7e5-e097-4224-8bc7-b610c855e2b1') {
    adminMenu.style.display = "flex";
  } else {
    adminMenu.remove();
  }
}