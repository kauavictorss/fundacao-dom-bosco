package dom.bosco.api.usuario.cargo;

import dom.bosco.api.usuario.cargo.dto.DtoCadastrarCargo;
import dom.bosco.api.usuario.cargo.dto.DtoVisualizarCargo;
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
@RequestMapping("cargo")
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
}
