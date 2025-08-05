package dom.bosco.api.agendamento;

public enum StatusAgendamento {
    AGENDADO("agendado", "Agendado"),
    CONFIRMADO("confirmado", "Confirmado"),
    EM_ANDAMENTO("em_andamento", "Em Andamento"),
    CONCLUIDO("concluido", "Concluído"),
    CANCELADO("cancelado", "Cancelado"),
    FALTOU("faltou", "Paciente Faltou");

    private final String code;
    private final String displayName;

    StatusAgendamento(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    public static StatusAgendamento fromCode(String code) {
        for (StatusAgendamento status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Status de agendamento não encontrado: " + code);
    }
}
