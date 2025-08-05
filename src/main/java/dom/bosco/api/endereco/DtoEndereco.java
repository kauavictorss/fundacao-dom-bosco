package dom.bosco.api.endereco;

public record DtoEndereco(
        String cep, String logradouro, String numero, String complemento, String bairro, String cidade, String estado) {
}
