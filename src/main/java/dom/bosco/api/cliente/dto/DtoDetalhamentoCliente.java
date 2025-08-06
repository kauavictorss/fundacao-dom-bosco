package dom.bosco.api.cliente.dto;


import dom.bosco.api.cliente.model.Cliente;
import dom.bosco.api.cliente.model.TipoCliente;
import dom.bosco.api.endereco.DtoEndereco;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DtoDetalhamentoCliente(
        Long id,
        Boolean ativo,
        String nome,
        LocalDate dataNascimento,
        String genero,
        TipoCliente tipoCliente,
        String unidadeAtendimento,
        DtoEndereco endereco,
        String observacoesGerais,
        String diagnosticoPrincipal,
        String historicoMedico,
        String queixaNeuropsicologica,
        String expectativasTratamento,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm,
        List<DtoProfissionalVinculado> profissionaisVinculados, // ADICIONADO

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

    public DtoDetalhamentoCliente(Cliente cliente) {
        this(
                cliente.getId(),
                cliente.getAtivo(),
                cliente.getNome(),
                cliente.getDataNascimento(),
                cliente.getGenero(),
                cliente.getTipoCliente(),
                cliente.getUnidadeAtendimento(),
                cliente.getEndereco() != null ? new DtoEndereco(cliente.getEndereco()) : null,
                cliente.getObservacoesGerais(),
                cliente.getDiagnosticoPrincipal(),
                cliente.getHistoricoMedico(),
                cliente.getQueixaNeuropsicologica(),
                cliente.getExpectativasTratamento(),
                cliente.getCriadoEm(),
                cliente.getAtualizadoEm(),
                null, // profissionaisVinculados será preenchido pelo controller

                // Campos específicos para adulto
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getCpf() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getRg() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getNaturalidade() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getEstadoCivil() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getEscolaridade() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getProfissao() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getEmail() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getTelefone() : null,
                cliente.getClienteAdulto() != null ? cliente.getClienteAdulto().getContatoEmergencia() : null,

                // Campos específicos para menor
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getNomeEscola() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getTipoEscola() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getAnoEscolar() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getNomePai() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getIdadePai() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getProfissaoPai() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getTelefonePai() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getNomeMae() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getIdadeMae() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getProfissaoMae() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getTelefoneMae() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getResponsavelFinanceiro() : null,
                cliente.getClienteMenor() != null ? cliente.getClienteMenor().getOutroResponsavel() : null
        );
    }
}
