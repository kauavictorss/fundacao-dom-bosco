const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check PRIMEIRO (antes das outras rotas)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'API funcionando!',
    timestamp: new Date().toISOString(),
    message: 'Servidor Node.js conectado ao PostgreSQL'
  });
});

// Teste simples de clientes (sem banco por enquanto)
app.get('/api/clientes', (req, res) => {
  res.json([
    { id: 1, name: 'Cliente Teste 1', type: 'adult' },
    { id: 2, name: 'Cliente Teste 2', type: 'minor' }
  ]);
});

// Teste simples de usuários
app.get('/api/usuarios', (req, res) => {
  res.json([
    { id: 1, username: 'director', name: 'Diretoria Geral', role: 'director' },
    { id: 2, username: 'staff', name: 'Funcionário', role: 'staff' }
  ]);
});

// Rota raiz para debug
app.get('/', (req, res) => {
  res.json({
    message: 'API Fundação Dom Bosco está rodando!',
    endpoints: [
      'GET /api/health',
      'GET /api/clientes',
      'GET /api/usuarios'
    ]
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Node.js rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Clientes: http://localhost:${PORT}/api/clientes`);
});

module.exports = app;
