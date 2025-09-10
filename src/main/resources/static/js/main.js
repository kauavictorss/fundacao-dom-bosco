document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNÇÕES DE BUSCA DE DADOS (API) ---

    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Retorna um objeto vazio se a resposta for 204 No Content
            return response.status === 204 ? {} : await response.json();
        } catch (error) {
            console.error(`Falha ao buscar dados de ${url}:`, error);
            return null;
        }
    }

    // --- 2. FUNÇÕES DE RENDERIZAÇÃO (EXIBIÇÃO DE DADOS) ---

    function renderizarFuncionariosComPermissoes(funcionarios) {
        const container = document.getElementById('funcionario-list-container');
        if (!container) return;

        container.innerHTML = '';
        container.className = 'permissions-grid'; // Usa um layout de grade para os cards

        if (!funcionarios || funcionarios.length === 0) {
            container.innerHTML = '<p>Nenhum funcionário cadastrado.</p>';
            container.className = ''; // Reseta a classe se estiver vazio
            return;
        }

        funcionarios.forEach(user => {
            const card = document.createElement('div');
            card.className = 'permission-card';

            const cargoNome = user.cargo ? user.cargo.nome : 'Sem cargo';
            // As permissões virão do cargo. Se não houver, usa um objeto vazio.
            const cargoPermissoes = user.cargo ? user.cargo.permissoes : {};

            card.innerHTML = `
                <div class="permission-card-header">
                    <h3>${user.nome}</h3>
                    <span class="role-badge">${cargoNome}</span>
                </div>
                <div class="permission-access-container">
                    <p class="permission-access-info-text">As permissões abaixo são baseadas no cargo do usuário. A edição individual ainda não está disponível.</p>
                    <div id="tab-permissions-for-user-${user.id}" class="user-tab-permissions-container"></div>
                </div>
                <div class="permission-card-actions">
                    <button class="btn-secondary" onclick="alert('Visualização de detalhes a ser implementada.')"><i class="fa-solid fa-eye"></i> Ver Detalhes</button>
                    <button class="btn-primary" disabled title="A funcionalidade de salvar permissões individuais requer alterações no backend."><i class="fa-solid fa-save"></i> Salvar Permissões</button>
                </div>
            `;
            container.appendChild(card);

            // Popula as permissões para o card deste usuário específico
            populateCargoPermissions(`tab-permissions-for-user-${user.id}`, cargoPermissoes);
        });
    }

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

    async function deleteCargo(id) {
        const response = await fetchData(`/cargo/${id}`, { method: 'DELETE' });
        if (response !== null) {
            alert('Cargo excluído com sucesso!');
            await loadAndPopulateCargos();
        } else {
            alert('Falha ao excluir o cargo.');
        }
    }

    function showCargoEditor(cargo) {
        const cargoEditor = document.getElementById('cargo-editor-container');
        const cargoEditorTitle = document.getElementById('cargo-editor-title');
        const cargoForm = document.getElementById('form-cargo-editor');
        const cargoNameInput = document.getElementById('cargo-name');
        const cargoIdInput = document.getElementById('cargo-editor-id');

        cargoForm.reset();
        if (cargo) {
            cargoIdInput.value = cargo.id;
            cargoNameInput.value = cargo.nome;
            cargoEditorTitle.textContent = 'Editar Cargo';
            populateCargoPermissions('cargo-tab-permissions', cargo.permissoes || {});
        } else {
            cargoIdInput.value = '';
            cargoEditorTitle.textContent = 'Criar Novo Cargo';
            populateCargoPermissions('cargo-tab-permissions', {});
        }
        cargoEditor.style.display = 'block';
    }

    async function loadAndPopulateCargos() {
        const cargosData = await getCargos();
        if (cargosData && cargosData.content) {
            const cargos = cargosData.content;
            populateCargosDropdowns(cargos, ['new-funcionario-cargo', 'funcionario-cargo-filter']);
            renderCargosList(cargos);
        }
    }

    function setupCargoManagementListeners() {
        const cargoListContainer = document.getElementById('cargos-list-container');
        const cargoEditor = document.getElementById('cargo-editor-container');
        const cargoForm = document.getElementById('form-cargo-editor');

        // Event delegation para os botões de ação dos cargos
        cargoListContainer.addEventListener('click', async (e) => {
            const editButton = e.target.closest('.btn-edit-cargo');
            const deleteButton = e.target.closest('.btn-delete-cargo');

            if (editButton) {
                const cargoId = editButton.closest('.cargo-item').dataset.cargoId;
                const cargo = await fetchData(`/cargo/${cargoId}`);
                if (cargo) {
                    showCargoEditor(cargo);
                }
            }

            if (deleteButton) {
                const cargoId = deleteButton.closest('.cargo-item').dataset.cargoId;
                if (confirm(`Tem certeza que deseja excluir o cargo com ID ${cargoId}?`)) {
                    await deleteCargo(cargoId);
                }
            }
        });

        document.getElementById('btn-create-new-cargo')?.addEventListener('click', () => showCargoEditor(null));

        document.getElementById('btn-cancel-cargo-edit')?.addEventListener('click', () => {
            cargoEditor.style.display = 'none';
            cargoForm.reset();
        });

        cargoForm?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cargoId = document.getElementById('cargo-editor-id').value;
            const cargoName = document.getElementById('cargo-name').value.trim();
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

            const url = cargoId ? `/cargo/${cargoId}` : '/cargo';
            const method = cargoId ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cargoData)
                });

                if (response.ok) {
                    alert(`Cargo ${cargoId ? 'atualizado' : 'salvo'} com sucesso!`);
                    cargoForm.reset();
                    cargoEditor.style.display = 'none';
                    await loadAndPopulateCargos();
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
            cpf: form.querySelector('#new-funcionario-cpf').value.replace(/\D/g, ''),
            email: form.querySelector('#new-funcionario-email').value,
            celular: form.querySelector('#new-funcionario-phone').value,
            endereco: form.querySelector('#new-funcionario-address').value,
            cargoId: cargoId
        };

        try {
            const response = await fetch('/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert('Funcionário cadastrado com sucesso!');
                form.reset();
                document.getElementById('modal-add-funcionario').style.display = 'none';
                const funcionariosData = await fetchData('/usuario/listar/ativos');
                if (funcionariosData && funcionariosData.content) {
                    renderizarFuncionariosComPermissoes(funcionariosData.content);
                }
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
        
        if (funcionariosData && funcionariosData.content) {
            renderizarFuncionariosComPermissoes(funcionariosData.content);
        } else {
            renderizarFuncionariosComPermissoes([]); // Renderiza a mensagem de vazio se não houver dados
        }

        // Carrega e popula os cargos
        await loadAndPopulateCargos();
    }

    initializeApp().then();
});
