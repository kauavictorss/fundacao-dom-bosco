package dom.bosco.api.agendamento.dto;

import dom.bosco.api.agendamento.Agendamento;
import dom.bosco.api.agendamento.StatusAgendamento;

import java.time.LocalDate;
import java.time.LocalTime;

public record DtoListarAgendamento(Long id, Long clienteId, String tipoCliente, String nomeCliente, Long profissionalId,
                                   String nomeProfissional, LocalDate data, LocalTime horaInicio, LocalTime horaFim,
                                   String servico, StatusAgendamento status, String unidadeAtendimento) {

    public DtoListarAgendamento(Agendamento agendamento, String nomeCliente, String nomeProfissional) {
        this(agendamento.getId(), agendamento.getClienteId(),
                agendamento.isClienteAdulto() ? "ADULTO" : "MENOR", nomeCliente,
                agendamento.getProfissionalId(), nomeProfissional, agendamento.getData(),
                agendamento.getHoraInicio(), agendamento.getHoraFim(), agendamento.getServico(),
                agendamento.getStatus(), agendamento.getUnidadeAtendimento());
    }
}
