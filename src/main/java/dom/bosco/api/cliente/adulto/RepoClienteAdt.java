package dom.bosco.api.cliente.adulto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepoClienteAdt extends JpaRepository<ClienteAdt, Long> {
    Page<ClienteAdt> findAllByAtivoTrue(Pageable paginacao);
}
