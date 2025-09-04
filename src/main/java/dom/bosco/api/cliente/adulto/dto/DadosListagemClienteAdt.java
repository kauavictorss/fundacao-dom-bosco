package dom.bosco.api.cliente.adulto.dto;

import dom.bosco.api.cliente.adulto.ClienteAdt;

public record DadosListagemClienteAdt(
        Long id,
        String nome,
        String email,
        String telefone,
        String cpf
) {
    public DadosListagemClienteAdt(ClienteAdt cliente) {
        this(cliente.getId(), cliente.getNome(), cliente.getEmail(), cliente.getTelefone(), cliente.getCpf());
    }
}
