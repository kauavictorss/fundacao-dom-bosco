package dom.bosco.api.cliente;

public enum Unidade {
    MADRE("madre", "Clínica Social (Madre)"),
    FLORESTA("floresta", "Neuro (Floresta)");

    private final String code;
    private final String displayName;

    Unidade(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Unidade fromCode(String code) {
        for (Unidade unidade : values()) {
            if (unidade.code.equals(code)) {
                return unidade;
            }
        }
        throw new IllegalArgumentException("Unidade não encontrada: " + code);
    }
}
