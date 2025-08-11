package dom.bosco.api.agendamento;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CAMPOS PARA CLIENTES SEPARADOS
    @Column(name = "cliente_adulto_id")
    private Long clienteAdultoId;

    @Column(name = "cliente_menor_id")
    private Long clienteMenorId;

    @Column(name = "profissional_id")
    private Long profissionalId;

    @NotNull
    private LocalDate data;

    @NotNull
    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fim")
    private LocalTime horaFim;

    @NotNull
    private String servico;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;

    @Column(name = "unidade_atendimento")
    private String unidadeAtendimento;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "motivo_cancelamento", columnDefinition = "TEXT")
    private String motivoCancelamento;

    @Column(name = "comprovante_cancelamento", columnDefinition = "TEXT")
    private String comprovanteCancelamento;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
        if (status == null) {
            status = StatusAgendamento.AGENDADO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // MÉTODOS AUXILIARES PARA VERIFICAR TIPO DE CLIENTE
    public boolean isClienteAdulto() {
        return clienteAdultoId != null;
    }

    public boolean isClienteMenor() {
        return clienteMenorId != null;
    }

    public Long getClienteId() {
        return isClienteAdulto() ? clienteAdultoId : clienteMenorId;
    }

    public void setClienteAdulto(Long clienteId) {
        this.clienteAdultoId = clienteId;
        this.clienteMenorId = null; // Garantir exclusividade
    }

    public void setClienteMenor(Long clienteId) {
        this.clienteMenorId = clienteId;
        this.clienteAdultoId = null; // Garantir exclusividade
    }
}
