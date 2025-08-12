package dom.bosco.api.cliente.menor;

import dom.bosco.api.cliente.menor.dto.DtoCadastroClienteMnr;
import dom.bosco.api.cliente.menor.dto.DtoDetalharClienteMnr;
import dom.bosco.api.usuario.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("/cliente-menor")
public class RestClienteMnr {

    private final RepoClienteMnr repositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoDetalharClienteMnr> cadastrar(@RequestBody @Valid DtoCadastroClienteMnr dados, UriComponentsBuilder uriBuilder, HttpServletRequest request) {
        log.info("Cadastrando Cliente Adulto: {}", dados.nome());

        try {
            // Capturar usuario logado da sessão
            HttpSession session = request.getSession();
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

            if (usuarioLogado == null) {
                log.warn("Tentativa de cadastro sem usuário logado");
                return ResponseEntity.status(401).body(null);
            }

            // Criar cliente e vincular ao usuário logado
            var clienteMnr = new ClienteMnr(dados);
            clienteMnr.setCriadoPorUsuarioId(usuarioLogado.getId());

            repositorio.save(clienteMnr);

            var uri = uriBuilder.path("/cliente-menor/{id}").buildAndExpand(clienteMnr.getId()).toUri();

            log.info("Cliente adulto cadastrado com sucesso! ID: {} - Nome: {} - Criado por: {}", clienteMnr.getId(), clienteMnr.getNome(), usuarioLogado.getNome());
            return ResponseEntity.created(uri).body(new DtoDetalharClienteMnr(clienteMnr));

        } catch (Exception e) {
            log.error("Erro ao cadastrar cliente adulto: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoDetalharClienteMnr> detalhar(@PathVariable Long id) {
        var cliente = repositorio.findById(id);

        return cliente.map(clienteMnr -> ResponseEntity.ok(new DtoDetalharClienteMnr(clienteMnr))).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
