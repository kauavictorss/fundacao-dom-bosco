package dom.bosco.api.agendamento;

public enum TipoServico {
    AVALIACAO_NEUROPSICOLOGICA("avaliacao-neuropsicologica", "Avaliação Neuropsicológica"),
    REABILITACAO_COGNITIVA("reabilitacao-cognitiva", "Reabilitação Cognitiva"),
    TERAPIA_COGNITIVA("terapia-cognitiva", "Terapia Cognitiva"),
    ORIENTACAO_FAMILIAR("orientacao-familiar", "Orientação Familiar"),
    PSICOTERAPIA("psicoterapia", "Psicoterapia"),
    MUSICOTERAPIA("musicoterapia", "Musicoterapia"),
    PSICANALISE("psicanalise", "Psicanálise"),
    TCC("terapia-cognitivo-comportamental", "Terapia Cognitivo-Comportamental (TCC)"),
    TERAPIA_JUNGUIANA("terapia-junguiana", "Terapia Junguiana"),
    TERAPIA_COMPORTAMENTAL("terapia-comportamental", "Terapia Comportamental"),
    GESTALT_TERAPIA("gestalt-terapia", "Gestalt-terapia"),
    TERAPIA_FAMILIAR("terapia-familiar", "Terapia Familiar"),
    TERAPIA_CASAL("terapia-de-casal", "Terapia de Casal"),
    OUTROS("outros", "Outros");

    private final String code;
    private final String displayName;

    TipoServico(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    public static TipoServico fromCode(String code) {
        for (TipoServico tipo : values()) {
            if (tipo.code.equals(code)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de serviço não encontrado: " + code);
    }
}
