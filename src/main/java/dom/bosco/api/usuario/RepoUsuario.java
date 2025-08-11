package dom.bosco.api.usuario;

import dom.bosco.api.usuario.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface RepoUsuario extends JpaRepository<Usuario, Long> {

    @Query("""
            select u
            from Usuario u
            where u.ativo = true
            """)
    Page<Usuario> findAllByAtivo(Pageable paginacao);

    @Query("""
            select u
            from Usuario u
            where u.ativo = false
            """)
    Page<Usuario> findAllByInativo(Pageable paginacao);

    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    boolean existsByCelular(String celular);

    @Query("""
            select u
            from Usuario u
            where u.cpf = :cpf
            """)
    List<Usuario> findByCpf(String cpf);

    // Para Spring Security
    UserDetails findByUsuario(String usuario);

    // Para uso geral no controller
    Optional<Usuario> findUsuarioByUsuario(String usuario);
}
