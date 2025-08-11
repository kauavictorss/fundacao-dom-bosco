package dom.bosco.api.agendamento.dto;

import dom.bosco.api.agendamento.StatusAgendamento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;

import java.time.LocalDate;
import java.time.LocalTime;

public record DtoCadastrarAgendamento(

        // CLIENTE - apenas um dos dois deve ser preenchido
        Long clienteAdultoId, Long clienteMenorId,

        @NotNull(message = "Profissional é obrigatório") Long profissionalId,

        @NotNull(message = "Data é obrigatória") @Future(message = "Data deve ser futura") LocalDate data,

        @NotNull(message = "Hora de início é obrigatória") LocalTime horaInicio,

        LocalTime horaFim,

        @NotNull(message = "Serviço é obrigatório") String servico,

        String unidadeAtendimento, String observacoes) {
    // Validação customizada para garantir que apenas um tipo de cliente seja informado
    public DtoCadastrarAgendamento {
        long clientesInformados = 0;
        if (clienteAdultoId != null) clientesInformados++;
        if (clienteMenorId != null) clientesInformados++;

        if (clientesInformados != 1) {
            throw new IllegalArgumentException("Deve ser informado exatamente um cliente (adulto OU menor)");
        }
    }

    public boolean isClienteAdulto() {
        return clienteAdultoId != null;
    }

    public boolean isClienteMenor() {
        return clienteMenorId != null;
    }

    public Long getClienteId() {
        return isClienteAdulto() ? clienteAdultoId : clienteMenorId;
    }
}
