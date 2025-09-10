package dom.bosco.api.usuario.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import dom.bosco.api.usuario.cargo.Cargo;
import dom.bosco.api.usuario.model.Usuario;

public record DtoListarUsuario(Long id, String nome, String email, String celular, CargoInfo cargo) {

    public DtoListarUsuario(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getCelular(), new CargoInfo(usuario.getCargo()));
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CargoInfo(Long id, String nome /*, Map<String, String> permissoes*/ ) {
        public CargoInfo(Cargo cargo) {
            this(cargo != null ? cargo.getId() : null, 
                 cargo != null ? cargo.getNome() : null
                 /*cargo != null ? cargo.getPermissoes() : null*/ );
        }
    }
}
