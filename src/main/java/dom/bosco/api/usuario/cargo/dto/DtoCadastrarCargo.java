package dom.bosco.api.usuario.cargo.dto;

import jakarta.validation.constraints.NotBlank;

public record DtoCadastrarCargo(
        @NotBlank(message = "Nome é obrigatório")
        String nome
) {
}
