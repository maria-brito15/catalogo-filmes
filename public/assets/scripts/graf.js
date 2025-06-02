async function carregarFilmes() {
  const FILMES_URL = 'http://localhost:3000/filmes';

  const resposta = await fetch(FILMES_URL);
  const filmes = await resposta.json();
  return filmes;
}

async function gerarGraficoGeneros() {
  const filmes = await carregarFilmes();

  const contagemGeneros = {};

  filmes.forEach(filme => {
    const genero = filme.genero;
    if (genero) {
      contagemGeneros[genero] = (contagemGeneros[genero] || 0) + 1;
    }
  });

  const labels = Object.keys(contagemGeneros);
  const dados = Object.values(contagemGeneros);

  const ctx = document.getElementById('graficoGeneroFilmes').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Filmes por Gênero',
        data: dados,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#cc65fe', '#ffce56',
          '#4bc0c0', '#9966ff', '#ff9f40', '#8d99ae',
          '#a8dadc', '#e63946', '#f1faee', '#457b9d'
        ]
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Distribuição de Filmes por Gênero'
        }
      }
    }
  });
}

gerarGraficoGeneros();