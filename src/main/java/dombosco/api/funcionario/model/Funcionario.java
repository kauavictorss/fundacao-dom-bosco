package dombosco.api.funcionario.model;

import dombosco.api.endereco.Endereco;
import dombosco.api.formacao.FomacaoAcademica;
import dombosco.api.funcionario.dto.DtoCadFuncionario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "funcionario")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean ativo;
    private String usuario;
    private String senha;
    private String nome;
    private String cpf;
    private String email;
    private String celular;

    @Enumerated(EnumType.STRING)
    private Cargo cargo;

    @Embedded
    private FomacaoAcademica fomacaoAcademica;

    @Embedded
    private Endereco endereco;

    public Funcionario(DtoCadFuncionario dados) {
        this.usuario = dados.usuario();
        this.senha = dados.senha();
        this.nome = dados.nomeCompleto();
        this.cpf = dados.cpf();
        this.celular = dados.celular();
        this.email = dados.email();
        this.cargo = dados.cargo();
        this.fomacaoAcademica = new FomacaoAcademica(dados.fomacaoAcademica());
        this.endereco = new Endereco(dados.endereco());
    }

    public void excuir() {
        this.ativo = false;
    }
}
