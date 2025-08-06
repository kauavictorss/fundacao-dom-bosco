package dom.bosco.api.cliente;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo = true;

    @NotBlank
    private String nome;

    @NotNull
    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @NotBlank
    private String genero;

    @Column(name = "unidade_atendimento")
    @Enumerated(EnumType.STRING)
    private Unidade unidadeAtendimento;

    private String cep;
    private String logradouro;

    @Column(name = "numero_endereco")
    private String numeroEndereco;

    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;

    @Column(name = "observacoes_gerais", columnDefinition = "TEXT")
    private String observacoesGerais;

    @Column(name = "diagnostico_principal", columnDefinition = "TEXT")
    private String diagnosticoPrincipal;

    @Column(name = "historico_medico", columnDefinition = "TEXT")
    private String historicoMedico;

    @Column(name = "queixa_neuropsicologica", columnDefinition = "TEXT")
    private String queixaNeuropsicologica;

    @Column(name = "expectativas_tratamento", columnDefinition = "TEXT")
    private String expectativasTratamento;

    @NotNull
    @Column(name = "tipo_cliente")
    @Enumerated(EnumType.STRING)
    private TipoCliente tipoCliente;

    @Column(name = "criado_por_usuario_id")
    private Long criadoPorUsuarioId;

    // Histórico de alterações (usando @ElementCollection para compatibilidade com o DDL)
    @ElementCollection
    @CollectionTable(name = "cliente_historico", joinColumns = @JoinColumn(name = "cliente_id"))
    @Column(name = "alteracao", columnDefinition = "TEXT")
    private List<String> changeHistory;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
        if (ativo == null) {
            ativo = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
