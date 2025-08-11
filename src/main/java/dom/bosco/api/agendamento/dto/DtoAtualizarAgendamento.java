package dom.bosco.api.agendamento.dto;

import dom.bosco.api.agendamento.StatusAgendamento;

import java.time.LocalDate;
import java.time.LocalTime;

public record DtoAtualizarAgendamento(LocalDate data, LocalTime horaInicio, LocalTime horaFim, String servico,
                                      StatusAgendamento status, String unidadeAtendimento, String observacoes,
                                      String motivoCancelamento) {
}
