package dom.bosco.api.estoque;

public enum TipoMovimentacao {
    ENTRADA("entrada", "Entrada"),
    SAIDA("saida", "Saída");

    private final String code;
    private final String displayName;

    TipoMovimentacao(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    public static TipoMovimentacao fromCode(String code) {
        for (TipoMovimentacao tipo : values()) {
            if (tipo.code.equals(code)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de movimentação não encontrado: " + code);
    }
}
