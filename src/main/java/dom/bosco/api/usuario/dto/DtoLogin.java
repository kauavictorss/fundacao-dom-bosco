package dom.bosco.api.usuario.dto;

import jakarta.validation.constraints.NotBlank;

public record DtoLogin(
    @NotBlank(message = "Usuário é obrigatório")
    String usuario,

    @NotBlank(message = "Senha é obrigatória")
    String senha
) {
}
