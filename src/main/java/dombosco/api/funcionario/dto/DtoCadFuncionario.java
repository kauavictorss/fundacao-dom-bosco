package dombosco.api.funcionario.dto;

import dombosco.api.endereco.DtoEndereco;
import dombosco.api.formacao.DtoFormacaoAcademica;
import dombosco.api.funcionario.model.Cargo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DtoCadFuncionario(

        @NotBlank String usuario,
        @NotBlank String senha,
        @NotBlank String nomeCompleto,
        @NotBlank String cpf,
        @NotBlank String celular,
        @NotBlank @Email String email,
        @NotNull Cargo cargo,
        DtoFormacaoAcademica fomacaoAcademica,
        @NotNull DtoEndereco endereco) {
}
