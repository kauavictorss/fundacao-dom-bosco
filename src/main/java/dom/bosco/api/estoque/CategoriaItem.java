package dom.bosco.api.estoque;

public enum CategoriaItem {
    MATERIAL_ESCRITORIO("material_escritorio", "Material de Escritório"),
    EQUIPAMENTOS("equipamentos", "Equipamentos"),
    MEDICAMENTOS("medicamentos", "Medicamentos"),
    MATERIAL_LIMPEZA("material_limpeza", "Material de Limpeza"),
    MATERIAL_TERAPEUTICO("material_terapeutico", "Material Terapêutico"),
    LIVROS_MATERIAIS("livros_materiais", "Livros e Materiais Didáticos"),
    OUTROS("outros", "Outros");

    private final String code;
    private final String displayName;

    CategoriaItem(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    public static CategoriaItem fromCode(String code) {
        for (CategoriaItem categoria : values()) {
            if (categoria.code.equals(code)) {
                return categoria;
            }
        }
        throw new IllegalArgumentException("Categoria de item não encontrada: " + code);
    }
}
