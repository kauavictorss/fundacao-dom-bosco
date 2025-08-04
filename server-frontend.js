const express = require('express');
const path = require('path');
const app = express();
const PORT = 8081;

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Frontend da Fundação Dom Bosco rodando em: http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos de: ${__dirname}`);
    console.log(`🔗 API Backend está em: http://localhost:3002`);
});
