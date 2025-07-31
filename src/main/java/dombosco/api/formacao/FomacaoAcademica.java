package dombosco.api.formacao;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FomacaoAcademica {

    @Column(name = "instituicao_ensino")
    private String instituicao;

    @Column(name = "periodo_graduacao")
    private String periodo;

    private String especialidade;

    @Column(name = "atvd_extracurricular")
    private String disciplinaExtra;

    public FomacaoAcademica(DtoFormacaoAcademica dados) {
        this.instituicao = dados.instituicao();
        this.periodo = dados.periodo();
        this.especialidade = dados.especialidade();
        this.disciplinaExtra = dados.disciplinaExtra();
    }
}
