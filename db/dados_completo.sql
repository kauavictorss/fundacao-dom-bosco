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
    cargo VARCHAR(255) NOT NULL,
    rua VARCHAR(255),
    numero_endereco VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(255),
    -- Campos acadêmicos (para estagiários e profissionais)
    instituicao_ensino VARCHAR(255),
    periodo_graduacao VARCHAR(255),
    especialidade VARCHAR(255),
    atvd_extracurricular VARCHAR(255),
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
-- DADOS INICIAIS (SEED DATA)
-- ====================================================

-- Inserir usuários padrão do sistema
INSERT INTO usuarios (usuario, senha, nome, cargo, ativo) VALUES
('director', 'admin123', 'Diretoria Geral', 'director', true),
('financeiro', 'admin123', 'Financeiro', 'financeiro', true),
('staff', 'staff123', 'Funcionário', 'staff', true),
('raquel', 'admin123', 'Coordenadora Raquel (Floresta)', 'coordinator_floresta', true),
('tatiana_admin', 'admin123', 'Tatiane', 'coordinator_madre', true),
('tatiana_neuro', 'admin123', 'Coordenadora Tatiana (Floresta)', 'coordinator_floresta', true),
('musica', 'teste123', 'Maria Melodia', 'musictherapist', true),
('frances', 'intern123', 'Frances Jane Bifano Freddi', 'intern', true),
('vanessa', 'intern123', 'Vanessa', 'intern', true),
('luciana', 'intern123', 'Luciana Villela Moyses', 'intern', true),
('debora', 'intern123', 'Debora', 'intern', true),
('renata', 'intern123', 'Renata', 'intern', true),
('nathalia', 'intern123', 'Nathalia', 'intern', true),
('walisson', 'intern123', 'Walisson', 'intern', true),
('tatiana', 'intern123', 'Tatiana', 'intern', true),
('luiz', 'intern123', 'Luiz', 'intern', true),
('pedro', 'intern123', 'Pedro', 'intern', true),
('pedro_alexandre', 'intern123', 'Pedro Alexandre Carneiro', 'intern', true),
('wallisson', 'intern123', 'Wallisson Henrique Santos', 'intern', true),
('renata_cantagalli', 'intern123', 'Renata Grichtolik Cantagalli Paiva', 'intern', true),
('rachel', 'rachel123', 'Rachel Silva', 'staff', true),
('tatiane', 'tatiane123', 'Tatiane', 'coordinator_madre', true),
('christopher', 'christopher123', 'Christopher', 'receptionist', true),
('yuri', 'yuri123', 'Yuri', 'receptionist', true),
('kimberly', 'kimberly123', 'Kimberly', 'psychologist', true),
('beethoven', 'beethoven123', 'Beethoven', 'musictherapist', true),
('cristine', 'cristine123', 'Cristine', 'psychopedagogue', true),
('viviane', 'viviane123', 'Viviane', 'nutritionist', true),
('renata_fono', 'renatafono123', 'Renata', 'speech_therapist', true),
('daniella', 'daniella123', 'Daniella', 'speech_therapist', true),
('jeferson', 'jeferson123', 'Jeferson', 'physiotherapist', true);

-- Inserir todos os itens do estoque por categoria
INSERT INTO estoque_itens (nome, categoria, quantidade, estoque_minimo, valor_unitario, descricao) VALUES

