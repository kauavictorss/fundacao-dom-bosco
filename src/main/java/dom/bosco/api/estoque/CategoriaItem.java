package dom.bosco.api.estoque;

public enum CategoriaItem {
    PAPELARIA("Papelaria"),
    TESTES_NEUROPSICOLOGICOS("Testes Neuropsicologicos"),
    BRINQUEDOS_TERAPEUTICOS("Brinquedos Terapeuticos"),
    JOGOS_E_QUEBRA_CABECAS("material_limpeza"),
    EQUIPAMENTOS_TECNOLOGICOS("material_terapeutico"),
    MATERIAIS_CONSUMIVEIS("livros_materiais"),
    OUTROS("outros");

    final String descricao;

    CategoriaItem(String descricao) {
        this.descricao = descricao;
    }
}
