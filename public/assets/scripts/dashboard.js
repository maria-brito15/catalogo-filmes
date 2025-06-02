const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

if (usuario.id != '187cb7e5-e097-4224-8bc7-b610c855e2b1') {
  alert("Painel Somente para Administradores!");
  window.location.href = 'login.html';
}

//

const usuariosContainer = document.getElementById("usuariosContainer");
const filmesContainer = document.getElementById("filmesContainer");

async function carregarUsuarios() {
  try {
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json();

  usuarios.forEach(user => {
    const row = document.createElement("div");

    row.className = "row-data bg-dark text-light border rounded mb-2";
    row.innerHTML = `
      <p>${user.id}</p>
      <p>${user.email}</p>
      <p>${user.nome}</p>
      <p>${user.senha}</p>
    `;
    usuariosContainer.appendChild(row);
  });

  } catch (erro) {
    console.error("Erro ao carregar usuarios: ", erro);
  }
}

async function carregarFilmes() {
  try {
    const resposta = await fetch("http://localhost:3000/filmes");
    const filmes = await resposta.json();

    filmes.forEach(filme => {
      if (!filme.titulo) return;

      const row = document.createElement("div");
      row.className = "row-data bg-dark text-light border rounded mb-2";
      row.innerHTML = `
        <p>${filme.id}</p>
        <p>${filme.titulo}</p>
        <p>${filme.genero}</p>
        <p>${filme.ano}</p>
        <p>${filme.diretor}</p>
        <p>${filme.avaliacao}</p>
      `;
      filmesContainer.appendChild(row);
    });
  } catch (erro) {
    console.error("Erro ao carregar filmes:", erro);
  }
}

carregarUsuarios();
carregarFilmes();

//

const abrirPopupAdcUsuario = document.getElementById("abrirPopupAdcUsuario");
const abrirPopupDelUsuario = document.getElementById("abrirPopupDelUsuario");
const abrirPopupEditarUsuario = document.getElementById("abrirPopupEditarUsuario");

const abrirPopupAdcFilme = document.getElementById("abrirPopupAdcFilme");
const abrirPopupDelFilme = document.getElementById("abrirPopupDelFilme");
const abrirPopupEditarFilme = document.getElementById("abrirPopupEditarFilme");

const modalAdcUsuario = document.getElementById("modalAdcUsuario");
const modalDelUsuario = document.getElementById("modalDelUsuario");
const modalEditarUsuario = document.getElementById("modalEditarUsuario");

const modalAdcFilme = document.getElementById("modalAdcFilme");
const modalDelFilme = document.getElementById("modalDelFilme");
const modalEditarFilme = document.getElementById("modalEditarFilme");

const modais = [
  modalAdcUsuario,
  modalDelUsuario,
  modalEditarUsuario,
  modalAdcFilme,
  modalDelFilme,
  modalEditarFilme
];

function mostrarPopup(modal) {
  modais.forEach(m => m.classList.add('d-none'));
  modal.classList.remove('d-none');
}

abrirPopupAdcUsuario.addEventListener('click', () => mostrarPopup(modalAdcUsuario));
abrirPopupDelUsuario.addEventListener('click', () => mostrarPopup(modalDelUsuario));
abrirPopupEditarUsuario.addEventListener('click', () => mostrarPopup(modalEditarUsuario));

abrirPopupAdcFilme.addEventListener('click', () => mostrarPopup(modalAdcFilme));
abrirPopupDelFilme.addEventListener('click', () => mostrarPopup(modalDelFilme));
abrirPopupEditarFilme.addEventListener('click', () => mostrarPopup(modalEditarFilme));

modais.forEach(modal => {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.add("d-none");
    }
  });
});

