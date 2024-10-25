document.getElementById('search').addEventListener('input', async (event) => {
    const query = event.target.value;
    const resultsContainer = document.getElementById('search-results');

    if (query.length >= 3) {
        try {
            const response = await fetch(`/api/search?q=${query}`);
            const results = await response.json();

            // Verifica se a resposta possui a estrutura esperada
            if (results.status === 'success' && results.list) {
                // Converte o objeto `list` em um array de valores
                const resultArray = Object.values(results.list);

                // Limpar os resultados anteriores
                resultsContainer.innerHTML = '';

                // Exibir resultados em uma lista rolável
                resultArray.forEach(result => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `
                        <strong style="cursor: pointer">${result.title}</strong> (${result.type === 'serie' ? 'Série' : 'Filme'})
                        <small>IMDB: ${result.imdb} | Ano: ${result.year}</small>
                    `;
                    listItem.onclick = () => {
                        window.location.href = `/watch/${result.imdb}/${result.type === 'serie' ? 'serie' : 'filme'}`;
                    };
                    resultsContainer.appendChild(listItem);
                });

                // Exibir a lista de resultados
                resultsContainer.style.display = 'block';
            } else {
                console.error('A resposta da API não possui a estrutura esperada:', results);
                resultsContainer.innerHTML = '<li class="list-group-item text-danger">Nenhum resultado encontrado.</li>';
            }

        } catch (error) {
            console.error('Erro na busca:', error);
            resultsContainer.innerHTML = '<li class="list-group-item text-danger">Erro ao buscar resultados.</li>';
        }
    } else {
        // Limpar resultados se a consulta for muito curta
        resultsContainer.innerHTML = '';
    }
});
