CREATE TABLE usuario (
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
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cargo (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    permissoes JSONB, -- Armazena as permissões de acesso às abas
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE cargo ADD COLUMN ativo BOOLEAN DEFAULT true;

CREATE TABLE permissao_cargo_usuario (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    aba VARCHAR(100) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL DEFAULT 'sem_acesso' CHECK (nivel_acesso IN ('sem_acesso', 'visualizar', 'editar')),
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    UNIQUE(usuario_id, aba)
);

CREATE TABLE unidade_atendimento (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO unidade_atendimento (nome) VALUES ('madre'), ('floresta');

CREATE TABLE cliente_adulto (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    ativo BOOLEAN DEFAULT true,
    nome VARCHAR(255) NOT NULL,
    dt_nascimento DATE NOT NULL,
    generalidade VARCHAR(50) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    rg VARCHAR(20),
    naturalidade VARCHAR(255),
    estado_civil VARCHAR(50),
    escolaridade VARCHAR(100),
    profissao VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(20),
    contato_emergencia TEXT,
    obsv_gerais TEXT,
    diagnostic_principal TEXT,
    historic_medico TEXT,
    qx_neuropsicologica TEXT,
    expctv_tratamento TEXT,
    unidade_atendimento VARCHAR(50) NOT NULL CHECK (unidade_atendimento IN ('madre', 'floresta')),
    cep VARCHAR(20),
    logradouro VARCHAR(255),
    num_endereco VARCHAR(50),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(50),
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario (id)
);

CREATE TABLE cliente_menor (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    ativo BOOLEAN DEFAULT true,
    nome_completo VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    genero VARCHAR(50) NOT NULL,
    nome_escola VARCHAR(255),
    tipo_escola VARCHAR(50),
    ano_escolar VARCHAR(50),
    nome_pai VARCHAR(255) NOT NULL,
    idade_pai INT,
    profissao_pai VARCHAR(255),
    telefone_pai VARCHAR(20) NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    idade_mae INT,
    profissao_mae VARCHAR(255),
    telefone_mae VARCHAR(20) NOT NULL,
    responsavel_financeiro VARCHAR(100),
    outro_responsavel TEXT,
    observacoes_gerais TEXT,
    diagnostico_principal TEXT,
    historico_medico TEXT,
    queixa_neuropsicologica TEXT,
    expectativas_tratamento TEXT,
    unidade_atendimento VARCHAR(50) NOT NULL CHECK (unidade_atendimento IN ('madre', 'floresta')),
    cep VARCHAR(20),
    logradouro VARCHAR(255),
    numero_endereco VARCHAR(50),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(50),
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id)
);
ALTER TABLE cliente_menor RENAME COLUMN numero_endereco TO num_endereco;
-- Tabela de vínculo entre profissionais e clientes adultos
CREATE TABLE vinculo_profissional_cliente_adulto (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente_adulto (id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuario(id) ON DELETE CASCADE,
    UNIQUE(cliente_id, profissional_id)
);

-- Tabela de vínculo entre profissionais e clientes menores
CREATE TABLE vinculo_profissional_cliente_menor (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    profissional_id BIGINT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente_menor(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuario(id) ON DELETE CASCADE,
    UNIQUE(cliente_id, profissional_id)
);

CREATE TABLE agendamentos (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_adulto_id BIGINT,
    cliente_menor_id BIGINT,
    profissional_id BIGINT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    servico VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'FALTOU')),
    unidade_atendimento VARCHAR(50) NOT NULL CHECK (unidade_atendimento IN ('madre', 'floresta')),
    observacoes TEXT,
    motivo_cancelamento TEXT,
    comprovante_cancelamento TEXT, -- Para armazenar base64 de imagens
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_adulto_id) REFERENCES cliente_adulto (id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_menor_id) REFERENCES cliente_menor(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuario(id),
    CHECK ((cliente_adulto_id IS NOT NULL AND cliente_menor_id IS NULL) OR
           (cliente_adulto_id IS NULL AND cliente_menor_id IS NOT NULL))
);

-- Tabela de atendimentos realizados
CREATE TABLE atendimentos (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_adulto_id BIGINT,
    cliente_menor_id BIGINT,
    profissional_id BIGINT,
    agendamento_id BIGINT,
    data DATE NOT NULL,
    tipo_sessao VARCHAR(255),
    anotacoes TEXT,
    valor DECIMAL(10,2),
    duracao_minutos INTEGER,
    anexos JSONB, -- Para armazenar múltiplos arquivos anexados
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_adulto_id) REFERENCES cliente_adulto (id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_menor_id) REFERENCES cliente_menor(id) ON DELETE CASCADE,
    FOREIGN KEY (profissional_id) REFERENCES usuario(id),
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id),
    CHECK ((cliente_adulto_id IS NOT NULL AND cliente_menor_id IS NULL) OR
           (cliente_adulto_id IS NULL AND cliente_menor_id IS NOT NULL))
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
    cliente_adulto_id BIGINT,
    cliente_menor_id BIGINT,
    titulo VARCHAR(500) NOT NULL,
    conteudo TEXT NOT NULL,
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_adulto_id) REFERENCES cliente_adulto (id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_menor_id) REFERENCES cliente_menor(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id),
    CHECK ((cliente_adulto_id IS NOT NULL AND cliente_menor_id IS NULL) OR
           (cliente_adulto_id IS NULL AND cliente_menor_id IS NOT NULL))
);

