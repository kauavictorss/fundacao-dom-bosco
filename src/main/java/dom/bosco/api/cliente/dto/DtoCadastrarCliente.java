package dom.bosco.api.cliente.dto;

import dom.bosco.api.cliente.model.TipoCliente;
import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.DtoEndereco;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record DtoCadastrarCliente(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Data de nascimento é obrigatória")
        @Past(message = "Data de nascimento deve estar no passado")
        LocalDate dataNascimento,

        @NotBlank(message = "Gênero é obrigatório")
        String genero,

        @NotNull(message = "Tipo de cliente é obrigatório")
        TipoCliente tipoCliente,

        @NotNull(message = "Unidade de atendimento é obrigatória")
        Unidade unidadeAtendimento,

        @Valid
        DtoEndereco endereco,

        String observacoesGerais,
        String diagnosticoPrincipal,
        String historicoMedico,
        String queixaNeuropsicologica,
        String expectativasTratamento,

        // Campos específicos para cliente adulto
        String cpf,
        String rg,
        String naturalidade,
        String estadoCivil,
        String escolaridade,
        String profissao,
        String email,
        String telefone,
        String contatoEmergencia,

        // Campos específicos para cliente menor
        String nomeEscola,
        String tipoEscola,
        String anoEscolar,
        String nomePai,
        Integer idadePai,
        String profissaoPai,
        String telefonePai,
        String nomeMae,
        Integer idadeMae,
        String profissaoMae,
        String telefoneMae,
        String responsavelFinanceiro,
        String outroResponsavel
) {
}
