package dom.bosco.api.cliente.controller;

import dom.bosco.api.cliente.RepoCliente;
import dom.bosco.api.cliente.RepoVinculoProfissionalCliente;
import dom.bosco.api.cliente.dto.DtoDetalhamentoCliente;
import dom.bosco.api.cliente.dto.DtoListarCliente;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("cliente")
public class RestCliente {

    private final RepoCliente repositorio;
    private final RepoVinculoProfissionalCliente repoVinculo;

    @GetMapping("/listar/ativos")
    public Page<DtoListarCliente> listagemDeClientesAtivos(@PageableDefault(sort = "nome") Pageable paginacao) {
        log.info("Listando clientes ativos");

        var clientesPage = repositorio.findAllByAtivo(paginacao);

        return clientesPage.map(cliente -> {
            var profissionaisVinculados = repoVinculo.findProfissionaisVinculadosAoCliente(cliente.getId())
                    .stream()
                    .map(dom.bosco.api.cliente.dto.DtoProfissionalVinculado::new)
                    .toList();

            return new DtoListarCliente(cliente, profissionaisVinculados);
        });
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoDetalhamentoCliente> detalhar(@PathVariable Long id) {
        var medico = repositorio.getReferenceById(id);
        return ResponseEntity.ok(new DtoDetalhamentoCliente(medico));
    }

    @GetMapping("/buscar")
    public Page<DtoListarCliente> buscarPorNome(@RequestParam String nome, @PageableDefault(sort = "nome") Pageable paginacao) {
        log.info("Buscando clientes por nome: {}", nome);

        var clientesPage = repositorio.findByNomeContainingIgnoreCase(nome, paginacao);

        return clientesPage.map(cliente -> {
            var profissionaisVinculados = repoVinculo.findProfissionaisVinculadosAoCliente(cliente.getId())
                    .stream()
                    .map(dom.bosco.api.cliente.dto.DtoProfissionalVinculado::new)
                    .toList();

            return new DtoListarCliente(cliente, profissionaisVinculados);
        });
    }
}
