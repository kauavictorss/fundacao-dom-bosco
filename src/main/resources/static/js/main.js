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
                <button class="btn-secondary btn-sm" data-client-id="${client.id}">Ver Detalhes</button>
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
                <p><strong>Cargo:</strong> ${user.cargo || 'Não informado'}</p>
                <p><strong>Email:</strong> ${user.email || 'Não informado'}</p>
            </div>
            <div class="card-actions">
                <button class="btn-secondary btn-sm" data-user-id="${user.id}">Ver Detalhes</button>
            </div>
        `;
        return employeeCard;
    }

    // --- 3. FUNÇÕES DE INTERAÇÃO DA UI ---

    const setupTabNavigation = () => {
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
    };

    const setupAgeSelection = () => {
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
    };

    const setupModalToggles = () => {
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
            'btn-manage-roles': 'modal-manage-roles',
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
    };

    const setupLogout = () => {
        const logoutButton = document.getElementById('btn-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    };

    // --- 4. INICIALIZAÇÃO DA APLICAÇÃO ---
    async function initializeApp() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.style.display = 'block';
        }
        
        setupTabNavigation();
        setupAgeSelection();
        setupModalToggles();
        setupLogout();

        // Busca e exibe os dados REAIS da API
        const [todosClientesData, meusPacientesData, funcionariosData] = await Promise.all([
            fetchData('/cliente-adulto/listar/todos'),
            fetchData('/cliente-adulto/listar/ativos'),
            fetchData('/usuario/listar/ativos')
        ]);

        renderizarLista( 'client-list-container', todosClientesData, criarCardCliente, 'Nenhum cliente (ativo ou inativo) encontrado.');
        renderizarLista('meus-pacientes-list', meusPacientesData, criarCardCliente, 'Nenhum paciente ativo encontrado.');
        renderizarLista('funcionario-list-container', funcionariosData, criarCardFuncionario, 'Nenhum funcionário encontrado.');
    }

    initializeApp();
});
