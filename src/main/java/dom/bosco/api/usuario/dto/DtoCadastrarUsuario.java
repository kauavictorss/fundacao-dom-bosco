package dom.bosco.api.usuario.dto;

import dom.bosco.api.usuario.model.Cargo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DtoCadastrarUsuario(

        @NotBlank(message = "Nome de usuário é obrigatório")
        String usuario,

        @NotBlank(message = "Senha é obrigatória")
        String senha,

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "CPF é obrigatório")
        @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
        String cpf,

        @Email(message = "Email deve ter formato válido")
        String email,

        @NotBlank(message = "Celular é obrigatório")
        String celular,

        String endereco,

        @NotNull(message = "Cargo é obrigatório")
        Cargo cargo

) {
}
