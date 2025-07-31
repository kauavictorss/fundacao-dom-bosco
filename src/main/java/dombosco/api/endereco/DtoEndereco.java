package dombosco.api.endereco;

import jakarta.validation.constraints.NotBlank;

public record DtoEndereco(
        @NotBlank String rua,
        @NotBlank String numero,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank String estado) {
}
