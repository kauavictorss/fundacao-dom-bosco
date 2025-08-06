package dom.bosco.api.cliente;

import dom.bosco.api.cliente.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepoCliente extends JpaRepository<Cliente, Long> {

    @Query("""
            select c
            from Cliente c
            where c.ativo = true
            """)
    Page<Cliente> findAllByAtivo(Pageable paginacao);

    @Query("""
            select c
            from Cliente c
            where c.ativo = false
            """)
    Page<Cliente> findAllByInativo(Pageable paginacao);

    @Query("""
            select c
            from Cliente c
            where c.nome LIKE %:nome%
            and c.ativo = true
            """)
    Page<Cliente> findByNomeContainingIgnoreCase(@Param("nome") String nome, Pageable paginacao);

    @Query("""
            select c
            from Cliente c
            where c.tipoCliente = :tipo
            and c.ativo = true
            """)
    Page<Cliente> findByTipoCliente(@Param("tipo") String tipo, Pageable paginacao);

    @Query("""
            select c
            from Cliente c
            where c.unidadeAtendimento = :unidade
            and c.ativo = true
            """)
    Page<Cliente> findByUnidadeAtendimento(@Param("unidade") String unidade, Pageable paginacao);
}
