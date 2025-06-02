const API_KEY = 'dc27f83f2f660291155e93620b7401b5'; 
const resultadosDiv = document.getElementById('resultados');

const params = new URLSearchParams(window.location.search);
const query = params.get('query');

if (query) {
  buscarFilmes(query);
}

async function obterFavoritosUsuario() {
  try {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return [];
    
    const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
    const usuario = await response.json();
    return usuario.favoritos || [];
  } catch (error) {
    console.error('Erro ao obter favoritos:', error);
    return [];
  }
}

async function alternarFavorito(filmeId, elemento) {
  try {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
      alert('Você precisa estar logado para favoritar filmes!');
      return;
    }

    const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
    const usuario = await response.json();
    const favoritos = usuario.favoritos || [];
    
    const filmeIdNum = Number(filmeId);
    const isFavorito = favoritos.includes(filmeIdNum);
    
    let novosFavoritos;
    if (isFavorito) {
      novosFavoritos = favoritos.filter(id => id !== filmeIdNum);
      elemento.innerHTML = '🤍'; 
      elemento.classList.remove('favorito');
    } else {
      novosFavoritos = [...favoritos, filmeIdNum];
      elemento.innerHTML = '❤️'; 
      elemento.classList.add('favorito');
    }

    await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favoritos: novosFavoritos })
    });

  } catch (error) {
    console.error('Erro ao alterar favorito:', error);
    alert('Erro ao alterar favorito. Tente novamente.');
  }
}

async function buscarFilmes(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    exibirFilmes(dados.results);
  } catch (erro) {
    console.error('Erro ao Buscar Filmes:', erro);
    resultadosDiv.innerHTML = `<p>Erro ao Buscar Filmes.</p>`;
  }
}

async function exibirFilmes(filmes) {
  resultadosDiv.innerHTML = ''

  if (!filmes.length) {
    resultadosDiv.innerHTML = '<p>Nenhum Filme Encontrado.</p>';
    return;
  }

  const favoritos = await obterFavoritosUsuario();

  filmes.forEach(filme => {
    const isFavorito = favoritos.includes(filme.id);
    
    const div = document.createElement('div');
    div.classList.add('filme');
    div.style.position = 'relative';
    
    div.innerHTML = `
      <a href="detalhes.html?id=${filme.id}">
        <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}">
        <p>${filme.title}</p>
      </a>
      <button class="btn-favorito ${isFavorito ? 'favorito' : ''}" 
              onclick="alternarFavorito(${filme.id}, this)" 
              style="position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.7); border: none; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; z-index: 10; transition: all 0.3s ease; opacity: 0.8;">
        ${isFavorito ? '❤️' : '🤍'}
      </button>
    `;
    resultadosDiv.appendChild(div);
  });
}

window.alternarFavorito = alternarFavorito;