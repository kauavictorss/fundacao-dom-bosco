package dom.bosco.api.cliente.menor;

import dom.bosco.api.cliente.menor.dto.DtoCadastroClienteMnr;
import dom.bosco.api.cliente.model.Unidade;
import dom.bosco.api.endereco.Endereco;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cliente_mnr")
public class ClienteMnr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo = true;

    @Column(name = "nome_completo")
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "genero")
    private String genero;

    @Column(name = "nome_escola")
    private String nomeEscola;

    @Column(name = "tipo_escola")
    private String tipoEscola;

    @Column(name = "ano_escolar")
    private String anoEscolar;

    @Column(name = "nome_pai")
    private String nomePai;

    @Column(name = "idade_pai")
    private int idadePai;

    @Column(name = "profissao_pai")
    private String profissaoPai;

    @Column(name = "telefone_pai")
    private String telefonePai;

    @Column(name = "nome_mae")
    private String nomeMae;

    @Column(name = "idade_mae")
    private int idadeMae;

    @Column(name = "profissao_mae")
    private String profissaoMae;

    @Column(name = "telefone_mae")
    private String telefoneMae;

    @Column(name = "responsavel_financeiro")
    private String responsavelFinanceiro;

    @Column(name = "outro_responsavel", columnDefinition = "TEXT")
    private String outroResponsavel;

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

    @Column(name = "criado_por_usuario_id")
    private Long criadoPorUsuarioId;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidade_atendimento")
    private Unidade unidadeAtendimento;

    @Embedded
    private Endereco endereco;

    public ClienteMnr(@Valid DtoCadastroClienteMnr dados) {
        this.ativo = true;
        this.nome = dados.nome();
        this.dataNascimento = dados.dataNascimento();
        this.genero = dados.genero();
        this.nomeEscola = dados.nomeEscola();
        this.tipoEscola = dados.tipoEscola();
        this.anoEscolar = dados.anoEscolar();
        this.nomePai = dados.nomePai();
        this.idadePai = dados.idadePai();
        this.profissaoPai = dados.profissaoPai();
        this.telefonePai = dados.telefonePai();
        this.nomeMae = dados.nomeMae();
        this.idadeMae = dados.idadeMae();
        this.profissaoMae = dados.profissaoMae();
        this.telefoneMae = dados.telefoneMae();
        this.responsavelFinanceiro = dados.responsavelFinanceiro();
        this.outroResponsavel = dados.outroResponsavel();
        this.observacoesGerais = dados.observacoesGerais();
        this.diagnosticoPrincipal = dados.diagnosticoPrincipal();
        this.historicoMedico = dados.historicoMedico();
        this.queixaNeuropsicologica = dados.queixaNeuropsicologica();
        this.expectativasTratamento = dados.expectativasTratamento();
        this.unidadeAtendimento = dados.unidadeAtendimento();
        this.endereco = new Endereco();
    }

}
