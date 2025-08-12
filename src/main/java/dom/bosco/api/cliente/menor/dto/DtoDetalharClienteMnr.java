package dom.bosco.api.cliente.menor.dto;

import dom.bosco.api.cliente.menor.ClienteMnr;
import dom.bosco.api.endereco.Endereco;

import java.time.LocalDate;

public record DtoDetalharClienteMnr(Long id, String nome, LocalDate dataNascimento, String genero, String nomeEscola,
                                    String anoEscolar, String nomePai, String pai, Integer idadePai,
                                    String profissaoPai, String telefonePai, String nomeMae, Integer idadeMae,
                                    String profissaoMae, String telefoneMae, String responsavelFinanceiro,
                                    String outroResponsavel, String observacoesGerais, String diagnosticoPrincipal,
                                    String historicoMedico, String queixaNeuropsicologica,
                                    String expectativasTratamento, Endereco endereco) {

    public DtoDetalharClienteMnr(ClienteMnr cliente) {
        this(cliente.getId(), cliente.getNome(), cliente.getDataNascimento(), cliente.getGenero(), cliente.getNomeEscola(), cliente.getTipoEscola(), cliente.getAnoEscolar(), cliente.getNomePai(), cliente.getIdadePai(), cliente.getProfissaoPai(), cliente.getTelefonePai(), cliente.getNomeMae(), cliente.getIdadeMae(), cliente.getProfissaoMae(), cliente.getTelefoneMae(), cliente.getResponsavelFinanceiro(), cliente.getOutroResponsavel(), cliente.getObservacoesGerais(), cliente.getDiagnosticoPrincipal(), cliente.getHistoricoMedico(), cliente.getQueixaNeuropsicologica(), cliente.getExpectativasTratamento(), cliente.getEndereco());
    }
}
