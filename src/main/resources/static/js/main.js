document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNÇÕES DE BUSCA DE DADOS (API) ---

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Falha ao buscar dados de ${url}:`, error);
            return null;
        }
    }

    // --- 2. FUNÇÕES DE RENDERIZAÇÃO (EXIBIÇÃO DE DADOS) ---

    function renderizarLista(containerId, data, renderCardFn, emptyMessage) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container com ID '${containerId}' não encontrado.`);
            return;
        }

        container.innerHTML = '';

        if (!data || !data.content || data.content.length === 0) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        data.content.forEach(item => {
            const card = renderCardFn(item);
            container.appendChild(card);
        });
    }

    function criarCardCliente(client) {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.innerHTML = `
            <div class="card-header">
                <h4>${client.nome}</h4>
                <span class="client-id">ID: ${client.id}</span>
            </div>
            <div class="card-body">
                <p><strong>CPF:</strong> ${client.cpf || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${client.telefone || 'Não informado'}</p>
            </div>
            <div class="card-actions">
                <button class="btn-secondary btn-sm btn-detalhes-cliente" data-client-id="${client.id}">Ver Detalhes</button>
            </div>
        `;
        return clientCard;
    }

    function criarCardFuncionario(user) {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        employeeCard.innerHTML = `
            <div class="card-header">
                 <h4>${user.nome}</h4>
                 <span class="employee-id">ID: ${user.id}</span>
            </div>
            <div class="card-body">
                <p><strong>Cargo:</strong> ${user.cargo.nome || 'Não informado'}</p>
                <p><strong>Email:</strong> ${user.email || 'Não informado'}</p>
            </div>
            <div class="card-actions">
                <button class="btn-secondary btn-sm" data-user-id="${user.id}">Ver Detalhes</button>
            </div>
        `;
        return employeeCard;
    }

    function popularModalCliente(cliente) {
        if (!cliente) return;

        document.getElementById('modal-nome-cliente').textContent = cliente.nome;
        document.getElementById('modal-cpf-cliente').textContent = cliente.cpf || 'Não informado';
        document.getElementById('modal-data-nascimento').textContent = cliente.dataNascimento ? new Date(cliente.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado';
        document.getElementById('modal-email-cliente').textContent = cliente.email || 'Não informado';
        document.getElementById('modal-telefone-cliente').textContent = cliente.telefone || 'Não informado';
        document.getElementById('modal-responsavel-cliente').textContent = 'N/A (Adulto)';
        document.getElementById('modal-unidade-cliente').textContent = cliente.unidadeAtendimento || 'Não informado';

        if (cliente.endereco) {
            document.getElementById('modal-logradouro-cliente').textContent = cliente.endereco.logradouro || '';
            document.getElementById('modal-numero-cliente').textContent = cliente.endereco.numero || '';
            document.getElementById('modal-bairro-cliente').textContent = cliente.endereco.bairro || '';
            document.getElementById('modal-cidade-estado-cliente').textContent = `${cliente.endereco.cidade || ''}/${cliente.endereco.uf || ''}`;
            document.getElementById('modal-cep-cliente').textContent = cliente.endereco.cep || '';
        }

        document.getElementById('modal-observacoes-cliente').textContent = cliente.observacoesGerais || 'Nenhuma observação.';

        const modal = document.getElementById('modal-detalhes-cliente');
        modal.style.display = 'flex';
    }

    // --- 3. FUNÇÕES DE GERENCIAMENTO DE CARGOS ---

    const allSystemTabs = [
        { id: 'cadastro', label: 'Cadastrar Cliente' },
        { id: 'agenda', label: 'Agenda do Dia' },
        { id: 'historico', label: 'Todos os pacientes' },
        { id: 'meus-pacientes', label: 'Meus Pacientes' },
        { id: 'financeiro', label: 'Financeiro' },
        { id: 'relatorios', label: 'Relatórios' },
        { id: 'estoque', label: 'Estoque' },
        { id: 'funcionarios', label: 'Funcionários' },
        { id: 'documentos', label: 'Mural do Coordenador' }
    ];

    function populateCargoPermissions(containerId, currentPermissions = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        allSystemTabs.forEach(tab => {
            const selectId = `${containerId}-${tab.id}-select`;
            const currentAccess = currentPermissions[tab.id] || 'default';

            const accessGroup = document.createElement('div');
            accessGroup.className = 'permission-access-group';

            accessGroup.innerHTML = `
                <label for="${selectId}">${tab.label}</label>
                <select id="${selectId}" data-tab-id="${tab.id}">
                    <option value="default">Padrão do Cargo</option>
                    <option value="none">Sem Acesso</option>
                    <option value="view">Ver</option>
                    <option value="edit">Editar</option>
                </select>
            `;
            container.appendChild(accessGroup);

            const selectElement = document.getElementById(selectId);
            selectElement.value = currentAccess;
        });
    }

    async function getCargos() {
        return await fetchData('/cargo');
    }

    function populateCargosDropdowns(cargos, containerIds) {
        if (!cargos || !Array.isArray(cargos)) {
            console.warn('Dados de cargos inválidos ou ausentes para popular dropdowns.', cargos);
            return;
        }

        containerIds.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = '<option value="">Selecione um cargo</option>'; // Default option
                cargos.forEach(cargo => {
                    const option = document.createElement('option');
                    option.value = cargo.id;
                    option.textContent = cargo.nome;
                    select.appendChild(option);
                });
            } else {
                console.warn(`Dropdown com ID '${id}' não encontrado.`);
            }
        });
    }

    function renderCargosList(cargos) {
        const container = document.getElementById('cargos-list-container');
        if (!container) return;

        if (!cargos || cargos.length === 0) {
            container.innerHTML = '<p>Nenhum cargo personalizado criado ainda.</p>';
            return;
        }

        container.innerHTML = cargos.map(cargo => `
            <div class="cargo-item" data-cargo-id="${cargo.id}">
                <span>${cargo.nome}</span>
                <div class="cargo-actions">
                    <button class="btn-icon btn-edit-cargo" title="Editar Cargo"><i class="fa-solid fa-pencil-alt"></i></button>
                    <button class="btn-icon btn-delete-cargo" title="Excluir Cargo"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `).join('');
    }

    async function loadAndPopulateCargos() {
        const cargosData = await getCargos(); // cargosData é o objeto de paginação
        if (cargosData && cargosData.content) {
            const cargos = cargosData.content; // Extrai a lista de cargos
            populateCargosDropdowns(cargos, ['new-funcionario-cargo', 'funcionario-cargo-filter']);
            renderCargosList(cargos);
        }
    }

    function setupCargoManagementListeners() {
        const cargoEditor = document.getElementById('cargo-editor-container');
        const cargoEditorTitle = document.getElementById('cargo-editor-title');
        const cargoForm = document.getElementById('form-cargo-editor');
        const cargoNameInput = document.getElementById('cargo-name');
        const cargoIdInput = document.getElementById('cargo-editor-id');

        document.getElementById('btn-create-new-cargo')?.addEventListener('click', () => {
            cargoForm.reset();
            cargoIdInput.value = '';
            cargoEditorTitle.textContent = 'Criar Novo Cargo';
            populateCargoPermissions('cargo-tab-permissions', {});
            cargoEditor.style.display = 'block';
        });

        document.getElementById('btn-cancel-cargo-edit')?.addEventListener('click', () => {
            cargoEditor.style.display = 'none';
            cargoForm.reset();
        });

        cargoForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cargoName = cargoNameInput.value.trim();
            if (!cargoName) {
                alert('O nome do cargo não pode estar vazio.');
                return;
            }

            const permissoes = {};
            const permissionSelectors = document.querySelectorAll('#cargo-tab-permissions .permission-access-group select');
            permissionSelectors.forEach(select => {
                const tabId = select.dataset.tabId;
                if (select.value !== 'default') {
                    permissoes[tabId] = select.value;
                }
            });

            const cargoData = { 
                nome: cargoName,
                permissoes: permissoes
            };

            try {
                const response = await fetch('/cargo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cargoData)
                });

                if (response.ok || response.status === 201) {
                    alert('Cargo salvo com sucesso!');
                    cargoForm.reset();
                    cargoEditor.style.display = 'none';
                    await loadAndPopulateCargos(); // Refresh lists
                } else {
                    const error = await response.json();
                    alert(`Erro ao salvar cargo: ${error.message || 'Erro desconhecido.'}`);
                }
            } catch (error) {
                console.error('Falha ao salvar o cargo:', error);
                alert('Não foi possível conectar ao servidor para salvar o cargo.');
            }
        });
    }


    // --- 4. FUNÇÕES DE CADASTRO E AÇÕES (API POST, PUT, DELETE) ---

    async function handleCadastroFuncionario(event) {
        event.preventDefault();
        const form = event.target;

        const cargoId = form.querySelector('#new-funcionario-cargo').value;
        if (!cargoId) {
            alert('Por favor, selecione um cargo.');
            return;
        }

        const dados = {
            usuario: form.querySelector('#new-funcionario-username').value,
            senha: form.querySelector('#new-funcionario-password').value,
            nome: form.querySelector('#new-funcionario-name').value,
            cpf: form.querySelector('#new-funcionario-cpf').value.replace(/\D/g, ''), // Remove non-digit characters
            email: form.querySelector('#new-funcionario-email').value,
            celular: form.querySelector('#new-funcionario-phone').value,
            endereco: form.querySelector('#new-funcionario-address').value,
            cargoId: cargoId // Enviar apenas o ID do cargo
        };

        try {
            const response = await fetch('/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (response.ok || response.status === 201) {
                alert('Funcionário cadastrado com sucesso!');
                form.reset();
                document.getElementById('modal-add-funcionario').style.display = 'none';
                const funcionariosData = await fetchData('/usuario/listar/ativos');
                renderizarLista('funcionario-list-container', funcionariosData, criarCardFuncionario, 'Nenhum funcionário encontrado.');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || (errorData.errors ? errorData.errors.map(e => e.defaultMessage).join(', ') : 'Verifique os dados e tente novamente.');
                alert(`Erro ao cadastrar funcionário: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Falha ao enviar dados do funcionário:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    }

    async function handleCadastroCliente(event) {
        event.preventDefault();
        const form = event.target;
        const dados = {
            nome: form.querySelector('#nome-cliente-adulto').value,
            dataNascimento: form.querySelector('#data-nascimento-adulto').value,
            generalidade: form.querySelector('#genero-adulto').value,
            cpf: form.querySelector('#cpf-cliente-adulto').value,
            rg: form.querySelector('#rg-adulto').value,
            naturalidade: form.querySelector('#naturalidade-adulto').value,
            estadoCivil: form.querySelector('#estado-civil-adulto').value,
            escolaridade: form.querySelector('#escolaridade-adulto').value,
            profissao: form.querySelector('#profissao-adulto').value,
            email: form.querySelector('#email-cliente-adulto').value,
            telefone: form.querySelector('#telefone-cliente-adulto').value,
            contatoEmergencia: form.querySelector('#contato-emergencia-adulto').value,
            unidadeAtendimento: form.querySelector('#unidade-atendimento-adulto').value,
            observacoesGerais: form.querySelector('#observacoes-cliente-adulto').value,
            diagnosticoPrincipal: form.querySelector('#diagnostico-principal-adulto').value,
            historicoMedico: form.querySelector('#historico-medico-adulto').value,
            queixaNeuropsicologica: form.querySelector('#queixa-neuropsicologica-adulto').value,
            expectativasTratamento: form.querySelector('#expectativas-tratamento-adulto').value,
            endereco: {
                cep: form.querySelector('#cep-cliente-adulto').value,
                logradouro: form.querySelector('#logradouro-cliente-adulto').value,
                numero: form.querySelector('#numero-cliente-adulto').value,
                complemento: form.querySelector('#complemento-cliente-adulto').value,
                bairro: form.querySelector('#bairro-cliente-adulto').value,
                cidade: form.querySelector('#cidade-cliente-adulto').value,
                uf: form.querySelector('#estado-cidade-adulto').value
            }
        };

        try {
            const response = await fetch('/cliente-adulto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (response.status === 201) {
                alert('Cliente cadastrado com sucesso!');
                form.reset();
                const [todosClientesData, meusPacientesData] = await Promise.all([
                    fetchData('/cliente-adulto/listar/todos'),
                    fetchData('/cliente-adulto/listar/ativos')
                ]);
                renderizarLista( 'client-list-container', todosClientesData, criarCardCliente, 'Nenhum cliente (ativo ou inativo) encontrado.');
                renderizarLista('meus-pacientes-list', meusPacientesData, criarCardCliente, 'Nenhum paciente ativo encontrado.');
            } else {
                const errorData = await response.json();
                alert(`Erro ao cadastrar cliente: ${errorData.message || 'Verifique os dados e tente novamente.'}`);
            }
        } catch (error) {
            console.error('Falha ao enviar dados do cliente:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    }

    async function handleVerDetalhesCliente(event) {
        if (event.target.classList.contains('btn-detalhes-cliente')) {
            const clienteId = event.target.dataset.clientId;
            const clienteData = await fetchData(`/cliente-adulto/${clienteId}`);
            if (clienteData) {
                popularModalCliente(clienteData);
            }
        }
    }


    // --- 5. FUNÇÕES DE INTERAÇÃO DA UI ---

    const setupEventListeners = () => {
        // Navegação por Abas
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const activeContent = document.getElementById(`tab-${tabName}`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });

        // Seleção de Formulário (Adulto/Menor)
        const ageSelectionRadios = document.querySelectorAll('input[name="age-type"]');
        const adultForm = document.getElementById('form-novo-cliente-adulto');
        const minorForm = document.getElementById('form-novo-cliente-menor');
        const setFormVisibility = () => {
            const selected = document.querySelector('input[name="age-type"]:checked');
            if (!selected || !adultForm || !minorForm) return;
            if (selected.value === 'adult') {
                adultForm.style.display = 'block';
                minorForm.style.display = 'none';
            } else {
                minorForm.style.display = 'block';
                adultForm.style.display = 'none';
            }
        };
        ageSelectionRadios.forEach(radio => radio.addEventListener('change', setFormVisibility));
        setFormVisibility();

        // Modais
        const modalTriggers = {
            'btn-novo-agendamento': 'modal-novo-agendamento',
            'btn-add-stock-item': 'modal-add-stock',
            'btn-add-funcionario': 'modal-add-funcionario',
            'btn-add-document': 'modal-add-document',
            'btn-add-note': 'modal-add-note',
            'btn-novo-atendimento': 'modal-novo-atendimento',
            'btn-edit-client': 'modal-editar-cliente',
            'btn-delete-client': 'modal-confirm-delete',
            'btn-add-general-document': 'modal-add-general-document',
            'btn-add-general-note': 'modal-add-general-note',
            'btn-add-meeting-alert': 'modal-add-meeting-alert',
            'btn-manage-cargos': 'modal-manage-cargos',
        };
        document.body.addEventListener('click', (event) => {
            const button = event.target.closest('[id]');
            if (button && modalTriggers[button.id]) {
                const modal = document.getElementById(modalTriggers[button.id]);
                if(modal) modal.style.display = 'flex';
            }
            if (event.target.classList.contains('modal-close-btn') || event.target.id === 'btn-cancel-delete') {
                const modal = event.target.closest('.modal-overlay');
                if (modal) modal.style.display = 'none';
            }
            if (event.target.classList.contains('modal-overlay')) {
                 event.target.style.display = 'none';
            }
        });

        // Logout
        const logoutButton = document.getElementById('btn-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }

        // Cadastro de Cliente Adulto
        const formCadastroCliente = document.getElementById('form-novo-cliente-adulto');
        if (formCadastroCliente) {
            formCadastroCliente.addEventListener('submit', handleCadastroCliente);
        }

        // Cadastro de Funcionário
        const formCadastroFuncionario = document.getElementById('form-add-funcionario');
        if (formCadastroFuncionario) {
            formCadastroFuncionario.addEventListener('submit', handleCadastroFuncionario);
        }

        // Delegação de Evento para "Ver Detalhes"
        const clientListContainer = document.getElementById('client-list-container');
        if(clientListContainer) {
            clientListContainer.addEventListener('click', handleVerDetalhesCliente);
        }
        const meusPacientesList = document.getElementById('meus-pacientes-list');
        if(meusPacientesList) {
            meusPacientesList.addEventListener('click', handleVerDetalhesCliente);
        }

        // Gerenciamento de Cargos
        setupCargoManagementListeners();
    };

    // --- 6. INICIALIZAÇÃO DA APLICAÇÃO ---
    async function initializeApp() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.style.display = 'block';
        }

        setupEventListeners();

        // Busca e exibe os dados REAIS da API
        const [todosClientesData, meusPacientesData, funcionariosData] = await Promise.all([
            fetchData('/cliente-adulto/listar/todos'),
            fetchData('/cliente-adulto/listar/ativos'),
            fetchData('/usuario/listar/ativos')
        ]);

        renderizarLista( 'client-list-container', todosClientesData, criarCardCliente, 'Nenhum cliente (ativo ou inativo) encontrado.');
        renderizarLista('meus-pacientes-list', meusPacientesData, criarCardCliente, 'Nenhum paciente ativo encontrado.');
        renderizarLista('funcionario-list-container', funcionariosData, criarCardFuncionario, 'Nenhum funcionário encontrado.');

        // Carrega e popula os cargos
        await loadAndPopulateCargos();
    }

    initializeApp().then(r => console.log('App inicializado.'));
});
