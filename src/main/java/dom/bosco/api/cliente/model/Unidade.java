package dom.bosco.api.cliente.model;

public enum Unidade {
    MADRE("Clínica Social (Madre)"),
    FLORESTA("Neuro (Floresta)");

    final String displayName;

    Unidade(String displayName) {
        this.displayName = displayName;
    }
}
