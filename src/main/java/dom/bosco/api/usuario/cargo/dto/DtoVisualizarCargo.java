package dom.bosco.api.usuario.cargo.dto;

import dom.bosco.api.usuario.cargo.Cargo;

public record DtoVisualizarCargo(Long id, String nome) {
    public DtoVisualizarCargo(Cargo cargo) {
        this(cargo.getId(), cargo.getNome());
    }
}
