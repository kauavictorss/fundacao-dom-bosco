package dom.bosco.api.cliente;

import dom.bosco.api.cliente.model.Cliente;
import dom.bosco.api.cliente.model.VinculoProfissionalCliente;
import dom.bosco.api.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RepoVinculoProfissionalCliente extends JpaRepository<VinculoProfissionalCliente, Long> {

    @Query("""
            select v
            from VinculoProfissionalCliente v
            where v.cliente.id = :clienteId
            and v.ativo = true
            """)
    List<VinculoProfissionalCliente> findProfissionaisVinculadosAoCliente(@Param("clienteId") Long clienteId);

    @Query("""
            select v
            from VinculoProfissionalCliente v
            where v.profissional.id = :profissionalId
            and v.ativo = true
            """)
    List<VinculoProfissionalCliente> findClientesVinculadosAoProfissional(@Param("profissionalId") Long profissionalId);

    @Query("""
            select v
            from VinculoProfissionalCliente v
            where v.cliente.id = :clienteId
            and v.profissional.id = :profissionalId
            and v.ativo = true
            """)
    Optional<VinculoProfissionalCliente> findVinculoAtivoByClienteAndProfissional(
            @Param("clienteId") Long clienteId,
            @Param("profissionalId") Long profissionalId
    );

    @Query("""
            select v
            from VinculoProfissionalCliente v
            where v.cliente.id = :clienteId
            and v.profissional.id = :profissionalId
            """)
    Optional<VinculoProfissionalCliente> findByClienteAndProfissional(
            @Param("clienteId") Long clienteId,
            @Param("profissionalId") Long profissionalId
    );

    boolean existsByClienteIdAndProfissionalIdAndAtivoTrue(Long clienteId, Long profissionalId);
}
