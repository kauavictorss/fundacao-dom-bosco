package dom.bosco.api.cliente.adulto.dto;

import dom.bosco.api.cliente.adulto.ClienteAdt;
import dom.bosco.api.endereco.Endereco;

import java.time.LocalDate;

public record DtoDetalharClienteAdt(Long id, String nome, LocalDate dataNascimento, String generalidade, String cpf,
                                    String rg, String naturalidade, String estadoCivil, String escolaridade,
                                    String profissao, String email, String telefone, String contatoEmergencia,
                                    String observacoesGerais, String diagnosticoPrincipal, String historicoMedico,
                                    String queixaNeuropsicologica, String expectativasTratamento, Endereco endereco) {

    public DtoDetalharClienteAdt(ClienteAdt cliente) {
        this(cliente.getId(), cliente.getNome(), cliente.getDataNascimento(), cliente.getGeneralidade(), cliente.getCpf(), cliente.getRg(), cliente.getNaturalidade(), cliente.getEstadoCivil(), cliente.getEscolaridade(), cliente.getProfissao(), cliente.getEmail(), cliente.getTelefone(), cliente.getContatoEmergencia(), cliente.getObservacoesGerais(), cliente.getDiagnosticoPrincipal(), cliente.getHistoricoMedico(), cliente.getQueixaNeuropsicologica(), cliente.getExpectativasTratamento(), cliente.getEndereco());
    }
}
