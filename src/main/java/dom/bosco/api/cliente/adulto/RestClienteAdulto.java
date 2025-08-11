package dom.bosco.api.cliente.adulto;

import dom.bosco.api.cliente.adulto.dto.DtoCadastroClienteAdt;
import dom.bosco.api.cliente.adulto.dto.DtoDetalharClienteAdt;
import dom.bosco.api.endereco.Endereco;
import dom.bosco.api.usuario.RepoUsuario;
import dom.bosco.api.usuario.model.Usuario;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@Slf4j
@CrossOrigin()
@RequiredArgsConstructor
@RequestMapping("/api/clientes/adultos")
public class RestClienteAdulto {

    private final RepoClienteAdt repositorio;
    private final RepoUsuario repoUsuario;

    @PostMapping
    @Transactional
    public ResponseEntity<DtoDetalharClienteAdt> cadastrar(@RequestBody @Valid DtoCadastroClienteAdt dados, UriComponentsBuilder uriBuilder) {
        log.info("Cadastrando Cliente Adulto: {}", dados.nome());

        try {
            // Verificar se o usuário criador existe
            Usuario usuarioCriador;
            if (dados.criadoPorUsuarioId() != null) {
                usuarioCriador = repoUsuario.findById(dados.criadoPorUsuarioId()).orElse(null);
                if (usuarioCriador == null) {
                    log.warn("Usuário criador não encontrado: {}", dados.criadoPorUsuarioId());
                    return ResponseEntity.badRequest().build();
                }
            }

            // Criar cliente adulto
            ClienteAdt cliente = new ClienteAdt();
            cliente.setAtivo(dados.ativo() != null ? dados.ativo() : true);
            cliente.setNome(dados.nome());
            cliente.setDataNascimento(dados.dataNascimento());
            cliente.setGeneralidade(dados.generalidade());
            cliente.setCpf(dados.cpf());
            cliente.setRg(dados.rg());
            cliente.setNaturalidade(dados.naturalidade());
            cliente.setEstadoCivil(dados.estadoCivil());
            cliente.setEscolaridade(dados.escolaridade());
            cliente.setProfissao(dados.profissao());
            cliente.setEmail(dados.email());
            cliente.setTelefone(dados.telefone());
            cliente.setContatoEmergencia(dados.contatoEmergencia());
            cliente.setObservacoesGerais(dados.observacoesGerais());
            cliente.setDiagnosticoPrincipal(dados.diagnosticoPrincipal());
            cliente.setHistoricoMedico(dados.historicoMedico());
            cliente.setQueixaNeuropsicologica(dados.queixaNeuropsicologica());
            cliente.setExpectativasTratamento(dados.expectativasTratamento());
            cliente.setUnidadeAtendimento(dados.unidadeAtendimento());

            if (dados.criadoPorUsuarioId() != null) {
                cliente.setCriadoPorUsuarioId(dados.criadoPorUsuarioId());
            }

            // Definir endereço se fornecido
            if (dados.endereco() != null) {
                Endereco endereco = new Endereco();
                endereco.setCep(dados.endereco().cep());
                endereco.setLogradouro(dados.endereco().logradouro());
                endereco.setNumero(dados.endereco().numero());
                endereco.setComplemento(dados.endereco().complemento());
                endereco.setBairro(dados.endereco().bairro());
                endereco.setCidade(dados.endereco().cidade());
                endereco.setEstado(dados.endereco().estado());
                cliente.setEndereco(endereco);
            }

            // Salvar no banco
            ClienteAdt clienteSalvo = repositorio.save(cliente);

            var uri = uriBuilder.path("/api/clientes/adultos/{id}").buildAndExpand(clienteSalvo.getId()).toUri();

            log.info("Cliente adulto cadastrado com sucesso! ID: {} - Nome: {}", clienteSalvo.getId(), clienteSalvo.getNome());
            return ResponseEntity.created(uri).body(new DtoDetalharClienteAdt(clienteSalvo));

        } catch (Exception e) {
            log.error("Erro ao cadastrar cliente adulto: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoDetalharClienteAdt> detalhar(@PathVariable Long id) {
        var cliente = repositorio.findById(id);

        return cliente.map(clienteAdt -> ResponseEntity.ok(new DtoDetalharClienteAdt(clienteAdt))).orElseGet(() -> ResponseEntity.notFound().build());

    }
}
