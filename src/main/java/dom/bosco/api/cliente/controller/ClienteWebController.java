package dom.bosco.api.cliente.controller;

import dom.bosco.api.cliente.adulto.ClienteAdt;
import dom.bosco.api.cliente.adulto.RepoClienteAdt;
import dom.bosco.api.cliente.adulto.dto.DtoCadastroClienteAdt;
import dom.bosco.api.cliente.menor.ClienteMnr;
import dom.bosco.api.cliente.menor.RepoClienteMnr;
import dom.bosco.api.cliente.menor.dto.DtoCadastroClienteMnr;
import dom.bosco.api.endereco.Endereco;
import dom.bosco.api.usuario.model.Usuario;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/clientes")
public class ClienteWebController {

    private final RepoClienteAdt repoClienteAdt;
    private final RepoClienteMnr repoClienteMnr;

    private boolean isUserLoggedIn(HttpSession session) {
        return session.getAttribute("usuarioLogado") == null;
    }

    private void addUserDataToModel(Model model, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        if (usuario != null) {
            model.addAttribute("usuario", usuario);
            model.addAttribute("nomeUsuario", usuario.getNome());
            model.addAttribute("cargoUsuario", usuario.getCargo());
        }
    }

    @GetMapping("/cadastro")
    public String mostrarFormularioCadastro(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "cadastro");
        model.addAttribute("contentTemplate", "cadastro-cliente");
        model.addAttribute("clienteAdulto", new DtoCadastroClienteAdt(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null));
        model.addAttribute("clienteMenor", new DtoCadastroClienteMnr(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null));

