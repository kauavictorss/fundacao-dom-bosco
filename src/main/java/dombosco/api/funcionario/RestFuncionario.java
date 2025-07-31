package dombosco.api.funcionario;

import dombosco.api.funcionario.dto.DtoCadFuncionario;
import dombosco.api.funcionario.model.Funcionario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/funcionario")
public class RestFuncionario {
    final RepoFuncionario repositorio;

    @PostMapping("/cadastrar")
    public void cadastrarFuncionario(@RequestBody DtoCadFuncionario dados) {
        repositorio.save(new Funcionario(dados));
    }

    @GetMapping("/consultar/{id}")
    public void buscarFuncionario(@PathVariable Long id) {
        repositorio.findById(id);//.stream().map(DtoCadFuncionario::new).toList();
    }

}
