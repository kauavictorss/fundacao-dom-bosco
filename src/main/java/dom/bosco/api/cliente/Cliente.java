package dom.bosco.api.cliente;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
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

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Unidade getUnidadeAtendimento() { return unidadeAtendimento; }
    public void setUnidadeAtendimento(Unidade unidadeAtendimento) { this.unidadeAtendimento = unidadeAtendimento; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getNumeroEndereco() { return numeroEndereco; }
    public void setNumeroEndereco(String numeroEndereco) { this.numeroEndereco = numeroEndereco; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservacoesGerais() { return observacoesGerais; }
    public void setObservacoesGerais(String observacoesGerais) { this.observacoesGerais = observacoesGerais; }

    public String getDiagnosticoPrincipal() { return diagnosticoPrincipal; }
    public void setDiagnosticoPrincipal(String diagnosticoPrincipal) { this.diagnosticoPrincipal = diagnosticoPrincipal; }

    public String getHistoricoMedico() { return historicoMedico; }
    public void setHistoricoMedico(String historicoMedico) { this.historicoMedico = historicoMedico; }

    public String getQueixaNeuropsicologica() { return queixaNeuropsicologica; }
    public void setQueixaNeuropsicologica(String queixaNeuropsicologica) { this.queixaNeuropsicologica = queixaNeuropsicologica; }

    public String getExpectativasTratamento() { return expectativasTratamento; }
    public void setExpectativasTratamento(String expectativasTratamento) { this.expectativasTratamento = expectativasTratamento; }

    public TipoCliente getTipoCliente() { return tipoCliente; }
    public void setTipoCliente(TipoCliente tipoCliente) { this.tipoCliente = tipoCliente; }

    public Long getCriadoPorUsuarioId() { return criadoPorUsuarioId; }
    public void setCriadoPorUsuarioId(Long criadoPorUsuarioId) { this.criadoPorUsuarioId = criadoPorUsuarioId; }

    public List<String> getChangeHistory() { return changeHistory; }
    public void setChangeHistory(List<String> changeHistory) { this.changeHistory = changeHistory; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
