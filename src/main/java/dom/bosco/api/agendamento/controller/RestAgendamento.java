package dom.bosco.api.agendamento.controller;

import dom.bosco.api.agendamento.RepoAgendamento;
import dom.bosco.api.agendamento.Agendamento;
import dom.bosco.api.agendamento.dto.*;
import dom.bosco.api.cliente.adulto.RepoClienteAdt;
import dom.bosco.api.cliente.menor.RepoClienteMnr;
import dom.bosco.api.usuario.RepoUsuario;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("agendamento")
public class RestAgendamento {

    private final RepoAgendamento repositorio;
    private final RepoClienteAdt repoClienteAdulto;
    private final RepoClienteMnr repoClienteMenor;
    private final RepoUsuario repoUsuario;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoDetalhamentoAgendamento> cadastrarAgendamento(@RequestBody @Valid DtoCadastrarAgendamento dados, UriComponentsBuilder uriBuilder) {

        log.info("Cadastrando agendamento: {}", dados);

        if (dados.isClienteAdulto()) {
            if (!repoClienteAdulto.existsById(dados.clienteAdultoId())) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            if (!repoClienteMenor.existsById(dados.clienteMenorId())) {
                return ResponseEntity.badRequest().build();
            }
        }

        if (!repoUsuario.existsById(dados.profissionalId())) {
            return ResponseEntity.badRequest().build();
        }

        var agendamento = getAgendamento(dados);

        repositorio.save(agendamento);

        // Buscar nomes para retorno
        String nomeCliente = buscarNomeCliente(agendamento);
        String nomeProfissional = repoUsuario.getReferenceById(dados.profissionalId()).getNome();

        var uri = uriBuilder.path("/agendamento/{id}").buildAndExpand(agendamento.getId()).toUri();

        log.info("Agendamento cadastrado com sucesso!");
        return ResponseEntity.created(uri).body(new DtoDetalhamentoAgendamento(agendamento, nomeCliente, nomeProfissional));
    }

    // Método auxiliar para criar agendamento baseado nos dados do DTO
    private static Agendamento getAgendamento(DtoCadastrarAgendamento dados) {
        var agendamento = new Agendamento();
        agendamento.setProfissionalId(dados.profissionalId());
        agendamento.setData(dados.data());
        agendamento.setHoraInicio(dados.horaInicio());
        agendamento.setHoraFim(dados.horaFim());
        agendamento.setServico(dados.servico());
        agendamento.setUnidadeAtendimento(dados.unidadeAtendimento());
        agendamento.setObservacoes(dados.observacoes());

        // Definir cliente baseado no tipo
        if (dados.isClienteAdulto()) {
            agendamento.setClienteAdulto(dados.clienteAdultoId());
        } else {
            agendamento.setClienteMenor(dados.clienteMenorId());
        }
        return agendamento;
    }

    @GetMapping
    public Page<DtoListarAgendamento> listarAgendamentos(@PageableDefault(sort = "data") Pageable paginacao) {
        log.info("Listando agendamentos");

        return repositorio.findAll(paginacao).map(agendamento -> {
            String nomeCliente = buscarNomeCliente(agendamento);
            String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();
            return new DtoListarAgendamento(agendamento, nomeCliente, nomeProfissional);
        });
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoDetalhamentoAgendamento> detalharAgendamento(@PathVariable Long id) {
        log.info("Detalhando agendamento ID: {}", id);

        var agendamento = repositorio.getReferenceById(id);
        String nomeCliente = buscarNomeCliente(agendamento);
        String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();

        return ResponseEntity.ok(new DtoDetalhamentoAgendamento(agendamento, nomeCliente, nomeProfissional));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<DtoDetalhamentoAgendamento> atualizarAgendamento(@PathVariable Long id, @RequestBody @Valid DtoAtualizarAgendamento dados) {

        log.info("Atualizando agendamento ID: {} com dados: {}", id, dados);

        var agendamento = repositorio.getReferenceById(id);
        atualizarDadosAgendamento(agendamento, dados);

        String nomeCliente = buscarNomeCliente(agendamento);
        String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();

        log.info("Agendamento atualizado com sucesso!");
        return ResponseEntity.ok(new DtoDetalhamentoAgendamento(agendamento, nomeCliente, nomeProfissional));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<DtoListarAgendamento>> listarAgendamentosPorCliente(@PathVariable Long clienteId) {
        log.info("Listando agendamentos do cliente ID: {}", clienteId);

        var agendamentos = repositorio.findByAnyClienteId(clienteId);
        var dtos = agendamentos.stream().map(agendamento -> {
            String nomeCliente = buscarNomeCliente(agendamento);
            String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();
            return new DtoListarAgendamento(agendamento, nomeCliente, nomeProfissional);
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<DtoListarAgendamento>> listarAgendamentosPorProfissional(@PathVariable Long profissionalId) {
        log.info("Listando agendamentos do profissional ID: {}", profissionalId);

        var agendamentos = repositorio.findByProfissionalId(profissionalId);
        var dtos = agendamentos.stream().map(agendamento -> {
            String nomeCliente = buscarNomeCliente(agendamento);
            String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();
            return new DtoListarAgendamento(agendamento, nomeCliente, nomeProfissional);
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/data/{data}")
    public ResponseEntity<List<DtoListarAgendamento>> listarAgendamentosPorData(@PathVariable LocalDate data) {
        log.info("Listando agendamentos da data: {}", data);

        var agendamentos = repositorio.findByData(data);
        var dtos = agendamentos.stream().map(agendamento -> {
            String nomeCliente = buscarNomeCliente(agendamento);
            String nomeProfissional = repoUsuario.getReferenceById(agendamento.getProfissionalId()).getNome();
            return new DtoListarAgendamento(agendamento, nomeCliente, nomeProfissional);
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    // Metodo auxiliar para buscar nome do cliente baseado no tipo
    private String buscarNomeCliente(Agendamento agendamento) {
        if (agendamento.isClienteAdulto()) {
            return repoClienteAdulto.getReferenceById(agendamento.getClienteAdultoId()).getClass().getName();
        } else {
            return repoClienteMenor.getReferenceById(agendamento.getClienteMenorId()).getClass().getName();
        }
    }

    // Metodo auxiliar para atualizar dados do agendamento
    private void atualizarDadosAgendamento(Agendamento agendamento, DtoAtualizarAgendamento dados) {
        if (dados.data() != null) {
            agendamento.setData(dados.data());
        }
        if (dados.horaInicio() != null) {
            agendamento.setHoraInicio(dados.horaInicio());
        }
        if (dados.horaFim() != null) {
            agendamento.setHoraFim(dados.horaFim());
        }
        if (dados.servico() != null) {
            agendamento.setServico(dados.servico());
        }
        if (dados.status() != null) {
            agendamento.setStatus(dados.status());
        }
        if (dados.unidadeAtendimento() != null) {
            agendamento.setUnidadeAtendimento(dados.unidadeAtendimento());
        }
        if (dados.observacoes() != null) {
            agendamento.setObservacoes(dados.observacoes());
        }
        if (dados.motivoCancelamento() != null) {
            agendamento.setMotivoCancelamento(dados.motivoCancelamento());
        }
    }
}
