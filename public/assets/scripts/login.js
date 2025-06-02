
// POP UP

const btnMostrarRegistro = document.getElementById('btnMostrarRegistro');
const popup = document.getElementById('pop-up');

btnMostrarRegistro.addEventListener('click', () => {
  popup.classList.remove('d-none');
  popup.classList.add('show');
});

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.classList.remove('show');
    setTimeout(() => popup.classList.add('d-none'), 400);
  }
});

// LOGIN

const loginForm = document.getElementById('loginForm');
const loginErro = document.querySelectorAll('#msgErro')[1];

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();

  try {
    const res = await fetch('http://localhost:3000/usuarios');
    const users = await res.json();

    const usuario = users.find(
      user => user.email === email && user.senha === senha
    );

    if (usuario) {
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      alert("Login Efetuado com Sucesso!");
      window.location.href = 'index.html'; 
    } else {
      loginErro.textContent = 'Email ou Senha Inválidos.';
    }
  } catch (error) {
    loginErro.textContent = 'Erro ao Conectar com o Servidor.';
    console.error('Erro:', error);
  }
});

// REGISTRO

const registerForm = document.getElementById('registerForm');
const registerErro = document.querySelectorAll('#msgErro')[0];

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('username').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerPassword').value.trim();
  const confirmSenha = document.getElementById('confirmPassword').value.trim();
  const login = nome.toLowerCase().replace(/\s+/g, '');

  if (senha !== confirmSenha) {
    registerErro.textContent = 'As Senhas Não Coincidem.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/usuarios');
    const users = await res.json();

    const emailExiste = users.some(user => user.email === email);
    if (emailExiste) {
      registerErro.textContent = 'Email Já Cadastrado.';
      return;
    }

    const novoUsuario = {
      id: crypto.randomUUID(),
      nome,
      email,
      login,
      senha,
      desc: "",
      favoritos: [],
      avatar: "assets/images/defaultPFP.jpg"
    };

    await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario)
    });

    registerErro.textContent = 'Registrado com Sucesso! Faça Login.';
    popup.classList.remove('show');
    setTimeout(() => popup.classList.add('d-none'), 400);
  } catch (error) {
    registerErro.textContent = 'Erro ao Registrar.';
    console.error('Erro:', error);
  }
});