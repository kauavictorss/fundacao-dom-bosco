package dombosco.api.estagiario;

import dombosco.api.endereco.DtoEndereco;
import dombosco.api.formacao.DtoFormacaoAcademica;
import dombosco.api.funcionario.model.Cargo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DtoCadEstagiario(
        @NotBlank String nome,
        @NotBlank String usuario,
        @NotBlank String senha,
        @NotBlank String cpf,
        @NotBlank String email,
        @NotBlank String celular,
        @NotNull Cargo cargo,
        @NotNull DtoFormacaoAcademica formacaoAcademica,
        @NotBlank DtoEndereco endereco) {
}
