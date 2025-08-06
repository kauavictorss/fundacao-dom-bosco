package dom.bosco.api.cliente.dto;

import jakarta.validation.constraints.NotNull;

public record DtoVincularProfissional(
        @NotNull(message = "ID do cliente é obrigatório")
        Long clienteId,

        @NotNull(message = "ID do profissional é obrigatório")
        Long profissionalId
) {
}