-- PAPELARIA
('Lápis HB', 'papelaria', 50, 10, 1.50, 'Lápis para desenho e escrita'),
('Lápis 2B', 'papelaria', 30, 10, 1.60, 'Lápis macio para desenho'),
('Lápis de cor - 12 cores', 'papelaria', 25, 5, 12.50, 'Caixa de lápis de cor com 12 cores'),
('Lápis de cor - 24 cores', 'papelaria', 15, 3, 25.00, 'Caixa de lápis de cor com 24 cores'),
('Papel A4', 'papelaria', 100, 20, 0.15, 'Folhas de papel sulfite A4'),
('Papel A3', 'papelaria', 50, 10, 0.25, 'Folhas de papel sulfite A3'),
('Papel cartão branco', 'papelaria', 40, 8, 0.80, 'Folhas de papel cartão A4'),
('Papel cartão colorido', 'papelaria', 60, 12, 0.90, 'Folhas de papel cartão coloridas'),
('Caneta esferográfica azul', 'papelaria', 30, 8, 2.50, 'Caneta esferográfica cor azul'),
('Caneta esferográfica preta', 'papelaria', 30, 8, 2.50, 'Caneta esferográfica cor preta'),
('Caneta esferográfica vermelha', 'papelaria', 20, 5, 2.50, 'Caneta esferográfica cor vermelha'),
('Marcador de texto amarelo', 'papelaria', 15, 5, 3.50, 'Marcador de texto fluorescente'),
('Marcador de texto rosa', 'papelaria', 10, 3, 3.50, 'Marcador de texto fluorescente'),
('Borracha branca', 'papelaria', 40, 10, 1.20, 'Borracha para lápis'),
('Apontador', 'papelaria', 25, 8, 2.00, 'Apontador de lápis'),
('Régua 30cm', 'papelaria', 20, 5, 3.50, 'Régua transparente de 30cm'),
('Cola bastão', 'papelaria', 30, 8, 4.50, 'Cola em bastão 40g'),
('Cola líquida', 'papelaria', 25, 5, 3.20, 'Cola líquida branca 90g'),
('Tesoura escolar', 'papelaria', 15, 5, 8.50, 'Tesoura com ponta arredondada'),
('Grampeador', 'papelaria', 5, 2, 15.00, 'Grampeador de mesa'),
('Grampos', 'papelaria', 10, 3, 5.50, 'Caixa de grampos 26/6'),
('Clips pequenos', 'papelaria', 8, 2, 3.80, 'Caixa de clips pequenos'),
('Clips grandes', 'papelaria', 5, 2, 4.50, 'Caixa de clips grandes'),
('Pasta arquivo A-Z', 'papelaria', 12, 3, 18.50, 'Pasta sanfonada A-Z'),
('Pasta com elástico', 'papelaria', 20, 5, 6.50, 'Pasta cartão com elástico'),
('Envelope A4', 'papelaria', 100, 20, 0.45, 'Envelope branco tamanho A4'),
('Etiquetas adesivas', 'papelaria', 15, 5, 8.50, 'Etiquetas adesivas brancas'),

-- TESTES NEUROPSICOLÓGICOS
('Teste WISC-IV', 'testes', 2, 1, 850.00, 'Teste de inteligência Wechsler para crianças'),
('Teste WAIS-IV', 'testes', 2, 1, 950.00, 'Teste de inteligência Wechsler para adultos'),
('Teste de Atenção D2', 'testes', 3, 1, 450.00, 'Teste de atenção concentrada'),
('Teste Torre de Londres', 'testes', 2, 1, 380.00, 'Teste de funções executivas'),
('Teste de Trilhas (TMT)', 'testes', 5, 2, 120.00, 'Teste de flexibilidade mental'),
('Teste de Stroop', 'testes', 4, 2, 180.00, 'Teste de controle inibitório'),
('Teste de Fluência Verbal', 'testes', 10, 3, 25.00, 'Protocolos de fluência verbal'),
('Teste de Rey - Figura Complexa', 'testes', 5, 2, 85.00, 'Teste de memória e percepção'),
('Teste de Vocabulário por Imagens', 'testes', 3, 1, 320.00, 'Teste de vocabulário receptivo'),
('Escala de Desenvolvimento Infantil', 'testes', 2, 1, 680.00, 'Avaliação do desenvolvimento'),
('Teste de Habilidades Sociais', 'testes', 3, 1, 280.00, 'Inventário de habilidades sociais'),
('Protocolo de Anamnese Infantil', 'testes', 50, 10, 2.50, 'Formulários de anamnese'),
('Protocolo de Anamnese Adulto', 'testes', 50, 10, 2.50, 'Formulários de anamnese'),
('Escala de Depressão Beck', 'testes', 20, 5, 15.00, 'Inventário de depressão'),
('Escala de Ansiedade Beck', 'testes', 20, 5, 15.00, 'Inventário de ansiedade'),