async function adicionarUsuario(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("registerEmail").value;
  const senha = document.getElementById("registerPassword").value;
  const confirmSenha = document.getElementById("confirmPassword").value;

  if (senha !== confirmSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  const novoUsuario = {
    id: crypto.randomUUID(),
    login: username,
    senha: senha,
    nome: username,
    desc: "",
    email: email,
    favoritos: [],
    avatar: "assets/images/defaultPFP.jpg"
  };

  try {
    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario)
    });

    if (response.ok) {
      alert("Usuário Adicionado com Sucesso!");
      document.getElementById("formAdcUsuario").reset();
    } else {
      alert("Erro ao Adicionar Usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function deletarUsuario(event) {
  event.preventDefault();

  const id = document.getElementById("idUsuarioRegistrado").value;

  try {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Usuário Deletado com Sucesso!");
      document.getElementById("formDelUsuario").reset();
    } else {
      alert("Erro ao Deletar Usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function atualizarUsuario(event) {
  event.preventDefault();

  const id = document.getElementById("idUsuarioEditar").value;
  const nome = document.getElementById("nomeUsuarioEditar").value;
  const email = document.getElementById("emailUsuarioEditar").value;
  const senha = document.getElementById("senhaUsuarioEditar").value;
  const desc = document.getElementById("descUsuarioEditar").value;

  const dadosAtualizados = {
    nome,
    email,
    senha,
    desc
  };

  try {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosAtualizados)
    });

    if (response.ok) {
      alert("Usuário Atualizado com Sucesso!");
      document.getElementById("formEditarUsuario").reset();
    } else {
      alert("Erro ao Aatualizar Usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function adicionarFilme(event) {
  event.preventDefault();

  const titulo = document.getElementById("tituloFilmeRegistrar").value;
  const ano = parseInt(document.getElementById("anoFilmeRegistrar").value);
  const genero = document.getElementById("generoFilmeRegistrar").value;
  const diretor = document.getElementById("diretorFilmeRegistrar").value;
  const avaliacao = parseFloat(document.getElementById("notaFilmeRegistrar").value);

  const novoFilme = {
    id: crypto.randomUUID(),
    titulo,
    ano,
    genero,
    diretor,
    avaliacao
  };

  try {
    const response = await fetch("http://localhost:3000/filmes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFilme)
    });

    if (response.ok) {
      alert("Filme Adicionado com Sucesso!");
      document.getElementById("formAdcFilme").reset();
    } else {
      alert("Erro ao Adicionar Filme.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function deletarFilme(event) {
  event.preventDefault();

  const id = document.getElementById("idFilmeRegistrado").value;

  try {
    const response = await fetch(`http://localhost:3000/filmes/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Filme Deletado com Sucesso!");
      document.getElementById("formDelFilme").reset();
    } else {
      alert("Erro ao Deletar Filme.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function atualizarFilme(event) {
  event.preventDefault();

  const id = document.getElementById("idFilmeEditar").value;
  const titulo = document.getElementById("tituloFilmeEditar").value;
  const ano = parseInt(document.getElementById("anoFilmeEditar").value);
  const genero = document.getElementById("generoFilmeEditar").value;
  const diretor = document.getElementById("diretorFilmeEditar").value;
  const avaliacao = parseFloat(document.getElementById("notaFilmeEditar").value);

  const dadosAtualizados = {
    titulo,
    ano,
    genero,
    diretor,
    avaliacao
  };

  try {
    const response = await fetch(`http://localhost:3000/filmes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosAtualizados)
    });

    if (response.ok) {
      alert("Filme Atualizado com Sucesso!");
      document.getElementById("formEditarFilme").reset();
    } else {
      alert("Erro ao Atualizar Filme.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

document.getElementById("formAdcUsuario").addEventListener("submit", adicionarUsuario);
document.getElementById("formDelUsuario").addEventListener("submit", deletarUsuario);
document.getElementById("formEditarUsuario").addEventListener("submit", atualizarUsuario);

document.getElementById("formAdcFilme").addEventListener("submit", adicionarFilme);
document.getElementById("formDelFilme").addEventListener("submit", deletarFilme);
document.getElementById("formEditarFilme").addEventListener("submit", atualizarFilme);

