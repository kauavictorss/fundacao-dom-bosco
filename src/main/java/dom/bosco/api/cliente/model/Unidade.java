package dom.bosco.api.cliente.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;

@Getter
public enum Unidade {
    MADRE("madre"),
    FLORESTA("floresta");

    private final String valor;

    Unidade(String valor) {
        this.valor = valor;
    }

    @JsonCreator
    public static Unidade fromString(String text) {
        for (Unidade b : Unidade.values()) {
            if (b.valor.equalsIgnoreCase(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unidade inválida: " + text);
    }

    @Override
    public String toString() {
        return this.valor;
    }
}
