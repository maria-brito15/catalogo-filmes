// MENU SIDEBAR

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('abaixarConteudo');

  menuToggle.addEventListener('click', function() {
    
    sidebar.classList.toggle('active');
    content.classList.toggle('shifted');
    menuToggle.classList.toggle('active');
  });
});

// FILMES

const apiKey = 'dc27f83f2f660291155e93620b7401b5';
const imgBase = 'https://image.tmdb.org/t/p/w300';

const categorias = [
  { id: 'populares', endpoint: 'popular' },
  { id: 'melhores', endpoint: 'top_rated' },
  { id: 'cartaz', endpoint: 'now_playing' },
  { id: 'breve', endpoint: 'upcoming' }
];

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
      alert('Você Precisa Estar Logado Para Favoritar Filmes!');
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
    console.error('Erro ao Alterar Favorito:', error);
    alert('Erro ao Alterar Favorito. Tente Novamente.');
  }
}

async function criarElementoFilme(filme, container) {
  const favoritos = await obterFavoritosUsuario();
  const isFavorito = favoritos.includes(filme.id);
  
  const div = document.createElement('div');
  div.classList.add('filme');
  div.style.position = 'relative';
  
  div.innerHTML = `
    <a href="detalhes.html?id=${filme.id}">
      <img src="${imgBase + filme.poster_path}" alt="${filme.title}">
      <p>${filme.title}</p>
    </a>
    <button class="btn-favorito ${isFavorito ? 'favorito' : ''}" 
            onclick="alternarFavorito(${filme.id}, this)" 
            style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 20px; cursor: pointer; z-index: 10;">
      ${isFavorito ? '❤️' : '🤍'}
    </button>
  `;
  
  return div;
}

categorias.forEach(async categoria => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${categoria.endpoint}?api_key=${apiKey}&language=pt-BR&page=1`);
    const data = await response.json();
    const container = document.getElementById(categoria.id);
    
    if (container) {
      for (const filme of data.results.slice(0, 16)) {
        const elementoFilme = await criarElementoFilme(filme, container);
        container.appendChild(elementoFilme);
      }
    }
  } catch (err) {
    console.error(`Erro ao Carregar ${categoria.id}:`, err);
  }
});

// DETALHES

const params = new URLSearchParams(window.location.search);
const filmeId = params.get("id");

if (filmeId) {
  fetch(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`)
    .then(res => res.json())
    .then(filme => {
      document.getElementById("posterDetalhes").src = imgBase + filme.poster_path;
      document.getElementById("tituloBr").textContent = filme.title;
      document.getElementById("tituloOriginal").textContent = filme.original_title;
      document.getElementById("avalia").textContent = filme.vote_average.toFixed(1);
      document.getElementById("sinopse").textContent = filme.overview;
      document.getElementById("duracao").textContent = filme.runtime + " min";
      document.querySelectorAll("#elenco")[0].textContent = "Carregando..."; 
      document.querySelectorAll("#elenco")[1].textContent = "Carregando..."; 
      document.querySelectorAll("#elenco")[2].textContent = filme.release_date.slice(0, 4); 
      document.querySelectorAll("#elenco")[3].textContent = filme.genres.map(g => g.name).join(", "); 

      fetch(`https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=${apiKey}&language=pt-BR`)
        .then(res => res.json())
        .then(creditos => {
          const diretor = creditos.crew.find(p => p.job === "Director");
          const atores = creditos.cast.slice(0, 5).map(ator => ator.name).join(", ");
          document.querySelectorAll("#elenco")[0].textContent = diretor?.name || "Desconhecido";
          document.querySelectorAll("#elenco")[1].textContent = atores;
        });
    })
    .catch(err => console.error("Erro ao Carregar Detalhes:", err));
}

async function verificarEAtualizarBotaoFavorito() {
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) return;
  
  try {
    const favoritos = await obterFavoritosUsuario();
    const btnFavoritar = document.getElementById('favoritarFilme');
    
    if (btnFavoritar && filmeId) {
      const isFavorito = favoritos.includes(Number(filmeId));
      
      if (isFavorito) {
        btnFavoritar.textContent = 'Desfavoritar';
        btnFavoritar.classList.add('btn-desfavoritar');
      } else {
        btnFavoritar.textContent = 'Favoritar';
        btnFavoritar.classList.remove('btn-desfavoritar');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar favoritos:', error);
  }
}

const btnFavoritar = document.getElementById('favoritarFilme');

if (btnFavoritar && filmeId) {
  verificarEAtualizarBotaoFavorito();
  
  btnFavoritar.addEventListener('click', async () => {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado) {
      alert('Você Precisa Estar Logado para Favoritar Filmes!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
      const usuario = await response.json();
      const favoritos = usuario.favoritos || [];
      const filmeIdNum = Number(filmeId);
      const isFavorito = favoritos.includes(filmeIdNum);
      
      let novosFavoritos;
      let mensagem;
      
      if (isFavorito) {
        novosFavoritos = favoritos.filter(id => id !== filmeIdNum);
        mensagem = 'Filme Removido dos Favoritos!';
        btnFavoritar.textContent = 'Favoritar';
        btnFavoritar.classList.remove('btn-desfavoritar');
      } else {
        novosFavoritos = [...favoritos, filmeIdNum];
        mensagem = 'Filme Adicionado aos Favoritos!';
        btnFavoritar.textContent = 'Desfavoritar';
        btnFavoritar.classList.add('btn-desfavoritar');
      }

      await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoritos: novosFavoritos })
      });
      
      alert(mensagem);
      
    } catch (err) {
      console.error('Erro ao alterar favorito:', err);
      alert('Erro ao alterar favorito. Tente novamente.');
    }
  });
}

