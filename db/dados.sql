create table funcionario (
    id bigserial not null primary key,
    ativo bit not null,
    usuario varchar(255) not null,
    senha varchar(255) not null,
    nome varchar(255) not null,
    cpf varchar(255) not null,
    email varchar(255) not null,
    celular varchar(255) not null,
    cargo varchar(255) not null,
    rua varchar(255) not null,
    numero_endereco varchar(255) not null,
    bairro varchar(255) not null,
    cidade varchar(255) not null,
    estado varchar(255) not null
);

alter table funcionario
    add column instituicao_ensino varchar(255),
    add column periodo_graduacao varchar(255),
    add column especialidade varchar(255),
    add column atvd_extracurricular varchar(255);

alter table funcionario alter column ativo type boolean using ativo::int::boolean;

create table estagiario (
    id bigserial not null primary key,
    ativo bit not null,
    usuario varchar(255) not null,
    senha varchar(255) not null,
    nome varchar(255) not null,
    cpf varchar(255) not null,
    email varchar(255) not null,
    celular varchar(255) not null,
    cargo varchar(255) not null,
    rua varchar(255) not null,
    numero_endereco varchar(255) not null,
    bairro varchar(255) not null,
    cidade varchar(255) not null,
    estado varchar(255) not null,
    instituicao_ensino varchar(255),
    periodo_graduacao varchar(255),
    especialidade varchar(255),
    atvd_extracurricular varchar(255)
);

alter table estagiario alter column ativo type boolean using ativo::int::boolean;

-- Tabela base para todos os clientes
create table cliente (
    id bigserial not null primary key,
    ativo boolean not null default true,
    usuario varchar(255) not null,
    senha varchar(255) not null,
    nome varchar(255) not null,
    data_nascimento date not null,
    genero varchar(255) not null,
    unidade_atendimento varchar(255) check (unidade_atendimento in ('madre', 'floresta')),
    cep varchar(255),
    logradouro varchar(255),
    numero_endereco varchar(255),
    complemento varchar(255),
    bairro varchar(255) not null,
    cidade varchar(255),
    estado varchar(255),
    observacoes_gerais text,
    diagnostico_principal text,
    historico_medico text,
    queixa_neuropsicologica text,
    expectativas_tratamento text,
    tipo_cliente varchar(31) not null -- Para discriminação JPA
);

create table cliente_maior_idade (
    id bigint not null primary key,
    cpf varchar(255) not null,
    rg varchar(255) not null,
    naturalidade varchar(255),
    cidade_estado varchar(255),
    estado_civil varchar(255),
    escolaridade varchar(255) not null,
    profissao varchar(255),
    email varchar(255) not null,
    telefone varchar(255) not null,
    contato_emergencia varchar(255),
    foreign key (id) references cliente(id)
);

create table cliente_menor_idade (
    id bigint not null primary key,
    nome_escola varchar(255),
    tipo_escola varchar(255),
    ano_escolar varchar(255),
    nome_pai varchar(255),
    idade_pai integer,
    profissao_pai varchar(255),
    telefone_pai varchar(255),
    nome_mae varchar(255),
    idade_mae integer,
    profissao_mae varchar(255),
    telefone_mae varchar(255),
    responsavel_financeiro varchar(255),
    outro_responsavel varchar(255),
    foreign key (id) references cliente(id)
);

-- Tabela de agendamentos
create table agendamento (
    id bigserial not null primary key,
    cliente_id bigint not null,
    profissional_id bigint,
    data date not null,
    hora_inicio time not null,
    hora_fim time not null,
    servico varchar(255) not null,
    status varchar(50) not null check (status in ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO', 'FALTOU')),
    unidade_atendimento varchar(255) check (unidade_atendimento in ('MADRE', 'FLORESTA')),
    observacoes text,
    criado_em date not null default current_date,
    atualizado_em date,
    foreign key (cliente_id) references cliente(id)
);

-- Índices para melhor performance
create index idx_agendamento_data on agendamento(data);
create index idx_agendamento_cliente on agendamento(cliente_id);
create index idx_agendamento_profissional on agendamento(profissional_id);
create index idx_agendamento_status on agendamento(status);
create index idx_agendamento_unidade on agendamento(unidade_atendimento);
