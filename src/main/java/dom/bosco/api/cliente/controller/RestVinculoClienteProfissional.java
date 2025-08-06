package dom.bosco.api.cliente.controller;

import dom.bosco.api.cliente.RepoCliente;
import dom.bosco.api.cliente.RepoVinculoProfissionalCliente;
import dom.bosco.api.cliente.dto.DtoAtualizarCliente;
import dom.bosco.api.cliente.dto.DtoDetalhamentoCliente;
import dom.bosco.api.cliente.dto.DtoProfissionalVinculado;
import dom.bosco.api.cliente.dto.DtoVincularProfissional;
import dom.bosco.api.cliente.model.VinculoProfissionalCliente;
import dom.bosco.api.usuario.RepoUsuario;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("cliente/vinculo")
public class RestVinculoClienteProfissional {

    private final RepoVinculoProfissionalCliente repoVinculo;
    private final RepoCliente repoCliente;
    private final RepoUsuario repoUsuario;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoProfissionalVinculado> vincularProfissional(@RequestBody @Valid DtoVincularProfissional dados) {
        log.info("Vinculando profissional {} ao cliente {}", dados.profissionalId(), dados.clienteId());

        // Verificar se já existe vínculo ativo
        if (repoVinculo.existsByClienteIdAndProfissionalIdAndAtivoTrue(dados.clienteId(), dados.profissionalId())) {
            return ResponseEntity.badRequest().build();
        }

        var cliente = repoCliente.getReferenceById(dados.clienteId());
        var profissional = repoUsuario.getReferenceById(dados.profissionalId());

        var vinculo = new VinculoProfissionalCliente(cliente, profissional);
        repoVinculo.save(vinculo);

        log.info("Vínculo criado com sucesso!");
        return ResponseEntity.ok(new DtoProfissionalVinculado(vinculo));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<DtoProfissionalVinculado>> listarProfissionaisVinculados(@PathVariable Long clienteId) {
        log.info("Listando profissionais vinculados ao cliente {}", clienteId);

        var vinculos = repoVinculo.findProfissionaisVinculadosAoCliente(clienteId);
        var dtos = vinculos.stream()
                .map(DtoProfissionalVinculado::new)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<DtoProfissionalVinculado>> listarClientesVinculados(@PathVariable Long profissionalId) {
        log.info("Listando clientes vinculados ao profissional {}", profissionalId);

        var vinculos = repoVinculo.findClientesVinculadosAoProfissional(profissionalId);
        var dtos = vinculos.stream()
                .map(DtoProfissionalVinculado::new)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{vinculoId}")
    @Transactional
    public ResponseEntity<Void> desvincularProfissional(@PathVariable Long vinculoId) {
        log.info("Desvinculando profissional - vínculo ID: {}", vinculoId);

        var vinculo = repoVinculo.getReferenceById(vinculoId);
        vinculo.desativar();

        log.info("Vínculo desativado com sucesso!");
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reativar/{vinculoId}")
    @Transactional
    public ResponseEntity<DtoProfissionalVinculado> reativarVinculo(@PathVariable Long vinculoId) {
        log.info("Reativando vínculo ID: {}", vinculoId);

        var vinculo = repoVinculo.getReferenceById(vinculoId);
        vinculo.reativar();

        log.info("Vínculo reativado com sucesso!");
        return ResponseEntity.ok(new DtoProfissionalVinculado(vinculo));
    }

    @PutMapping("/atualizar/cliente")
    @Transactional
    public ResponseEntity<DtoDetalhamentoCliente> atualizarCliente(@RequestBody @Valid DtoAtualizarCliente dados) {
        var cliente = repoCliente.getReferenceById(dados.id());
        cliente.atualizarDadosClienteAdulto(dados);
        return ResponseEntity.ok(new DtoDetalhamentoCliente(cliente));
    }
}
