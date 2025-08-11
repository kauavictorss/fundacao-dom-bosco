package dom.bosco.api.cliente.menor.dto;

import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.DtoEndereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DtoCadastroClienteMnr(
        Long id,
        @NotBlank String nome,
        @NotBlank LocalDate dataNascimento,
        @NotBlank String genero,
        String nomeEscola,
        String tipoEscola,
        String anoEscola,
        @NotBlank String nomePai,
        @NotBlank Integer idadePai,
        @NotBlank String profissaoPai,
        @NotBlank String telefonePai,
        @NotBlank String nomeMae,
        @NotBlank Integer idadeMae,
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
