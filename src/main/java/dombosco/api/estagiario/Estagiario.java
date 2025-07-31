package dombosco.api.estagiario;

import dombosco.api.endereco.Endereco;
import dombosco.api.formacao.FomacaoAcademica;
import dombosco.api.funcionario.model.Cargo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "estagiario")
public class Estagiario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean ativo;
    private String usuario;
    private String senha;
    private String nome;
    private String cpf;
    private String email;
    private String celular;

    @Embedded
    private Endereco endereco;

    @Embedded
    private FomacaoAcademica formacaoAcademica;
    
    @Enumerated(EnumType.STRING)
    private Cargo cargo;

    public Estagiario(DtoCadEstagiario dados) {
        this.ativo = true;
        this.nome = dados.nome();
        this.usuario = dados.usuario();
        this.senha = dados.senha();
        this.cpf = dados.cpf();
        this.email = dados.email();
        this.celular = dados.celular();
        this.cargo = dados.cargo();
        this.endereco = new Endereco(dados.endereco());

        // Verificar se formacaoAcademica não é null antes de criar a instância
        if (dados.formacaoAcademica() != null) {
            this.formacaoAcademica = new FomacaoAcademica(dados.formacaoAcademica());
        }
    }

    public void excuir() {
        this.ativo = false;
    }


}
