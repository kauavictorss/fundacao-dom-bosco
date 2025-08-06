package dom.bosco.api.cliente.dto;

import dom.bosco.api.cliente.model.VinculoProfissionalCliente;

import java.time.LocalDateTime;

public record DtoProfissionalVinculado(
        Long vinculoId,
        Long profissionalId,
        String nomeProfissional,
        String cargoProfissional,
        String emailProfissional,
        String celularProfissional,
        Boolean vinculoAtivo,
        LocalDateTime vinculadoEm
) {
    public DtoProfissionalVinculado(VinculoProfissionalCliente vinculo) {
        this(
                vinculo.getId(),
                vinculo.getProfissional().getId(),
                vinculo.getProfissional().getNome(),
                String.valueOf(vinculo.getProfissional().getCargo()),
                vinculo.getProfissional().getEmail(),
                vinculo.getProfissional().getCelular(),
                vinculo.getAtivo(),
                vinculo.getCriadoEm()
        );
    }
}
