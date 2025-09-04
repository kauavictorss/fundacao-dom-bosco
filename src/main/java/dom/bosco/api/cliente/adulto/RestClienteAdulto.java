package dom.bosco.api.cliente.adulto;

import dom.bosco.api.cliente.adulto.dto.DadosListagemClienteAdt;
import dom.bosco.api.cliente.adulto.dto.DtoCadastroClienteAdt;
import dom.bosco.api.cliente.adulto.dto.DtoDetalharClienteAdt;
import dom.bosco.api.usuario.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("/cliente-adulto")
public class RestClienteAdulto {

    private final RepoClienteAdt repositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoDetalharClienteAdt> cadastrar(@RequestBody @Valid DtoCadastroClienteAdt dados, UriComponentsBuilder uriBuilder, HttpServletRequest request) {
        log.info("Cadastrando Cliente Adulto: {}", dados.nome());

        HttpSession session = request.getSession();
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado == null) {
            log.warn("Tentativa de cadastro sem usuário logado");
            return ResponseEntity.status(401).body(null);
        }

        var clienteAdt = new ClienteAdt(dados);
        clienteAdt.setCriadoPorUsuarioId(usuarioLogado.getId());

        repositorio.save(clienteAdt);

        var uri = uriBuilder.path("/cliente-adulto/{id}").buildAndExpand(clienteAdt.getId()).toUri();

        log.info("Cliente adulto cadastrado com sucesso! ID: {} - Nome: {} - Criado por: {}", clienteAdt.getId(), clienteAdt.getNome(), usuarioLogado.getNome());
        return ResponseEntity.created(uri).body(new DtoDetalharClienteAdt(clienteAdt));
    }

    @GetMapping("/listar/todos")
    public ResponseEntity<Page<DadosListagemClienteAdt>> listarTodos(@PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repositorio.findAll(paginacao).map(DadosListagemClienteAdt::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/listar/ativos")
    public ResponseEntity<Page<DadosListagemClienteAdt>> listarAtivos(@PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repositorio.findAllByAtivoTrue(paginacao).map(DadosListagemClienteAdt::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoDetalharClienteAdt> detalhar(@PathVariable Long id) {
        var cliente = repositorio.findById(id);

        return cliente.map(clienteAdt -> ResponseEntity.ok(new DtoDetalharClienteAdt(clienteAdt))).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
