package dom.bosco.api.usuario.dto;

public record DtoAtualizarUsuario(Long id, String usuario, String senha, String nome, String cpf, String email, String celular, String endereco, Long cargoId) {

}
