package dom.bosco.api.usuario.model;

import dom.bosco.api.usuario.dto.DtoCadastrarUsuario;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "usuario", unique = true)
    private String usuario;

    @JsonIgnore
    @Column(name = "senha")
    private String senha;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "email")
    private String email;

    @Column(name = "celular")
    private String celular;

    @Column(name = "endereco")
    private String endereco;

    @Valid
    @Column(name = "cargo")
    @Enumerated(EnumType.STRING)
    private Cargo cargo;

    // Metadados
    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    public Usuario(@Valid DtoCadastrarUsuario dados) {
        this.ativo = true;
        this.usuario = dados.usuario();
        this.senha = dados.senha();
        this.nome = dados.nome();
        this.cpf = dados.cpf();
        this.email = dados.email();
        this.celular = dados.celular();
        this.cargo = dados.cargo();
        this.endereco = dados.endereco();
    }

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
