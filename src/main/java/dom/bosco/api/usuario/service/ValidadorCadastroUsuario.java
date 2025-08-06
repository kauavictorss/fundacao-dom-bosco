package dom.bosco.api.usuario.service;

import dom.bosco.api.usuario.RepoUsuario;
import dom.bosco.api.usuario.dto.DtoCadastrarUsuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ValidadorCadastroUsuario {

    private final RepoUsuario repositorio;

    public void validarCadastro(DtoCadastrarUsuario dados) {
        if (repositorio.existsByCpf(dados.cpf()))
            throwErro("CPF já cadastrado!");
        if (repositorio.existsByEmail(dados.email()))
            throwErro("Email pertence a outro funcionário!");
        if (repositorio.existsByCelular(dados.celular()))
            throwErro("Celular pertence a outro funcionário!");
    }

    public void throwErro(String mensagem) {
        log.error("Erro ao cadastrar! {}", mensagem);
        throw new RuntimeException(mensagem);
    }
}
