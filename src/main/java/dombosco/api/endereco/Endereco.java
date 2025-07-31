package dombosco.api.endereco;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {

    private String rua;
    @Column(name = "numero_endereco")
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;

    public Endereco(DtoEndereco dados) {
        this.rua = dados.rua();
        this.numero = dados.numero();
        this.bairro = dados.bairro();
        this.cidade = dados.cidade();
        this.estado = dados.estado();
    }
}
