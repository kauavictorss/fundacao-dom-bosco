package dom.bosco.api.cliente.dto;

import dom.bosco.api.cliente.model.Cliente;
import dom.bosco.api.cliente.model.TipoCliente;
import dom.bosco.api.cliente.model.Unidade;

import java.time.LocalDate;
import java.util.List;

public record DtoListarCliente(
        Long id,
        Boolean ativo,
        String nome,
        TipoCliente tipoCliente,
        Unidade unidadeAtendimento,
        String diagnosticoPrincipal,
        List<DtoProfissionalVinculado> profissionaisVinculados
) {

    public DtoListarCliente(Cliente cliente, List<DtoProfissionalVinculado> profissionais) {
        this(
                cliente.getId(),
                cliente.getAtivo(),
                cliente.getNome(),
                cliente.getTipoCliente(),
                cliente.getUnidadeAtendimento(),
                cliente.getDiagnosticoPrincipal(),
                profissionais
        );
    }
}
