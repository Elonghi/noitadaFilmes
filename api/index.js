// api/index.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Rota de busca para API externa
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (query && query.length >= 3) {
        try {
            const response = await fetch(`https://warezcdn.link/includes/ajax.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `searchBar=${query}`
            });
            const data = await response.json();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar filmes e séries.' });
        }
    } else {
        res.status(400).json({ error: 'Digite pelo menos 3 caracteres.' });
    }
});

app.get('/watch/:id/:type', (req, res) => {
    const { id, type} = req.params;

    // Renderizar uma página HTML com o iframe do filme/série
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Assistir</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container my-5">
                <h1 class="text-center">Assistindo Agora</h1>
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe src="https://embed.warezcdn.com/${type}/${id}" frameborder="0" style="height: 80vh; width: 100%;" sandbox="allow-same-origin allow-scripts"></iframe>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
