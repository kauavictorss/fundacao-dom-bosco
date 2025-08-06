package dom.bosco.api.cliente.model;

public enum TipoCliente {
    ADULT("Adulto"),
    MINOR("Menor");

    final String displayName;

    TipoCliente(String displayName) {
        this.displayName = displayName;
    }
}
