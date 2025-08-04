// Teste simples da API Node.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Mudando para porta 3001

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API funcionando!',
    timestamp: new Date().toISOString(),
    message: 'Servidor Node.js está online',
    port: PORT
  });
});

// Rota de teste para clientes (sem banco)
app.get('/api/clientes', (req, res) => {
  res.json([
    { id: 1, name: 'Cliente Teste', type: 'adult' },
    { id: 2, name: 'Outro Cliente', type: 'minor' }
  ]);
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de TESTE rodando na porta ${PORT}`);
  console.log(`📍 Teste: http://localhost:${PORT}/api/health`);
  console.log(`📍 Clientes: http://localhost:${PORT}/api/clientes`);
});

module.exports = app;
