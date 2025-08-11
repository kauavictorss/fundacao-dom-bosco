package dom.bosco.api.cliente.adulto;

import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.Endereco;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "cliente_adt")
public class ClienteAdt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo = true;

    @Column(name = "nome_complet")
    private String nome;

    @Column(name = "dt_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "generalidade")
    private String generalidade;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "rg")
    private String rg;

    @Column(name = "naturalidade")
    private String naturalidade;

    @Column(name = "estado_civil")
    private String estadoCivil;

    @Column(name = "escolaridade")
    private String escolaridade;

    @Column(name = "profissao")
    private String profissao;

    @Column(name = "email")
    private String email;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "contato_emergencia", columnDefinition = "TEXT")
    private String contatoEmergencia;

    @Column(name = "obsv_gerais", columnDefinition = "TEXT")
    private String observacoesGerais;

    @Column(name = "diagnostic_principal", columnDefinition = "TEXT")
    private String diagnosticoPrincipal;

    @Column(name = "historic_medico", columnDefinition = "TEXT")
    private String historicoMedico;

    @Column(name = "qx_neuropsicologica", columnDefinition = "TEXT")
    private String queixaNeuropsicologica;

    @Column(name = "expctv_tratamento", columnDefinition = "TEXT")
    private String expectativasTratamento;

    @Column(name = "criado_por_usuario_id")
    private Long criadoPorUsuarioId;

    @Column(name = "unidade_atdmt")
    @Enumerated(EnumType.STRING)
    private Unidade unidadeAtendimento;

    @Embedded
    private Endereco endereco;
}
