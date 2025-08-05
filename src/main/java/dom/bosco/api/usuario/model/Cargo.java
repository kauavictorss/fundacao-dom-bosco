package dom.bosco.api.usuario.model;

public enum Cargo {
    DIRETORIA("Diretor(a)"),
    COORDENADOR_MADRE("Coordenador(a) Madre"),
    COORDENADOR_FLORESTA("Coordenador(a) Floresta"),
    FUNCIONARIO("Funcionário(a) Geral"),
    ESTAGIARIO("Estagiário(a)"),
    MUSICOTERAPEUTA("Musicoterapeuta"),
    FINANCEIRO("Financeiro"),
    RECEPCIONISTA("Recepcionista"),
    PSICOLOGO("Psicólogo(a)"),
    PSICOPEDAGOGO("Psicopedagogo(a)"),
    FONOAUDIOLOGO("Fonoaudiólogo(a)"),
    NUTRICIONISTA("Nutricionista"),
    FISIOTERAPEUTA("Fisioterapeuta");

    final String nomeExibicao;

    Cargo(String nomeExibicao) {
        this.nomeExibicao = nomeExibicao;
    }
}
