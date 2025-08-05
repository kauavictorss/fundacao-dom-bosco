package dom.bosco.api.agendamento;

public enum StatusPagamento {
    PENDENTE("pendente", "Pendente"),
    PAGO("pago", "Pago"),
    PARCIAL("parcial", "Pago Parcialmente"),
    CANCELADO("cancelado", "Cancelado"),
    ISENTO("isento", "Isento");

    private final String code;
    private final String displayName;

    StatusPagamento(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    public static StatusPagamento fromCode(String code) {
        for (StatusPagamento status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status de pagamento não encontrado: " + code);
    }
}
