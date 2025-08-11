package dom.bosco.api.agendamento;

import dom.bosco.api.agendamento.Agendamento;
import dom.bosco.api.agendamento.StatusAgendamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RepoAgendamento extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByClienteAdultoId(Long clienteAdultoId);

    List<Agendamento> findByClienteMenorId(Long clienteMenorId);

    @Query("""
            SELECT a FROM Agendamento a
            WHERE a.clienteAdultoId = :clienteId
            OR a.clienteMenorId = :clienteId
            """)
    List<Agendamento> findByAnyClienteId(@Param("clienteId") Long clienteId);


    List<Agendamento> findByProfissionalId(Long profissionalId);


    List<Agendamento> findByData(LocalDate data);


    List<Agendamento> findByStatus(StatusAgendamento status);

    List<Agendamento> findByProfissionalIdAndData(Long profissionalId, LocalDate data);


    List<Agendamento> findByUnidadeAtendimento(String unidade);

    @Query("""
            SELECT a FROM Agendamento a 
            WHERE a.data BETWEEN :dataInicio AND :dataFim
            ORDER BY a.data, a.horaInicio
            """)

    List<Agendamento> findByDataBetween(
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    @Query("""
            SELECT a FROM Agendamento a 
            WHERE a.clienteAdultoId IS NOT NULL
            ORDER BY a.data DESC, a.horaInicio
            """)

    Page<Agendamento> findClientesAdultos(Pageable pageable);

    @Query("""
            SELECT a FROM Agendamento a 
            WHERE a.clienteMenorId IS NOT NULL
            ORDER BY a.data DESC, a.horaInicio
            """)

    Page<Agendamento> findClientesMenores(Pageable pageable);
}
