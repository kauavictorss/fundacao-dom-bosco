-- ====================================================
-- SISTEMA DE GESTÃO FUNDAÇÃO DOM BOSCO
-- Estrutura completa do banco de dados PostgreSQL
-- ====================================================

-- Tabela unificada de usuários (funcionários, estagiários, etc.)
CREATE TABLE usuarios (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    ativo BOOLEAN NOT NULL DEFAULT true,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(255),
    email VARCHAR(255),
    celular VARCHAR(255),
    endereco VARCHAR(255),
    cargo VARCHAR(255) NOT NULL,
    -- Metadados
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cargos personalizados e permissões
CREATE TABLE cargos_personalizados (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    permissoes JSONB, -- Armazena as permissões de acesso às abas
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de permissões específicas por usuário (sobrescreve as do cargo)
CREATE TABLE permissoes_usuario (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    aba VARCHAR(100) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('view', 'edit')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, aba)
);

-- Tabela base para todos os clientes
CREATE TABLE clientes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    ativo BOOLEAN NOT NULL DEFAULT true,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    genero VARCHAR(50) NOT NULL,
    unidade_atendimento VARCHAR(50) CHECK (unidade_atendimento IN ('madre', 'floresta')),
    cep VARCHAR(20),
    logradouro VARCHAR(255),
    numero_endereco VARCHAR(50),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(50),
    observacoes_gerais TEXT,
    diagnostico_principal TEXT,
    historico_medico TEXT,
    queixa_neuropsicologica TEXT,
    expectativas_tratamento TEXT,
    tipo_cliente VARCHAR(31) NOT NULL CHECK (tipo_cliente IN ('adult', 'minor')),
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id)
);

-- Tabela para histórico de alterações dos clientes (para compatibilidade com @ElementCollection)
CREATE TABLE cliente_historico (
    cliente_id BIGINT NOT NULL,
    alteracao TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela para clientes maiores de idade
CREATE TABLE clientes_adultos (
    id BIGINT NOT NULL PRIMARY KEY,
    cpf VARCHAR(20) NOT NULL,
    rg VARCHAR(20),
    naturalidade VARCHAR(255),
    estado_civil VARCHAR(50),
    escolaridade VARCHAR(100),
    profissao VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(20),
    contato_emergencia VARCHAR(500),
    FOREIGN KEY (id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela para clientes menores de idade
CREATE TABLE clientes_menores (
    id BIGINT NOT NULL PRIMARY KEY,
    nome_escola VARCHAR(255),
    tipo_escola VARCHAR(50),
    ano_escolar VARCHAR(50),
    nome_pai VARCHAR(255),
    idade_pai INTEGER,
    profissao_pai VARCHAR(255),
    telefone_pai VARCHAR(20),
    nome_mae VARCHAR(255),
    idade_mae INTEGER,
    profissao_mae VARCHAR(255),
    telefone_mae VARCHAR(20),
    responsavel_financeiro VARCHAR(100),
    outro_responsavel VARCHAR(500),
    FOREIGN KEY (id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela de vínculo entre profissionais e clientes
CREATE TABLE vinculo_profissional_cliente (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(cliente_id, profissional_id)
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    servico VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'FALTOU')),
    unidade_atendimento VARCHAR(50) CHECK (unidade_atendimento IN ('madre', 'floresta')),
    observacoes TEXT,
    motivo_cancelamento TEXT,
    comprovante_cancelamento TEXT, -- Para armazenar base64 de imagens
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id)
);

-- Tabela de atendimentos realizados
CREATE TABLE atendimentos (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT,
    agendamento_id BIGINT,
    data DATE NOT NULL,
    tipo_sessao VARCHAR(255),
    anotacoes TEXT,
    valor DECIMAL(10,2),
    duracao_minutos INTEGER,
    anexos JSONB, -- Para armazenar múltiplos arquivos anexados
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuarios(id),
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);

-- Tabela de materiais utilizados em atendimentos
CREATE TABLE materiais_atendimento (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    atendimento_id BIGINT NOT NULL,
    item_estoque_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id) ON DELETE CASCADE
);

-- Tabela de notas dos clientes
CREATE TABLE notas_clientes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    conteudo TEXT NOT NULL,
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id)
);

-- Tabela de documentos dos clientes
CREATE TABLE documentos_clientes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(500) NOT NULL,
    dados_arquivo TEXT NOT NULL, -- Base64 do arquivo
    descricao TEXT,
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id)
);

