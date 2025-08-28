package dom.bosco.api.cliente.model;

import lombok.Getter;

@Getter
public enum Unidade {
    MADRE("madre"),
    FLORESTA("floresta");

    private final String valor;

    Unidade(String valor) {
        this.valor = valor;
    }

    // Para usar em selects HTML
    public static Unidade[] getOpcoes() {
        return values();
    }

    @Override
    public String toString() {
        return this.valor;
    }
}
