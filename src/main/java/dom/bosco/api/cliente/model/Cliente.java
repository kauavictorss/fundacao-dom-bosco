package dom.bosco.api.cliente.model;

import dom.bosco.api.cliente.dto.DtoAtualizarCliente;
import dom.bosco.api.cliente.dto.DtoCadastrarCliente;
import dom.bosco.api.endereco.Endereco;
import jakarta.persistence.*;
import jakarta.validation.Valid;
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

    @Embedded
    private Endereco endereco;

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

    // Relacionamentos com as tabelas específicas
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    private ClienteAdulto clienteAdulto;

    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    private ClienteMenor clienteMenor;

    // Histórico de alterações (usando @ElementCollection para compatibilidade com o DDL)
    @ElementCollection
    @CollectionTable(name = "cliente_historico", joinColumns = @JoinColumn(name = "cliente_id"))
    @Column(name = "alteracao", columnDefinition = "TEXT")
    private List<String> changeHistory;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public Cliente(@Valid DtoCadastrarCliente dados) {
        this.ativo = true;
        this.nome = dados.nome();
        this.dataNascimento = dados.dataNascimento();
        this.genero = dados.genero();
        this.unidadeAtendimento = dados.unidadeAtendimento();
        this.endereco = new Endereco(dados.endereco());
        this.observacoesGerais = dados.observacoesGerais();
        this.diagnosticoPrincipal = dados.diagnosticoPrincipal();
        this.historicoMedico = dados.historicoMedico();
        this.queixaNeuropsicologica = dados.queixaNeuropsicologica();
        this.expectativasTratamento = dados.expectativasTratamento();
        this.tipoCliente = dados.tipoCliente();
    }

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

    public void atualizarInformacoesCliente(@Valid DtoAtualizarCliente dados) {
        // Atualizar campos comuns do cliente
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.dataNascimento() != null) {
            this.dataNascimento = dados.dataNascimento();
        }
        if (dados.genero() != null) {
            this.genero = dados.genero();
        }
        if (dados.endereco() != null) {
            this.endereco = new Endereco(dados.endereco());
        }
        if (dados.observacoesGerais() != null) {
            this.observacoesGerais = dados.observacoesGerais();
        }
        if (dados.diagnosticoPrincipal() != null) {
            this.diagnosticoPrincipal = dados.diagnosticoPrincipal();
        }
        if (dados.historicoMedico() != null) {
            this.historicoMedico = dados.historicoMedico();
        }
        if (dados.queixaNeuropsicologica() != null) {
            this.queixaNeuropsicologica = dados.queixaNeuropsicologica();
        }
        if (dados.expectativasTratamento() != null) {
            this.expectativasTratamento = dados.expectativasTratamento();
        }

        // Atualizar dados específicos baseado no tipo do cliente
        if (this.tipoCliente == TipoCliente.ADULT) {
            atualizarDadosClienteAdulto(dados);
        } else if (this.tipoCliente == TipoCliente.MINOR) {
            atualizarDadosClienteMenor(dados);
        }
    }

    private void atualizarDadosClienteAdulto(@Valid DtoAtualizarCliente dados) {
        // Criar ClienteAdulto se não existir
        if (this.clienteAdulto == null) {
            this.clienteAdulto = new ClienteAdulto(this.id);
            this.clienteAdulto.setCliente(this);
        }

        // Atualizar campos específicos do cliente adulto
        if (dados.cpf() != null) {
            this.clienteAdulto.setCpf(dados.cpf());
        }
        if (dados.rg() != null) {
            this.clienteAdulto.setRg(dados.rg());
        }
        if (dados.naturalidade() != null) {
            this.clienteAdulto.setNaturalidade(dados.naturalidade());
        }
        if (dados.estadoCivil() != null) {
            this.clienteAdulto.setEstadoCivil(dados.estadoCivil());
        }
        if (dados.escolaridade() != null) {
            this.clienteAdulto.setEscolaridade(dados.escolaridade());
        }
        if (dados.profissao() != null) {
            this.clienteAdulto.setProfissao(dados.profissao());
        }
        if (dados.email() != null) {
            this.clienteAdulto.setEmail(dados.email());
        }
        if (dados.telefone() != null) {
            this.clienteAdulto.setTelefone(dados.telefone());
        }
        if (dados.contatoEmergencia() != null) {
            this.clienteAdulto.setContatoEmergencia(dados.contatoEmergencia());
        }
    }

    private void atualizarDadosClienteMenor(DtoAtualizarCliente dados) {
        // Criar ClienteMenor se não existir
        if (this.clienteMenor == null) {
            this.clienteMenor = new ClienteMenor(this.id);
            this.clienteMenor.setCliente(this);
        }

        // Atualizar campos específicos do cliente menor
        if (dados.nomeEscola() != null) {
            this.clienteMenor.setNomeEscola(dados.nomeEscola());
        }
        if (dados.tipoEscola() != null) {
            this.clienteMenor.setTipoEscola(dados.tipoEscola());
        }
        if (dados.anoEscolar() != null) {
            this.clienteMenor.setAnoEscolar(dados.anoEscolar());
        }
        if (dados.nomePai() != null) {
            this.clienteMenor.setNomePai(dados.nomePai());
        }
        if (dados.idadePai() != null) {
            this.clienteMenor.setIdadePai(dados.idadePai());
        }
        if (dados.profissaoPai() != null) {
            this.clienteMenor.setProfissaoPai(dados.profissaoPai());
        }
        if (dados.telefonePai() != null) {
            this.clienteMenor.setTelefonePai(dados.telefonePai());
        }
        if (dados.nomeMae() != null) {
            this.clienteMenor.setNomeMae(dados.nomeMae());
        }
        if (dados.idadeMae() != null) {
            this.clienteMenor.setIdadeMae(dados.idadeMae());
        }
        if (dados.profissaoMae() != null) {
            this.clienteMenor.setProfissaoMae(dados.profissaoMae());
        }
        if (dados.telefoneMae() != null) {
            this.clienteMenor.setTelefoneMae(dados.telefoneMae());
        }
        if (dados.responsavelFinanceiro() != null) {
            this.clienteMenor.setResponsavelFinanceiro(dados.responsavelFinanceiro());
        }
        if (dados.outroResponsavel() != null) {
            this.clienteMenor.setOutroResponsavel(dados.outroResponsavel());
        }
    }

    public void excluir() {
        this.ativo = false;
    }

    public void reativar() {
        this.ativo = true;
    }
}
