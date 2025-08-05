package dom.bosco.api.cliente;

public enum TipoCliente {
    ADULT("adult", "Adulto"),
    MINOR("minor", "Menor");

    private final String code;
    private final String displayName;

    TipoCliente(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static TipoCliente fromCode(String code) {
        for (TipoCliente tipo : values()) {
            if (tipo.code.equals(code)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de cliente não encontrado: " + code);
    }
}
