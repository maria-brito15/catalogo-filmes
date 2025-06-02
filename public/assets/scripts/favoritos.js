document.addEventListener("DOMContentLoaded", () => {
  const urlBase = "http://localhost:3000";
  const TMDB_API_KEY = "dc27f83f2f660291155e93620b7401b5";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  const resultadosDiv = document.getElementById("favoritos");
  
  const isFavoritosPage = window.location.pathname.includes("favoritos.html");
  const LIMITE_PERFIL = 5;

  let usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));

  async function carregarFavoritos(favoritos) {
    resultadosDiv.innerHTML = "";

    if (!favoritos.length) {
      resultadosDiv.innerHTML = '<p class="text-white">Nenhum Filme Favorito Encontrado.</p>';
      return;
    }

    const favoritosParaCarregar = isFavoritosPage ? favoritos : favoritos.slice(0, LIMITE_PERFIL);

    const filmes = await Promise.all(favoritosParaCarregar.map(async (id) => {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
        if (!res.ok) throw new Error(`Filme Não Encontrado: ${id}`);
        return await res.json();
      } catch (erro) {
        console.warn(`Erro Filme ID ${id}:`, erro);
        return null;
      }
    }));

    const filmesValidos = filmes.filter(Boolean);
    exibirFilmes(filmesValidos);
  }

  function exibirFilmes(filmes) {
    if (!filmes.length) {
      resultadosDiv.innerHTML = '<p class="text-white">Nenhum Filme Encontrado.</p>';
      return;
    }

    filmes.forEach(filme => {
      const div = document.createElement("div");
      div.classList.add("filme");
      div.innerHTML = `
        <a href="detalhes.html?id=${filme.id}">
          <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}">
          <p>${filme.title}</p>
        </a>
      `;
      resultadosDiv.appendChild(div);
    });
  }

  async function carregarPerfil(usuarioId) {
    try {
      const res = await fetch(`${urlBase}/usuarios/${usuarioId}`);
      if (!res.ok) throw new Error("Usuário Não Encontrado");
      const usuario = await res.json();

      const favoritos = usuario.favoritos || [];
      carregarFavoritos(favoritos);
      console.log("Favoritos:", favoritos);
    } catch (erro) {
      console.error("Erro ao Carregar Perfil:", erro);
      resultadosDiv.innerHTML = '<p class="text-white">Erro ao Carregar Favoritos.</p>';
    }
  }

  carregarPerfil(usuarioLogado.id);
});