-- BRINQUEDOS TERAPÊUTICOS
('Bola sensorial', 'brinquedos', 8, 3, 15.00, 'Bola com texturas para estimulação sensorial'),
('Massinha de modelar', 'brinquedos', 15, 5, 8.50, 'Kit de massinha atóxica'),
('Blocos de encaixe', 'brinquedos', 10, 3, 25.00, 'Blocos coloridos para coordenação'),
('Boneco articulado', 'brinquedos', 5, 2, 35.00, 'Boneco para esquema corporal'),
('Boneca de pano', 'brinquedos', 4, 2, 28.00, 'Boneca macia para terapia'),
('Pelúcia urso', 'brinquedos', 6, 2, 45.00, 'Urso de pelúcia para acolhimento'),
('Kit médico infantil', 'brinquedos', 3, 1, 32.00, 'Kit com estetoscópio e instrumentos'),
('Casa de boneca', 'brinquedos', 2, 1, 120.00, 'Casa de boneca para role-play'),
('Carrinho de brinquedo', 'brinquedos', 8, 3, 18.50, 'Carrinhos diversos tamanhos'),
('Fantoche de mão', 'brinquedos', 10, 3, 12.00, 'Fantoches de animais e pessoas'),
('Bola de basquete infantil', 'brinquedos', 3, 1, 25.00, 'Bola tamanho infantil'),
('Corda de pular', 'brinquedos', 5, 2, 8.50, 'Corda colorida infantil'),
('Bambolê', 'brinquedos', 4, 2, 15.00, 'Bambolê colorido'),
('Instrumento musical - xilofone', 'brinquedos', 3, 1, 45.00, 'Xilofone colorido infantil'),
('Instrumento musical - pandeiro', 'brinquedos', 4, 2, 22.00, 'Pandeiro infantil'),

-- JOGOS E QUEBRA-CABEÇAS
('Quebra-cabeça 50 peças', 'jogos', 5, 2, 25.00, 'Quebra-cabeça terapêutico para crianças'),
('Quebra-cabeça 100 peças', 'jogos', 4, 2, 35.00, 'Quebra-cabeça intermediário'),
('Quebra-cabeça 200 peças', 'jogos', 3, 1, 45.00, 'Quebra-cabeça avançado'),
('Dominó tradicional', 'jogos', 6, 2, 18.00, 'Jogo de dominó'),
('Dominó de imagens', 'jogos', 4, 2, 22.00, 'Dominó com figuras'),
('Jogo da memória', 'jogos', 8, 3, 15.50, 'Jogo de memória com pares'),
('Tangram', 'jogos', 6, 2, 12.00, 'Jogo de formas geométricas'),
('Lego blocos básicos', 'jogos', 5, 2, 85.00, 'Kit básico de blocos de montar'),
('Jogo de encaixe formas', 'jogos', 4, 2, 28.00, 'Jogo de encaixe de formas'),
('Cubo mágico', 'jogos', 3, 1, 25.00, 'Cubo mágico 3x3'),
('Jogo da velha', 'jogos', 4, 2, 15.00, 'Jogo da velha em madeira'),
('Xadrez', 'jogos', 2, 1, 45.00, 'Tabuleiro de xadrez'),
('Damas', 'jogos', 3, 1, 25.00, 'Jogo de damas'),
('UNO', 'jogos', 5, 2, 18.50, 'Jogo de cartas UNO'),
('Baralho comum', 'jogos', 6, 2, 8.50, 'Baralho tradicional'),

