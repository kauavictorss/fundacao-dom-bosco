package dom.bosco.api.usuario;

import dom.bosco.api.usuario.dto.DtoDetalhamentoUsuario;
import dom.bosco.api.usuario.dto.DtoListarUsuario;
import dom.bosco.api.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class RestAuth {

    private final RepoUsuario repoUsuario;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        try {
            // Buscar usuário pelo nome
            Usuario usuario = repoUsuario.findByNome(username);

            if (usuario != null && usuario.getSenha().equals(password)) {
                response.put("success", true);
                response.put("message", "Login realizado com sucesso");
                response.put("usuario", new DtoDetalhamentoUsuario(usuario));
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Credenciais inválidas");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro interno do servidor");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout realizado com sucesso");
        return ResponseEntity.ok(response);
    }
}
