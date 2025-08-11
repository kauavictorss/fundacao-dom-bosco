package dom.bosco.api.infra.security;

import dom.bosco.api.usuario.model.Usuario;
import dom.bosco.api.usuario.RepoUsuario;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final RepoUsuario repoUsuario;
    private final PasswordEncoder passwordEncoder;

    // Redireciona a raiz apenas se não estiver logado
    @GetMapping("/")
    public String redirectToAppropriateePage(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado != null) {
            // Se já está logado, vai para o sistema principal
            return "redirect:/index.html";
        } else {
            // Se não está logado, vai para login
            return "redirect:/login.html";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        try {
            // Log do logout
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            if (usuario != null) {
                log.info("Logout realizado para usuário: {}", usuario.getNome());
            }

            // Remove dados da sessão
            session.removeAttribute("usuarioLogado");
            session.removeAttribute("nomeUsuario");
            session.removeAttribute("cargoUsuario");
            session.removeAttribute("idUsuario");
            session.invalidate();

            log.info("Logout realizado com sucesso!");
        } catch (Exception e) {
            log.error("Erro durante logout", e);
        }

        return "redirect:/login.html";
    }
}
