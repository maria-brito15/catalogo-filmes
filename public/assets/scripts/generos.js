document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'dc27f83f2f660291155e93620b7401b5';
  const imgBase = 'https://image.tmdb.org/t/p/w300';
  const defaultImg = 'https://via.placeholder.com/300x450?text=Poster+Não+Disponível';

  const selectGenero = document.getElementById("select-genero");
  const containerGeneros = document.getElementById("filmes-container-generos");
  const carregarMaisBtn = document.getElementById("carregar-mais");

  let currentGenre = null;
  let currentPage = 1;
  let totalPages = 1;
  let isLoading = false;

  function carregarGeneros() {
    if (!selectGenero) return;
    
    selectGenero.disabled = true;
    selectGenero.innerHTML = '<option value="">Carregando gêneros...</option>';
    
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`)
      .then(response => {
        if (!response.ok) throw new Error('Erro na rede');
        return response.json();
      })
      .then(data => {
        if (!data.genres || !Array.isArray(data.genres)) throw new Error('Dados inválidos');
        
        selectGenero.innerHTML = '<option value="">Selecione um Gênero</option>';
        
        data.genres.forEach(genero => {
          const option = document.createElement('option');
          option.value = genero.id;
          option.textContent = genero.name;
          selectGenero.appendChild(option);
        });
        
        selectGenero.disabled = false;
      })
      .catch(error => {
        console.error('Erro ao carregar gêneros:', error);
        selectGenero.innerHTML = '<option value="">Erro ao Carregar Gêneros</option>';
      });
  }

  function carregarFilmesPorGenero(generoId, page = 1) {
    if (!containerGeneros || isLoading) return;
    
    isLoading = true;
    currentGenre = generoId;
    currentPage = page;
    
    if (page === 1) {
      containerGeneros.innerHTML = '<p class="text-center">Carregando Filmes...</p>';
      carregarMaisBtn.classList.add('d-none');
    } else {
      carregarMaisBtn.disabled = true;
      carregarMaisBtn.textContent = 'Carregando...';
    }
    
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${generoId}&language=pt-BR&sort_by=popularity.desc&page=${page}`)
      .then(response => {
        if (!response.ok) throw new Error('Erro na Rede');
        return response.json();
      })
      .then(data => {
        if (!data.results || !Array.isArray(data.results)) throw new Error('Dados Inválidos');
        
        totalPages = data.total_pages;
        
        if (page === 1) {
          containerGeneros.innerHTML = '';
        }
        
        if (data.results.length === 0 && page === 1) {
          containerGeneros.innerHTML = '<p class="text-center">Nenhum Filme Encontrado Para Este Gênero.</p>';
          return;
        }
        
        data.results.forEach(filme => {
          const div = document.createElement("div");
          div.className = "filme";
          
          const posterPath = filme.poster_path ? imgBase + filme.poster_path : defaultImg;
          
          div.innerHTML = `
            <a href="detalhes.html?id=${filme.id}">
              <img src="${posterPath}" alt="${filme.title}" loading="lazy">
              <p>${filme.title}</p>
            </a>
          `;
          
          containerGeneros.appendChild(div);
        });
        
        if (page < totalPages && (page * 20) < 100) {
          carregarMaisBtn.classList.remove('d-none');
        } else {
          carregarMaisBtn.classList.add('d-none');
        }
      })
      .catch(error => {
        console.error('Erro ao carregar filmes:', error);
        if (page === 1) {
          containerGeneros.innerHTML = '<p class="text-center text-danger">Erro ao carregar filmes. Tente novamente.</p>';
        }
      })
      .finally(() => {
        isLoading = false;
        carregarMaisBtn.disabled = false;
        carregarMaisBtn.textContent = 'Carregar Mais';
      });
  }

  if (selectGenero) {
    selectGenero.addEventListener("change", function() {
      const generoId = this.value;
      if (generoId) {
        carregarFilmesPorGenero(generoId);
      } else {
        containerGeneros.innerHTML = '';
        carregarMaisBtn.classList.add('d-none');
      }
    });
  }

  if (carregarMaisBtn) {
    carregarMaisBtn.addEventListener("click", function() {
      if (currentGenre && !isLoading) {
        carregarFilmesPorGenero(currentGenre, currentPage + 1);
      }
    });
  }

  carregarGeneros();
});