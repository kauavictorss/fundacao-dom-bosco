package dom.bosco.api.cliente.menor.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.DtoEndereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record DtoCadastroClienteMnr(
        Long id,
        @NotBlank String nome,
        @NotNull @JsonFormat(pattern = "dd-MM-yyyy") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate dataNascimento,
        @NotBlank String genero,
        String nomeEscola,
        String tipoEscola,
        String anoEscola,
        @NotBlank String nomePai,
        int idadePai,
        @NotBlank String profissaoPai,
        @NotBlank String telefonePai,
        @NotBlank String nomeMae,
        int idadeMae,
        @NotBlank String profissaoMae,
        @NotBlank String telefoneMae,
        @NotBlank String responsavelFinanceiro,
        String outroResponsavel,
        String observacoesGerais,
        String diagnosticoPrincipal,
        String historicoMedico,
        String queixaNeuropsicologica,
        String expectativasTratamento,
        @NotNull Unidade unidadeAtendimento,
        DtoEndereco endereco) {
}
