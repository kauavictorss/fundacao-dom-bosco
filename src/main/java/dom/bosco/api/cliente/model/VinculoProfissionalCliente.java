package dom.bosco.api.cliente.model;

import dom.bosco.api.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vinculo_profissional_cliente")
public class VinculoProfissionalCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profissional_id")
    private Usuario profissional;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean ativo = true;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    public VinculoProfissionalCliente(Cliente cliente, Usuario profissional) {
        this.cliente = cliente;
        this.profissional = profissional;
        this.ativo = true;
        this.criadoEm = LocalDateTime.now();
    }

    public void desativar() {
        this.ativo = false;
    }

    public void reativar() {
        this.ativo = true;
    }
}