        return "dashboard";
    }

    @PostMapping("/cadastro/adulto")
    public String cadastrarClienteAdulto(@Valid @ModelAttribute("clienteAdulto") DtoCadastroClienteAdt dados,
                                       BindingResult result,
                                       HttpSession session,
                                       RedirectAttributes redirectAttributes) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("erro", "Erro de validação. Verifique os dados preenchidos.");
            return "redirect:/clientes/cadastro";
        }

        try {
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

            // Criar cliente adulto
            ClienteAdt cliente = new ClienteAdt();
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
            cliente.setCriadoPorUsuarioId(usuarioLogado.getId());

            // Definir endereço - Conversão de DtoEndereco para Endereco
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

            repoClienteAdt.save(cliente);

            redirectAttributes.addFlashAttribute("sucesso",
                "Cliente adulto '" + dados.nome() + "' cadastrado com sucesso! ID: " + cliente.getId());
            return "redirect:/clientes";

        } catch (Exception e) {
            log.error("Erro ao cadastrar cliente adulto: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("erro",
                "Erro ao cadastrar cliente: " + e.getMessage());
            return "redirect:/clientes/cadastro";
        }
    }

    @PostMapping("/cadastro/menor")
    public String cadastrarClienteMenor(@Valid @ModelAttribute("clienteMenor") DtoCadastroClienteMnr dados,
                                      BindingResult result,
                                      HttpSession session,
                                      RedirectAttributes redirectAttributes) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("erro", "Erro de validação. Verifique os dados preenchidos.");
            return "redirect:/clientes/cadastro";
        }

        try {
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

            // Criar cliente menor
            ClienteMnr cliente = new ClienteMnr();
            cliente.setNome(dados.nome()); // Corrigido: usar setNomeCompleto() ao invés de setNome()
            cliente.setDataNascimento(dados.dataNascimento());
            cliente.setGenero(dados.genero());
            cliente.setNomeEscola(dados.nomeEscola());
            cliente.setTipoEscola(dados.tipoEscola());
            cliente.setAnoEscolar(dados.anoEscola());
            cliente.setNomePai(dados.nomePai());
            cliente.setIdadePai(dados.idadePai());
            cliente.setProfissaoPai(dados.profissaoPai());
            cliente.setTelefonePai(dados.telefonePai());
            cliente.setNomeMae(dados.nomeMae());
            cliente.setIdadeMae(dados.idadeMae());
            cliente.setProfissaoMae(dados.profissaoMae());
            cliente.setTelefoneMae(dados.telefoneMae());
            cliente.setResponsavelFinanceiro(dados.responsavelFinanceiro());
            cliente.setOutroResponsavel(dados.outroResponsavel());
            cliente.setObservacoesGerais(dados.observacoesGerais());
            cliente.setDiagnosticoPrincipal(dados.diagnosticoPrincipal());
            cliente.setHistoricoMedico(dados.historicoMedico());
            cliente.setQueixaNeuropsicologica(dados.queixaNeuropsicologica());
            cliente.setExpectativasTratamento(dados.expectativasTratamento());
            cliente.setUnidadeAtendimento(dados.unidadeAtendimento());
            cliente.setCriadoPorUsuarioId(usuarioLogado.getId());

            // Definir endereço - Conversão de DtoEndereco para Endereco
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

            repoClienteMnr.save(cliente);

            redirectAttributes.addFlashAttribute("sucesso",
                "Cliente menor '" + dados.nome() + "' cadastrado com sucesso! ID: " + cliente.getId());
            return "redirect:/clientes";

        } catch (Exception e) {
            log.error("Erro ao cadastrar cliente menor: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("erro",
                "Erro ao cadastrar cliente menor: " + e.getMessage());
            return "redirect:/clientes/cadastro";
        }
    }

    @GetMapping("")
    public String listarTodosClientes(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(defaultValue = "") String busca,
                                    HttpSession session,
                                    Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        addUserDataToModel(model, session);

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // Buscar clientes adultos
        Page<ClienteAdt> clientesAdultos;
        if (!busca.isEmpty()) {
            clientesAdultos = repoClienteAdt.findByNomeContainingIgnoreCaseOrCpfContaining(busca, busca, pageable);
        } else {
            clientesAdultos = repoClienteAdt.findAll(pageable);
        }

        // Buscar clientes menores
        Page<ClienteMnr> clientesMenores;
        if (!busca.isEmpty()) {
            clientesMenores = repoClienteMnr.findByNomeContainingIgnoreCase(busca, pageable);
        } else {
            clientesMenores = repoClienteMnr.findAll(pageable);
        }

        model.addAttribute("activeTab", "clientes");
        model.addAttribute("contentTemplate", "lista-clientes");
        model.addAttribute("clientesAdultos", clientesAdultos);
        model.addAttribute("clientesMenores", clientesMenores);
        model.addAttribute("busca", busca);
        model.addAttribute("currentPage", page);

        return "dashboard";
    }

    @GetMapping("/adulto/{id}")
    public String verDetalhesClienteAdulto(@PathVariable Long id,
                                         HttpSession session,
                                         Model model,
                                         RedirectAttributes redirectAttributes) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        try {
            ClienteAdt cliente = repoClienteAdt.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            addUserDataToModel(model, session);
            model.addAttribute("activeTab", "clientes");
            model.addAttribute("contentTemplate", "detalhes-cliente-adulto");
            model.addAttribute("cliente", cliente);

            return "dashboard";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("erro", "Cliente não encontrado: " + e.getMessage());
            return "redirect:/clientes";
        }
    }

    @GetMapping("/menor/{id}")
    public String verDetalhesClienteMenor(@PathVariable Long id,
                                        HttpSession session,
                                        Model model,
                                        RedirectAttributes redirectAttributes) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        try {
            ClienteMnr cliente = repoClienteMnr.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            addUserDataToModel(model, session);
            model.addAttribute("activeTab", "clientes");
            model.addAttribute("contentTemplate", "detalhes-cliente-menor");
            model.addAttribute("cliente", cliente);

            return "dashboard";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("erro", "Cliente não encontrado: " + e.getMessage());
            return "redirect:/clientes";
        }
    }

    @GetMapping("/meus")
    public String meusPacientes(HttpSession session, Model model) {
        if (isUserLoggedIn(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        // Buscar clientes criados pelo usuário logado
        List<ClienteAdt> meusClientesAdultos = repoClienteAdt.findByCriadoPorUsuarioId(usuarioLogado.getId());
        List<ClienteMnr> meusClientesMenores = repoClienteMnr.findByCriadoPorUsuarioId(usuarioLogado.getId());

        addUserDataToModel(model, session);
        model.addAttribute("activeTab", "meus-pacientes");
        model.addAttribute("contentTemplate", "meus-pacientes");
        model.addAttribute("meusClientesAdultos", meusClientesAdultos);
        model.addAttribute("meusClientesMenores", meusClientesMenores);

        return "dashboard";
    }
}
