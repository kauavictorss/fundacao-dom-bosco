const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/usuarios - Listar todos os usuários (replicando o database.js)
router.get('/', async (req, res) => {
  try {
    // Por enquanto, retornar os usuários hardcoded do database.js
    // Depois você pode migrar para uma tabela no banco
    const usuarios = [
      { id: 1, username: 'director', password: 'admin123', name: 'Diretoria Geral', role: 'director' },
      { id: 3, username: 'financeiro', password: 'admin123', name: 'Financeiro', role: 'financeiro' },
      { id: 2, username: 'staff', password: 'staff123', name: 'Funcionário', role: 'staff' },
      { id: 18, username: 'raquel', password: 'admin123', name: 'Coordenadora Raquel (Floresta)', role: 'coordinator_floresta' },
      { id: 19, username: 'tatiana_admin', password: 'admin123', name: 'Tatiane', role: 'coordinator_madre' },
      { id: 4, username: 'tatiana_neuro', password: 'admin123', name: 'Coordenadora Tatiana (Floresta)', role: 'coordinator_floresta' },
      { id: 21, username: 'musica', password: 'teste123', name: 'Maria Melodia', role: 'musictherapist' },
      { id: 5, username: 'frances', password: 'intern123', name: 'Frances Jane Bifano Freddi', role: 'intern' },
      { id: 6, username: 'vanessa', password: 'intern123', name: 'Vanessa', role: 'intern' },
      { id: 26, username: 'kimberly', password: 'kimberly123', name: 'Kimberly', role: 'psychologist' },
      { id: 27, username: 'beethoven', password: 'beethoven123', name: 'Beethoven', role: 'musictherapist' },
      { id: 28, username: 'cristine', password: 'cristine123', name: 'Cristine', role: 'psychopedagogue' },
      { id: 29, username: 'viviane', password: 'viviane123', name: 'Viviane', role: 'nutritionist' },
      { id: 30, username: 'renata_fono', password: 'renatafono123', name: 'Renata', role: 'speech_therapist' }
    ];

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/usuarios/login - Autenticação
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Usar a lista hardcoded diretamente
    const usuarios = [
      { id: 1, username: 'director', password: 'admin123', name: 'Diretoria Geral', role: 'director' },
      { id: 3, username: 'financeiro', password: 'admin123', name: 'Financeiro', role: 'financeiro' },
      { id: 2, username: 'staff', password: 'staff123', name: 'Funcionário', role: 'staff' },
      { id: 18, username: 'raquel', password: 'admin123', name: 'Coordenadora Raquel (Floresta)', role: 'coordinator_floresta' },
      { id: 19, username: 'tatiana_admin', password: 'admin123', name: 'Tatiane', role: 'coordinator_madre' },
      { id: 4, username: 'tatiana_neuro', password: 'admin123', name: 'Coordenadora Tatiana (Floresta)', role: 'coordinator_floresta' },
      { id: 21, username: 'musica', password: 'teste123', name: 'Maria Melodia', role: 'musictherapist' },
      { id: 5, username: 'frances', password: 'intern123', name: 'Frances Jane Bifano Freddi', role: 'intern' },
      { id: 6, username: 'vanessa', password: 'intern123', name: 'Vanessa', role: 'intern' },
      { id: 26, username: 'kimberly', password: 'kimberly123', name: 'Kimberly', role: 'psychologist' },
      { id: 27, username: 'beethoven', password: 'beethoven123', name: 'Beethoven', role: 'musictherapist' },
      { id: 28, username: 'cristine', password: 'cristine123', name: 'Cristine', role: 'psychopedagogue' },
      { id: 29, username: 'viviane', password: 'viviane123', name: 'Viviane', role: 'nutritionist' },
      { id: 30, username: 'renata_fono', password: 'renatafono123', name: 'Renata', role: 'speech_therapist' }
    ];

    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Remover senha da resposta
    const { password: _, ...usuarioSemSenha } = usuario;

    res.json({
      user: usuarioSemSenha,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
