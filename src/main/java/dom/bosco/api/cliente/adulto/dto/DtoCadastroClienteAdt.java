package dom.bosco.api.cliente.adulto.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.DtoEndereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record DtoCadastroClienteAdt(
        Long id,
        Boolean ativo,
        @NotBlank String nome,
        @NotNull /*@JsonFormat(pattern = "dd-MM-yyyy") @DateTimeFormat(pattern = "dd-MM-yyyy") */LocalDate dataNascimento,
        @NotBlank String generalidade,
        @NotBlank String cpf,
        String rg,
        String naturalidade,
        String estadoCivil,
        String escolaridade,
        String profissao,
        String email,
        String telefone,
        String contatoEmergencia,
        String observacoesGerais,
        String diagnosticoPrincipal,
        String historicoMedico,
        String queixaNeuropsicologica,
        String expectativasTratamento,
        Long criadoPorUsuarioId,
        @NotNull Unidade unidadeAtendimento,
        DtoEndereco endereco) {
}
