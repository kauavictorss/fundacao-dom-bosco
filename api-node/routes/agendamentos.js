const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/agendamentos - Listar agendamentos
router.get('/', async (req, res) => {
  try {
    const { data, clienteId, profissionalId, status } = req.query;

    let query = `
      SELECT 
        a.*,
        c.nome as nome_cliente
      FROM agendamento a
      JOIN cliente c ON a.cliente_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (data) {
      query += ` AND a.data = $${paramIndex}`;
      params.push(data);
      paramIndex++;
    }

    if (clienteId) {
      query += ` AND a.cliente_id = $${paramIndex}`;
      params.push(clienteId);
      paramIndex++;
    }

    if (profissionalId) {
      query += ` AND a.profissional_id = $${paramIndex}`;
      params.push(profissionalId);
      paramIndex++;
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY a.data DESC, a.hora_inicio DESC';

    const result = await pool.query(query, params);

    // Converter para formato esperado pelo frontend
    const agendamentos = result.rows.map(row => ({
      id: row.id,
      clientId: row.cliente_id,
      clientName: row.nome_cliente,
      professionalId: row.profissional_id,
      date: row.data,
      startTime: row.hora_inicio,
      endTime: row.hora_fim,
      service: row.servico,
      status: row.status.toLowerCase(),
      unit: row.unidade_atendimento?.toLowerCase(),
      notes: row.observacoes,
      createdAt: row.criado_em,
      updatedAt: row.atualizado_em
    }));

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/agendamentos/agenda-dia - Agenda do dia específico
router.get('/agenda-dia', async (req, res) => {
  try {
    const { data } = req.query;
    const dataConsulta = data || new Date().toISOString().split('T')[0];

    const query = `
      SELECT 
        a.*,
        c.nome as nome_cliente
      FROM agendamento a
      JOIN cliente c ON a.cliente_id = c.id
      WHERE a.data = $1
      ORDER BY a.hora_inicio
    `;

    const result = await pool.query(query, [dataConsulta]);

    const agenda = result.rows.map(row => ({
      id: row.id,
      clientId: row.cliente_id,
      clientName: row.nome_cliente,
      professionalId: row.profissional_id,
      date: row.data,
      startTime: row.hora_inicio,
      endTime: row.hora_fim,
      service: row.servico,
      status: row.status.toLowerCase(),
      unit: row.unidade_atendimento?.toLowerCase(),
      notes: row.observacoes
    }));

    res.json(agenda);
  } catch (error) {
    console.error('Erro ao obter agenda do dia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/agendamentos - Criar novo agendamento
router.post('/', async (req, res) => {
  try {
    const {
      clientId, professionalId, date, startTime, endTime,
      service, status = 'agendado', unit, notes
    } = req.body;

    // Verificar se cliente existe
    const clienteCheck = await pool.query('SELECT id FROM cliente WHERE id = $1 AND ativo = true', [clientId]);
    if (clienteCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Cliente não encontrado ou inativo' });
    }

    // Verificar conflitos de horário se profissional especificado
    if (professionalId) {
      const conflictQuery = `
        SELECT id FROM agendamento 
        WHERE profissional_id = $1 AND data = $2 
        AND status != 'CANCELADO'
        AND (
          (hora_inicio <= $3 AND hora_fim > $3) OR
          (hora_inicio < $4 AND hora_fim >= $4) OR
          (hora_inicio >= $3 AND hora_fim <= $4)
        )
      `;

      const conflicts = await pool.query(conflictQuery, [professionalId, date, startTime, endTime]);
      if (conflicts.rows.length > 0) {
        return res.status(400).json({ error: 'Conflito de horário detectado' });
      }
    }

    const query = `
      INSERT INTO agendamento (
        cliente_id, profissional_id, data, hora_inicio, hora_fim,
        servico, status, unidade_atendimento, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      clientId, professionalId, date, startTime, endTime,
      service, status.toUpperCase(), unit?.toUpperCase(), notes
    ]);

    const agendamento = result.rows[0];

    res.status(201).json({
      id: agendamento.id,
      clientId: agendamento.cliente_id,
      professionalId: agendamento.profissional_id,
      date: agendamento.data,
      startTime: agendamento.hora_inicio,
      endTime: agendamento.hora_fim,
      service: agendamento.servico,
      status: agendamento.status.toLowerCase(),
      unit: agendamento.unidade_atendimento?.toLowerCase(),
      notes: agendamento.observacoes,
      message: 'Agendamento criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/agendamentos/:id/status - Atualizar status do agendamento
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE agendamento SET status = $1, atualizado_em = CURRENT_DATE WHERE id = $2 RETURNING *',
      [status.toUpperCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({
      id: result.rows[0].id,
      status: result.rows[0].status.toLowerCase(),
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/agendamentos/:id/profissional - Vincular profissional
router.put('/:id/profissional', async (req, res) => {
  try {
    const { id } = req.params;
    const { profissionalId } = req.body;

    // Buscar dados do agendamento
    const agendamentoAtual = await pool.query('SELECT * FROM agendamento WHERE id = $1', [id]);
    if (agendamentoAtual.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const agendamento = agendamentoAtual.rows[0];

    // Verificar conflitos se está mudando o profissional
    if (profissionalId !== agendamento.profissional_id) {
      const conflictQuery = `
        SELECT id FROM agendamento 
        WHERE profissional_id = $1 AND data = $2 AND id != $3
        AND status != 'CANCELADO'
        AND (
          (hora_inicio <= $4 AND hora_fim > $4) OR
          (hora_inicio < $5 AND hora_fim >= $5) OR
          (hora_inicio >= $4 AND hora_fim <= $5)
        )
      `;

      const conflicts = await pool.query(conflictQuery, [
        profissionalId, agendamento.data, id,
        agendamento.hora_inicio, agendamento.hora_fim
      ]);

      if (conflicts.rows.length > 0) {
        return res.status(400).json({ error: 'Conflito de horário detectado para este profissional' });
      }
    }

    const result = await pool.query(
      'UPDATE agendamento SET profissional_id = $1, atualizado_em = CURRENT_DATE WHERE id = $2 RETURNING *',
      [profissionalId, id]
    );

    res.json({
      id: result.rows[0].id,
      professionalId: result.rows[0].profissional_id,
      message: 'Profissional vinculado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao vincular profissional:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/agendamentos/:id - Excluir agendamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM agendamento WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
