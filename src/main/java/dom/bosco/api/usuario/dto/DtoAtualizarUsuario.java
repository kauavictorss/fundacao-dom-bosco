package dom.bosco.api.usuario.dto;

import dom.bosco.api.usuario.model.Cargo;

public record DtoAtualizarUsuario(Long id, String usuario, String senha, String nome, String cpf, String email, String celular, String endereco, Cargo cargo) {

}
