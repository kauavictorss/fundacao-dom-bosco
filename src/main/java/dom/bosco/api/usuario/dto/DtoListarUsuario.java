package dom.bosco.api.usuario.dto;

import dom.bosco.api.usuario.model.Usuario;

public record DtoListarUsuario(Long id, String nome, String email, String celular, Long cargoId) {

    public DtoListarUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getCelular(), usuario.getCargo().getId());
    }
}
