package dombosco.api.funcionario;

import dombosco.api.funcionario.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoFuncionario extends JpaRepository<Funcionario, Long> {
}
