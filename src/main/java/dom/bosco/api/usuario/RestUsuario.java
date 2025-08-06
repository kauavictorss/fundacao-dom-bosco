package dom.bosco.api.usuario;

import dom.bosco.api.usuario.dto.DtoAtualizarUsuario;
import dom.bosco.api.usuario.dto.DtoCadastrarUsuario;
import dom.bosco.api.usuario.dto.DtoDetalhamentoUsuario;
import dom.bosco.api.usuario.dto.DtoListarUsuario;
import dom.bosco.api.usuario.model.Usuario;
import dom.bosco.api.usuario.service.ValidadorCadastroUsuario;
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

import java.util.List;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("usuario")
public class RestUsuario {

    private final RepoUsuario repositorio;
    private final ValidadorCadastroUsuario validador;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoDetalhamentoUsuario> cadastrar(@RequestBody @Valid DtoCadastrarUsuario dados, UriComponentsBuilder uriBuilder) {
        log.info("Cadastrando Usuário: {}", dados);

        validador.validarCadastro(dados);
        var usuario = new Usuario(dados);
        repositorio.save(usuario);

        var uri = uriBuilder.path("/usuario/{id}").buildAndExpand(usuario.getId()).toUri();

        log.info("Usuário cadastrado com sucesso!");
        return ResponseEntity.created(uri).body(new DtoDetalhamentoUsuario(usuario));
    }

    @GetMapping("/listar/ativos")
    public Page<DtoListarUsuario> listagemDeUsuariosAtivos(@PageableDefault(sort = "nome") Pageable paginacao) {
        return repositorio.findAllByAtivo(paginacao).map(DtoListarUsuario::new);
    }

    @GetMapping("/listar/inativos")
    public Page<DtoListarUsuario> listaDeUsuariosInativos(@PageableDefault(sort = "nome") Pageable paginacao) {
        return repositorio.findAllByInativo(paginacao).map(DtoListarUsuario::new);
    }

    @GetMapping("/buscar/{id}")
    public List<DtoListarUsuario> buscarUsuarioPorId(@PathVariable Long id) {
        return repositorio.findById(id).stream().map(DtoListarUsuario::new).toList();
    }

    @GetMapping("/buscar/cpf/{cpf}")
    public List<DtoListarUsuario> buscarUsuarioPorCpf(@PathVariable String cpf) {
        return repositorio.findByCpf(cpf).stream().map(DtoListarUsuario::new).toList();
    }

    @PutMapping("/atualizar")
    @Transactional
    public ResponseEntity<DtoDetalhamentoUsuario> atualizarUsuario(@RequestBody @Valid DtoAtualizarUsuario dados) {
        var usuario = repositorio.getReferenceById(dados.id());
        usuario.atualizarDados(dados);
        return ResponseEntity.ok(new DtoDetalhamentoUsuario(usuario));
    }

    @DeleteMapping("/remover/{id}")
    @Transactional
    public ResponseEntity<Void> removerUsuario(@PathVariable Long id) {
        var usuario = repositorio.getReferenceById(id);
        usuario.excuir();
        log.info("Removendo usuário(a) {} com id: {}",usuario.getNome(), id);
        log.info("Usuário removido com sucesso!");
        return ResponseEntity.noContent().build();
    }
}
