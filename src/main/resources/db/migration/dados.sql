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