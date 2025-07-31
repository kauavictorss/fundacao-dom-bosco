package dombosco.api.funcionario.dto;

public record DtoListaFuncionario(
        Long id, String nomeCompleto, String cpf, String email, String celular, String cargo) {
}