-- EQUIPAMENTOS TECNOLÓGICOS
('Tablet Android', 'tecnologia', 3, 1, 850.00, 'Tablet para aplicativos terapêuticos'),
('Cronômetro digital', 'tecnologia', 5, 2, 35.00, 'Cronômetro para testes'),
('Calculadora científica', 'tecnologia', 4, 2, 45.00, 'Calculadora para testes matemáticos'),
('Gravador de voz', 'tecnologia', 3, 1, 120.00, 'Gravador digital para sessões'),
('Webcam HD', 'tecnologia', 2, 1, 180.00, 'Câmera para teleconsultas'),
('Fone de ouvido', 'tecnologia', 6, 2, 65.00, 'Fone para testes auditivos'),
('Caixa de som Bluetooth', 'tecnologia', 2, 1, 150.00, 'Caixa de som para musicoterapia'),
('Pendrive 32GB', 'tecnologia', 8, 3, 35.00, 'Pendrive para backup'),
('Mouse óptico', 'tecnologia', 4, 2, 25.00, 'Mouse para computador'),
('Teclado', 'tecnologia', 2, 1, 85.00, 'Teclado para computador'),

-- MATERIAIS CONSUMÍVEIS
('Álcool 70%', 'consumiveis', 20, 5, 8.50, 'Álcool para higienização'),
('Álcool gel', 'consumiveis', 15, 5, 12.00, 'Álcool gel para mãos'),
('Papel toalha', 'consumiveis', 30, 8, 6.50, 'Rolo de papel toalha'),
('Lenço de papel', 'consumiveis', 25, 8, 4.50, 'Caixa de lenços'),
('Luvas descartáveis', 'consumiveis', 10, 3, 18.50, 'Caixa de luvas de látex'),
('Máscaras descartáveis', 'consumiveis', 5, 2, 25.00, 'Caixa de máscaras cirúrgicas'),
('Sabonete líquido', 'consumiveis', 12, 4, 8.50, 'Refil de sabonete'),
('Desinfetante', 'consumiveis', 8, 3, 12.50, 'Desinfetante multiuso'),
('Guardanapo', 'consumiveis', 20, 5, 3.50, 'Pacote de guardanapos'),
('Copo descartável 200ml', 'consumiveis', 15, 5, 8.50, 'Pacote de copos descartáveis'),
('Pilha AA', 'consumiveis', 20, 8, 4.50, 'Pilha alcalina AA'),
('Pilha AAA', 'consumiveis', 15, 5, 4.80, 'Pilha alcalina AAA'),
('Fita adesiva', 'consumiveis', 12, 4, 5.50, 'Fita adesiva transparente'),
('Fita dupla face', 'consumiveis', 8, 3, 7.50, 'Fita adesiva dupla face'),

-- OUTROS
('Armário organizador', 'outros', 2, 1, 350.00, 'Armário para materiais'),
('Estante de livros', 'outros', 1, 1, 280.00, 'Estante para bibliografia'),
('Mesa infantil', 'outros', 4, 2, 150.00, 'Mesa para atendimento infantil'),
('Cadeira infantil', 'outros', 8, 4, 85.00, 'Cadeira para crianças'),
('Tapete emborrachado', 'outros', 3, 1, 120.00, 'Tapete para atividades no chão'),
('Quadro branco', 'outros', 2, 1, 95.00, 'Quadro branco para atividades'),
('Marcador para quadro branco', 'outros', 10, 3, 8.50, 'Marcador apagável'),
('Apagador para quadro', 'outros', 4, 2, 12.00, 'Apagador magnético'),
('Relógio de parede', 'outros', 3, 1, 35.00, 'Relógio analógico educativo'),
('Lixeira com pedal', 'outros', 6, 2, 45.00, 'Lixeira higiênica'),
('Organizador de mesa', 'outros', 8, 3, 25.00, 'Porta-lápis e organizador'),
('Pasta suspensa', 'outros', 20, 5, 3.50, 'Pasta para arquivo'),
('Prancheta A4', 'outros', 10, 3, 12.50, 'Prancheta com presilha'),
('Almofada', 'outros', 6, 2, 35.00, 'Almofada para conforto'),
('Espelho pequeno', 'outros', 4, 2, 18.50, 'Espelho para atividades'),
('Caixa organizadora pequena', 'outros', 15, 5, 8.50, 'Caixa plástica transparente'),
('Caixa organizadora média', 'outros', 10, 3, 15.50, 'Caixa plástica com tampa'),
('Caixa organizadora grande', 'outros', 5, 2, 28.00, 'Caixa grande para armazenamento');

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
