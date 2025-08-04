const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/clientes - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const { nome, unidade, ativo = 'true' } = req.query;

    let query = `
      SELECT 
        c.id, c.nome, c.usuario, c.data_nascimento, c.genero,
        c.unidade_atendimento, c.bairro, c.cidade, c.estado, c.ativo,
        c.tipo_cliente,
        -- Campos específicos por tipo
        cm.cpf, cm.email, cm.telefone,
        cmr.telefone_pai, cmr.telefone_mae, cmr.ano_escolar
      FROM cliente c
      LEFT JOIN cliente_maior_idade cm ON c.id = cm.id
      LEFT JOIN cliente_menor_idade cmr ON c.id = cmr.id
      WHERE c.ativo = $1
    `;

    const params = [ativo === 'true'];
    let paramIndex = 2;

    if (nome) {
      query += ` AND c.nome ILIKE $${paramIndex}`;
      params.push(`%${nome}%`);
      paramIndex++;
    }

    if (unidade && unidade !== 'all') {
      query += ` AND c.unidade_atendimento = $${paramIndex}`;
      params.push(unidade.toLowerCase());
      paramIndex++;
    }

    query += ' ORDER BY c.nome';

    const result = await pool.query(query, params);

    // Converter para o formato esperado pelo frontend
    const clientes = result.rows.map(row => ({
      id: row.id,
      name: row.nome,
      username: row.usuario,
      birthDate: row.data_nascimento,
      gender: row.genero,
      unit: row.unidade_atendimento,
      neighborhood: row.bairro,
      city: row.cidade,
      state: row.estado,
      active: row.ativo,
      type: row.tipo_cliente === 'MAIOR_IDADE' ? 'adult' : 'minor',
      // Campos específicos por tipo
      cpf: row.cpf,
      email: row.email,
      phone: row.telefone,
      telefonePai: row.telefone_pai,
      telefoneMae: row.telefone_mae,
      anoEscolar: row.ano_escolar
    }));

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.*,
        cm.cpf, cm.rg, cm.naturalidade, cm.cidade_estado, cm.estado_civil,
        cm.escolaridade, cm.profissao, cm.email, cm.telefone, cm.contato_emergencia,
        cmr.nome_escola, cmr.tipo_escola, cmr.ano_escolar,
        cmr.nome_pai, cmr.idade_pai, cmr.profissao_pai, cmr.telefone_pai,
        cmr.nome_mae, cmr.idade_mae, cmr.profissao_mae, cmr.telefone_mae,
        cmr.responsavel_financeiro, cmr.outro_responsavel
      FROM cliente c
      LEFT JOIN cliente_maior_idade cm ON c.id = cm.id
      LEFT JOIN cliente_menor_idade cmr ON c.id = cmr.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const row = result.rows[0];
    const cliente = {
      id: row.id,
      name: row.nome,
      username: row.usuario,
      birthDate: row.data_nascimento,
      gender: row.genero,
      unit: row.unidade_atendimento,
      cep: row.cep,
      address: row.logradouro,
      number: row.numero_endereco,
      complement: row.complemento,
      neighborhood: row.bairro,
      city: row.cidade,
      state: row.estado,
      observations: row.observacoes_gerais,
      diagnosticoPrincipal: row.diagnostico_principal,
      historicoMedico: row.historico_medico,
      queixaNeuropsicologica: row.queixa_neuropsicologica,
      expectativasTratamento: row.expectativas_tratamento,
      active: row.ativo,
      type: row.tipo_cliente === 'MAIOR_IDADE' ? 'adult' : 'minor'
    };

    // Adicionar campos específicos por tipo
    if (row.tipo_cliente === 'MAIOR_IDADE') {
      Object.assign(cliente, {
        cpf: row.cpf,
        rg: row.rg,
        naturalidade: row.naturalidade,
        cidadeEstado: row.cidade_estado,
        estadoCivil: row.estado_civil,
        education: row.escolaridade,
        profession: row.profissao,
        email: row.email,
        phone: row.telefone,
        emergencyContact: row.contato_emergencia
      });
    } else {
      Object.assign(cliente, {
        schoolName: row.nome_escola,
        schoolType: row.tipo_escola,
        schoolYear: row.ano_escolar,
        fatherName: row.nome_pai,
        fatherAge: row.idade_pai,
        fatherProfession: row.profissao_pai,
        fatherPhone: row.telefone_pai,
        motherName: row.nome_mae,
        motherAge: row.idade_mae,
        motherProfession: row.profissao_mae,
        motherPhone: row.telefone_mae,
        financialResponsible: row.responsavel_financeiro,
        otherResponsible: row.outro_responsavel
      });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/clientes - Cadastrar novo cliente
router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      name, username, password, birthDate, gender, unit,
      cep, address, number, complement, neighborhood, city, state,
      observations, diagnosticoPrincipal, historicoMedico,
      queixaNeuropsicologica, expectativasTratamento, type,
      // Campos para maior de idade
      cpf, rg, naturalidade, cidadeEstado, estadoCivil,
      education, profession, email, phone, emergencyContact,
      // Campos para menor de idade
      schoolName, schoolType, schoolYear,
      fatherName, fatherAge, fatherProfession, fatherPhone,
      motherName, motherAge, motherProfession, motherPhone,
      financialResponsible, otherResponsible
    } = req.body;

    // Verificar se usuário já existe
    const userCheck = await client.query('SELECT id FROM cliente WHERE usuario = $1', [username]);
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Inserir cliente base
    const tipoCliente = type === 'adult' ? 'MAIOR_IDADE' : 'MENOR_IDADE';
    const clienteQuery = `
      INSERT INTO cliente (
        nome, usuario, senha, data_nascimento, genero, unidade_atendimento,
        cep, logradouro, numero_endereco, complemento, bairro, cidade, estado,
        observacoes_gerais, diagnostico_principal, historico_medico,
        queixa_neuropsicologica, expectativas_tratamento, tipo_cliente, ativo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING id
    `;

    const clienteResult = await client.query(clienteQuery, [
      name, username, password, birthDate, gender, unit,
      cep, address, number, complement, neighborhood, city, state,
      observations, diagnosticoPrincipal, historicoMedico,
      queixaNeuropsicologica, expectativasTratamento, tipoCliente, true
    ]);

    const clienteId = clienteResult.rows[0].id;

    // Inserir dados específicos por tipo
    if (type === 'adult') {
      await client.query(`
        INSERT INTO cliente_maior_idade (
          id, cpf, rg, naturalidade, cidade_estado, estado_civil,
          escolaridade, profissao, email, telefone, contato_emergencia
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [clienteId, cpf, rg, naturalidade, cidadeEstado, estadoCivil,
          education, profession, email, phone, emergencyContact]);
    } else {
      await client.query(`
        INSERT INTO cliente_menor_idade (
          id, nome_escola, tipo_escola, ano_escolar,
          nome_pai, idade_pai, profissao_pai, telefone_pai,
          nome_mae, idade_mae, profissao_mae, telefone_mae,
          responsavel_financeiro, outro_responsavel
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [clienteId, schoolName, schoolType, schoolYear,
          fatherName, fatherAge, fatherProfession, fatherPhone,
          motherName, motherAge, motherProfession, motherPhone,
          financialResponsible, otherResponsible]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      id: clienteId,
      message: 'Cliente cadastrado com sucesso',
      name: name
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// PUT /api/clientes/:id/desativar - Desativar cliente
router.put('/:id/desativar', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE cliente SET ativo = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao desativar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