-- Tabela de itens do estoque
CREATE TABLE estoque_itens (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 5,
    valor_unitario DECIMAL(10,2) DEFAULT 0.00,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de movimentações do estoque
CREATE TABLE movimentacoes_estoque (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    tipo_movimento VARCHAR(20) NOT NULL CHECK (tipo_movimento IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    valor_total DECIMAL(10,2),
    notas_compra TEXT,
    comprovante_arquivo TEXT, -- Base64 do comprovante
    usuario_id BIGINT,
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES estoque_itens(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de notas diárias financeiras
CREATE TABLE notas_diarias (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    data DATE NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('receita', 'despesa', 'nota')),
    categoria_despesa VARCHAR(100),
    valor DECIMAL(10,2),
    conteudo TEXT NOT NULL,
    arquivo_anexo TEXT, -- Base64 do arquivo anexado
    nome_arquivo VARCHAR(500),
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id)
);

-- Tabela de documentos gerais (mural do coordenador)
CREATE TABLE documentos_gerais (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    conteudo TEXT, -- Para notas que não têm arquivo
    dados_arquivo TEXT, -- Base64 do arquivo (para documentos com arquivo)
    nome_arquivo VARCHAR(500),
    descricao TEXT,
    -- Campos específicos para reuniões
    data_reuniao DATE,
    hora_reuniao TIME,
    local_reuniao VARCHAR(500),
    participantes JSONB, -- Array de IDs dos participantes
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id)
);

-- Tabela de notificações
CREATE TABLE notificacoes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'info' CHECK (tipo IN ('info', 'warning', 'error', 'success')),
    lida BOOLEAN DEFAULT false,
    dados_extras JSONB, -- Para dados adicionais da notificação
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de histórico de alterações (auditoria)
CREATE TABLE historico_alteracoes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    entidade_tipo VARCHAR(100) NOT NULL, -- 'cliente', 'usuario', 'agendamento', etc.
    entidade_id BIGINT NOT NULL,
    campo_alterado VARCHAR(255),
    valor_anterior TEXT,
    valor_novo TEXT,
    descricao_mudanca TEXT,
    usuario_id BIGINT,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- ====================================================

-- Índices para agendamentos
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_unidade ON agendamentos(unidade_atendimento);

-- Índices para atendimentos
CREATE INDEX idx_atendimentos_data ON atendimentos(data);
CREATE INDEX idx_atendimentos_cliente ON atendimentos(cliente_id);
CREATE INDEX idx_atendimentos_profissional ON atendimentos(profissional_id);

-- Índices para clientes
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX idx_clientes_unidade ON clientes(unidade_atendimento);
CREATE INDEX idx_clientes_adultos_cpf ON clientes_adultos(cpf);

-- Índices para vínculos
CREATE INDEX idx_vinculo_cliente ON vinculo_profissional_cliente(cliente_id);
CREATE INDEX idx_vinculo_profissional ON vinculo_profissional_cliente(profissional_id);

-- Índices para estoque
CREATE INDEX idx_estoque_categoria ON estoque_itens(categoria);
CREATE INDEX idx_movimentacoes_data ON movimentacoes_estoque(data_movimento);
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes_estoque(tipo_movimento);

-- Índices para usuários
CREATE INDEX idx_usuarios_cargo ON usuarios(cargo);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);

-- Índices para notificações
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);

-- Índices para histórico
CREATE INDEX idx_historico_entidade ON historico_alteracoes(entidade_tipo, entidade_id);
CREATE INDEX idx_historico_data ON historico_alteracoes(data_alteracao);

-- ====================================================
-- TRIGGERS E FUNÇÕES (OPCIONAL)
-- ====================================================

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER trigger_usuarios_timestamp
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_clientes_timestamp
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_agendamentos_timestamp
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_estoque_timestamp
    BEFORE UPDATE ON estoque_itens
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- ====================================================
-- COMENTÁRIOS DAS TABELAS
-- ====================================================

COMMENT ON TABLE usuarios IS 'Tabela unificada para todos os usuários do sistema (funcionários, estagiários, coordenadores, etc.)';
COMMENT ON TABLE clientes IS 'Tabela principal para pacientes, tanto adultos quanto menores';
COMMENT ON TABLE agendamentos IS 'Agendamentos de consultas e atendimentos';
COMMENT ON TABLE atendimentos IS 'Registro de atendimentos realizados';
COMMENT ON TABLE estoque_itens IS 'Controle de materiais e equipamentos da clínica';
COMMENT ON TABLE notificacoes IS 'Sistema de notificações internas';
COMMENT ON TABLE historico_alteracoes IS 'Auditoria de todas as alterações no sistema';
