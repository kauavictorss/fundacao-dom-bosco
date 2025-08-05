package dom.bosco.api.usuario.dto;

import dom.bosco.api.usuario.model.Cargo;
import dom.bosco.api.usuario.model.Usuario;

public record DtoDetalhamentoUsuario(Long id, Boolean ativo, String usuario, String senha, String nome, String cpf, String email, String celular, String endereco, Cargo cargo) {

    public DtoDetalhamentoUsuario(Usuario funcionario) {
        this(funcionario.getId(), funcionario.getAtivo(), funcionario.getUsuario(), funcionario.getSenha(), funcionario.getCpf(), funcionario.getNome(), funcionario.getEmail(), funcionario.getCelular(), funcionario.getEndereco(), funcionario.getCargo());
    }
}
