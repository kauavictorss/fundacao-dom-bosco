package dom.bosco.api.usuario.model;

import dom.bosco.api.usuario.dto.DtoAtualizarUsuario;
import dom.bosco.api.usuario.dto.DtoCadastrarUsuario;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "usuario")
public class Usuario implements UserDetails {

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
    @Column(name = "criado_em", updatable = false)
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

    public void atualizarDados(@Valid DtoAtualizarUsuario dados) {
        if (dados.usuario() != null) {
            this.usuario = dados.usuario();
        }
        if (dados.senha() != null) {
            this.senha = dados.senha();
        }
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.cpf() != null) {
            this.cpf = dados.cpf();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
        if (dados.celular() != null) {
            this.celular = dados.celular();
        }
        if (dados.cargo() != null) {
            this.cargo = dados.cargo();
        }
        if (dados.endereco() != null) {
            this.endereco = dados.endereco();
        }
    }

    public void excuir() {
        this.ativo = false;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna a role/cargo do usuário para o Spring Security
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.usuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // A conta não expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // A conta não é bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // As credenciais não expiram
    }

    @Override
    public boolean isEnabled() {
        return this.ativo; // Usa o campo 'ativo' para determinar se o usuário está habilitado
    }
}
