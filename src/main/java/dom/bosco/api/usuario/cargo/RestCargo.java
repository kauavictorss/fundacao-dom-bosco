package dom.bosco.api.usuario.cargo;

import dom.bosco.api.usuario.cargo.dto.DtoCadastrarCargo;
import dom.bosco.api.usuario.cargo.dto.DtoVisualizarCargo;
import jakarta.persistence.EntityNotFoundException;
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

@RestController
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/cargo")
public class RestCargo {
    private final RepoCargo repositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoVisualizarCargo> cadastrar(@RequestBody @Valid DtoCadastrarCargo dados, UriComponentsBuilder uriBuilder) {
        log.info("Cadastrando Cargo: {}", dados.nome());

        var cargo = new Cargo(dados);
        repositorio.save(cargo);

        var uri = uriBuilder.path("/cargo/{id}").buildAndExpand(cargo.getId()).toUri();

        log.info("Cargo cadastrado com sucesso!");
        return ResponseEntity.created(uri).body(new DtoVisualizarCargo(cargo));
    }

    @GetMapping
    public ResponseEntity<Page<DtoVisualizarCargo>> listar(@PageableDefault(size = 100, sort = {"nome"}) Pageable paginacao) {
        var page = repositorio.findAll(paginacao).map(DtoVisualizarCargo::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoVisualizarCargo> buscarPorId(@PathVariable Long id) {
        var cargo = repositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cargo não encontrado com ID: " + id));
        return ResponseEntity.ok(new DtoVisualizarCargo(cargo));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<DtoVisualizarCargo> atualizar(@PathVariable Long id, @RequestBody @Valid DtoCadastrarCargo dados) {
        log.info("Atualizando Cargo com ID: {}", id);
        var cargo = repositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cargo não encontrado com ID: " + id));
        
        cargo.setNome(dados.nome());
        //cargo.setPermissoes(dados.permissoes());
        
        repositorio.save(cargo);
        log.info("Cargo atualizado com sucesso!");
        return ResponseEntity.ok(new DtoVisualizarCargo(cargo));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("Deletando Cargo com ID: {}", id);
        if (!repositorio.existsById(id)) {
            throw new EntityNotFoundException("Cargo não encontrado com ID: " + id);
        }
        log.info("Deletando Cargo {}", id);
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
