package dom.bosco.api.usuario.controller;

import dom.bosco.api.usuario.RepoUsuario;
import dom.bosco.api.usuario.dto.DtoAutenticacao;
import dom.bosco.api.usuario.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/login")
public class RestAutenticacaoUsuario {

    private final RepoUsuario repository;

    @PostMapping
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid DtoAutenticacao dados, HttpServletRequest request) {
        Usuario usuario = repository.findUsuarioByUsuario(dados.usuario()).orElse(null);

        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        // COMPARAÇÃO SIMPLES SEM CRIPTOGRAFIA
        if (!dados.senha().equals(usuario.getSenha())) {
            return ResponseEntity.badRequest().body("Senha incorreta");
        }

        if (!usuario.getAtivo()) {
            return ResponseEntity.badRequest().body("Usuário inativo");
        }

        // Criar sessão para o usuário logado
        HttpSession session = request.getSession();
        session.setAttribute("usuarioLogado", usuario);
        session.setAttribute("nomeUsuario", usuario.getNome());
        session.setAttribute("cargoUsuario", usuario.getCargo());
        session.setAttribute("idUsuario", usuario.getId());

        return ResponseEntity.ok().body("Login realizado com sucesso! Usuário: " + usuario.getNome());
    }
}
