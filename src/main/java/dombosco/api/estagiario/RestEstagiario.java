package dombosco.api.estagiario;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/estagiario")
public class RestEstagiario {

    private final RepoEstagiario repositorio;

    @PostMapping("/cadastrar")
    public void cadastrarEstagiario(@RequestBody DtoCadEstagiario dados) {
        repositorio.save(new Estagiario(dados));
    }
}
