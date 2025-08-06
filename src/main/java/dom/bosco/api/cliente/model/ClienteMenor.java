package dom.bosco.api.cliente.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "clientes_menores")
public class ClienteMenor {

    @Id
    private Long id; // Mesmo ID do cliente principal

    @Column(name = "nome_escola")
    private String nomeEscola;

    @Column(name = "tipo_escola")
    private String tipoEscola;

    @Column(name = "ano_escolar")
    private String anoEscolar;

    @Column(name = "nome_pai")
    private String nomePai;

    @Column(name = "idade_pai")
    private Integer idadePai;

    @Column(name = "profissao_pai")
    private String profissaoPai;

    @Column(name = "telefone_pai")
    private String telefonePai;

    @Column(name = "nome_mae")
    private String nomeMae;

    @Column(name = "idade_mae")
    private Integer idadeMae;

    @Column(name = "profissao_mae")
    private String profissaoMae;

    @Column(name = "telefone_mae")
    private String telefoneMae;

    @Column(name = "responsavel_financeiro")
    private String responsavelFinanceiro;

    @Column(name = "outro_responsavel", columnDefinition = "TEXT")
    private String outroResponsavel;

    // Relacionamento bidirecional com Cliente
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Cliente cliente;

    public ClienteMenor(Long id) {
        this.id = id;
    }
}
