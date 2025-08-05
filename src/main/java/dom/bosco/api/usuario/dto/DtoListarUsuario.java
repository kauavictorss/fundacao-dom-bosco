package dom.bosco.api.usuario.dto;

import dom.bosco.api.usuario.model.Cargo;
import dom.bosco.api.usuario.model.Usuario;

public record DtoListarUsuario(Long id, String nome, String email, String celular, Cargo cargo) {

    public DtoListarUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getCelular(), usuario.getCargo());
    }
}
