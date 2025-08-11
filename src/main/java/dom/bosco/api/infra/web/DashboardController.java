package dom.bosco.api.infra.web;

import dom.bosco.api.usuario.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private boolean isUserLoggedIn(HttpSession session) {
        return session.getAttribute("usuarioLogado") == null;
    }

    private void addUserDataToModel(Model model, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        if (usuario != null) {
            model.addAttribute("usuario", usuario);
            model.addAttribute("nomeUsuario", usuario.getNome());
            model.addAttribute("cargoUsuario", usuario.getCargo());
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "dashboard");
        model.addAttribute("contentTemplate", "dashboard-content");

        return "dashboard";
    }

    @GetMapping("/agenda")
    public String agenda(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "agenda");
        model.addAttribute("contentTemplate", "agenda-dia");

        return "dashboard";
    }

    @GetMapping("/financeiro")
    public String financeiro(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "financeiro");
        model.addAttribute("contentTemplate", "financeiro");

        return "dashboard";
    }

    @GetMapping("/relatorios")
    public String relatorios(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "relatorios");
        model.addAttribute("contentTemplate", "relatorios");

        return "dashboard";
    }

    @GetMapping("/estoque")
    public String estoque(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "estoque");
        model.addAttribute("contentTemplate", "estoque");

        return "dashboard";
    }

    @GetMapping("/funcionarios")
    public String funcionarios(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "funcionarios");
        model.addAttribute("contentTemplate", "funcionarios");

        return "dashboard";
    }

    @GetMapping("/documentos")
    public String documentos(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "documentos");
        model.addAttribute("contentTemplate", "documentos");

        return "dashboard";
    }
}
