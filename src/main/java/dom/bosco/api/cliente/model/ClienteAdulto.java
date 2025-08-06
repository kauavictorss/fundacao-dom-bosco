package dom.bosco.api.cliente.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "clientes_adultos")
public class ClienteAdulto {

    @Id
    private Long id; // Mesmo ID do cliente principal

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

    // Relacionamento bidirecional com Cliente
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Cliente cliente;

    public ClienteAdulto(Long id) {
        this.id = id;
    }
}
