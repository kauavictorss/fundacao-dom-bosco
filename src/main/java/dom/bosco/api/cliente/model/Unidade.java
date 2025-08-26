package dom.bosco.api.cliente.model;

public enum Unidade {
    MADRE("Clínica Social (Madre)"),
    FLORESTA("Neuro (Floresta)");

    final String descricao;

    Unidade(String descricao) {
        this.descricao = descricao;
    }
}