// CATEGORIAS

const tipo = params.get("tipo");
const page = parseInt(params.get("page")) || 1;

const container = document.getElementById("filmesContainer");
const titulo = document.getElementById("tituloCategoria");

const nomesCategoria = {
  populares: "Filmes Populares",
  melhores: "Melhores Avaliados",
  cartaz: "Em Cartaz",
  breve: "Em Breve"
};

const endpoints = {
  populares: `https://api.themoviedb.org/3/movie/popular`,
  melhores: `https://api.themoviedb.org/3/movie/top_rated`,
  cartaz: `https://api.themoviedb.org/3/movie/now_playing`,
  breve: `https://api.themoviedb.org/3/movie/upcoming`
};

async function criarFilmeBox(filme) {
  const favoritos = await obterFavoritosUsuario();
  const isFavorito = favoritos.includes(filme.id);
  
  const div = document.createElement("div");
  div.classList.add("filme", "text-center");
  div.style.position = 'relative';
  
  div.innerHTML = `
    <a href="detalhes.html?id=${filme.id}">
      <img src="${imgBase + filme.poster_path}" alt="${filme.title}" class="img-fluid rounded shadow">
      <p class="text-white mt-2">${filme.title}</p>
    </a>
    <button class="btn-favorito ${isFavorito ? 'favorito' : ''}" 
            onclick="alternarFavorito(${filme.id}, this)" 
            style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 20px; cursor: pointer; z-index: 10;">
      ${isFavorito ? '❤️' : '🤍'}
    </button>
  `;
  
  return div;
}

function criarPaginacao(paginaAtual, totalPaginas) {
  const nav = document.createElement("nav");
  nav.classList.add("mt-4");

  let html = `<ul class="pagination justify-content-center">`;

  if (paginaAtual > 1) {
    html += `<li class="page-item"><a class="page-link text-dark" href="?tipo=${tipo}&page=${paginaAtual - 1}">Anterior</a></li>`;
  }

  for (let i = paginaAtual; i < paginaAtual + 5 && i <= Math.floor(totalPaginas / 2); i++) {
    html += 
    `<li class="page-item ${i === paginaAtual ? 'active' : ''}">
      <a class="page-link text-dark" href="?tipo=${tipo}&page=${i}">${i}</a>
    </li>`;
  }

  if (paginaAtual < Math.floor(totalPaginas / 2)) {
    html += `<li class="page-item"><a class="page-link text-dark" href="?tipo=${tipo}&page=${paginaAtual + 1}">Próxima</a></li>`;
  }

  html += `</ul>`;
  nav.innerHTML = html;
  return nav;
}

async function carregarFilmes() {
  if (!endpoints[tipo]) {
    titulo.textContent = "Categoria Não Encontrada.";
    return;
  }

  titulo.textContent = nomesCategoria[tipo] || "Categoria";

  const pagina1 = (page * 2) - 1;
  const pagina2 = (page * 2);

  const url1 = `${endpoints[tipo]}?api_key=${apiKey}&language=pt-BR&page=${pagina1}`;
  const url2 = `${endpoints[tipo]}?api_key=${apiKey}&language=pt-BR&page=${pagina2}`;

  try {
    const [data1, data2] = await Promise.all([
      fetch(url1).then(res => res.json()),
      fetch(url2).then(res => res.json())
    ]);
    
    const filmes = [...data1.results, ...data2.results];

    const navTopo = criarPaginacao(page, data1.total_pages);
    container.before(navTopo);

    for (const filme of filmes) {
      const div = await criarFilmeBox(filme);
      container.appendChild(div);
    }
  } catch (error) {
    titulo.textContent = "Erro ao Carregar os Filmes.";
    console.error(error);
  }
}

if (container) {
  carregarFilmes();
}

window.alternarFavorito = alternarFavorito;