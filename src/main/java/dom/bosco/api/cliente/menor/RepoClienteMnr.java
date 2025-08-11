package dom.bosco.api.cliente.menor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepoClienteMnr extends JpaRepository<ClienteMnr, Long> {
    Page<ClienteMnr> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
    List<ClienteMnr> findByCriadoPorUsuarioId(Long usuarioId);
}