-- Tabela de documentos dos clientes
CREATE TABLE documentos_clientes (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    cliente_adulto_id BIGINT,
    cliente_menor_id BIGINT,
    titulo VARCHAR(500) NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(500) NOT NULL,
    -- dados_arquivo TEXT NOT NULL,  Base64 do arquivo
    descricao TEXT,
    criado_por_usuario_id BIGINT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_adulto_id) REFERENCES cliente_adulto (id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_menor_id) REFERENCES cliente_menor(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id),
    CHECK ((cliente_adulto_id IS NOT NULL AND cliente_menor_id IS NULL) OR
           (cliente_adulto_id IS NULL AND cliente_menor_id IS NOT NULL))
);

CREATE TABLE estoque_itens (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    estoque_minimo INT NOT NULL,
    valor_unidade DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    nota VARCHAR(500),
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
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
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
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id)
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
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuario(id)
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
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
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
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- ====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- ====================================================

-- Índices para agendamentos
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_cliente_adulto ON agendamentos(cliente_adulto_id);
CREATE INDEX idx_agendamentos_cliente_menor ON agendamentos(cliente_menor_id);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_unidade ON agendamentos(unidade_atendimento);

-- Índices para atendimentos
CREATE INDEX idx_atendimentos_data ON atendimentos(data);
CREATE INDEX idx_atendimentos_cliente_adulto ON atendimentos(cliente_adulto_id);
CREATE INDEX idx_atendimentos_cliente_menor ON atendimentos(cliente_menor_id);
CREATE INDEX idx_atendimentos_profissional ON atendimentos(profissional_id);

-- Índices para clientes adultos
CREATE INDEX idx_cliente_adt_nome ON cliente_adulto (nome);
CREATE INDEX idx_cliente_adt_cpf ON cliente_adulto (cpf);
CREATE INDEX idx_cliente_adt_email ON cliente_adulto (email);
CREATE INDEX idx_cliente_adt_unidade ON cliente_adulto (unidade_atendimento);

-- Índices para clientes menores
CREATE INDEX idx_cliente_mnr_nome ON cliente_menor (nome_completo);
CREATE INDEX idx_cliente_mnr_unidade ON cliente_menor (unidade_atendimento);
CREATE INDEX idx_cliente_mnr_escola ON cliente_menor (nome_escola);

-- Índices para vínculos
CREATE INDEX idx_vinculo_adulto_cliente ON vinculo_profissional_cliente_adulto(cliente_id);
CREATE INDEX idx_vinculo_adulto_profissional ON vinculo_profissional_cliente_adulto(profissional_id);
CREATE INDEX idx_vinculo_menor_cliente ON vinculo_profissional_cliente_menor(cliente_id);
CREATE INDEX idx_vinculo_menor_profissional ON vinculo_profissional_cliente_menor(profissional_id);

-- Índices para estoque
CREATE INDEX idx_estoque_categoria ON estoque_itens(categoria);
CREATE INDEX idx_movimentacoes_data ON movimentacoes_estoque(data_movimento);
CREATE INDEX idx_movimentacoes_tipo ON movimentacoes_estoque(tipo_movimento);

-- Índices para usuários
CREATE INDEX idx_usuarios_cargo ON usuario (cargo);
CREATE INDEX idx_usuarios_ativo ON usuario (ativo);

-- Índices para notificações
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);

-- Índices para histórico
CREATE INDEX idx_historico_entidade ON historico_alteracoes(entidade_tipo, entidade_id);
CREATE INDEX idx_historico_data ON historico_alteracoes(data_alteracao);

-- ====================================================
-- TRIGGERS E FUNÇÕES (OPCIONAL)
-- ====================================================

CREATE OR REPLACE FUNCTION atualizar_timestamp()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_timestamp
    BEFORE UPDATE ON usuario
    FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_cliente_adt_timestamp
    BEFORE UPDATE ON cliente_adulto
    FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_cliente_mnr_timestamp
    BEFORE UPDATE ON cliente_menor
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
