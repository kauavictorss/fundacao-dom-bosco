import { db, loadDb } from '../jss/database.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÕES DE RENDERIZAÇÃO DE DADOS ---

    const renderizarClientes = () => {
        const container = document.getElementById('client-list-container');
        if (!container) return;

        container.innerHTML = ''; // Limpa o conteúdo existente

        if (!db.clients || db.clients.length === 0) {
            container.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
            return;
        }

        db.clients.forEach(client => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card'; // Estilizar esta classe no CSS
            clientCard.innerHTML = `
                <div class="card-header">
                    <h4>${client.name}</h4>
                    <span class="client-id">ID: ${client.id}</span>
                </div>
                <div class="card-body">
                    <p><strong>CPF:</strong> ${client.cpf || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${client.phone || 'Não informado'}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary btn-sm" data-client-id="${client.id}">Ver Detalhes</button>
                </div>
            `;
            container.appendChild(clientCard);
        });
    };

    const renderizarFuncionarios = () => {
        const container = document.getElementById('funcionario-list-container');
        if (!container) return;

        container.innerHTML = ''; // Limpa o conteúdo

        if (!db.users || db.users.length === 0) {
            container.innerHTML = '<p>Nenhum funcionário cadastrado.</p>';
            return;
        }

        db.users.forEach(user => {
            const employeeCard = document.createElement('div');
            employeeCard.className = 'employee-card'; // Estilizar esta classe no CSS
            employeeCard.innerHTML = `
                <div class="card-header">
                     <h4>${user.name}</h4>
                     <span class="employee-id">ID: ${user.id}</span>
                </div>
                <div class="card-body">
                    <p><strong>Cargo:</strong> ${user.role || 'Não informado'}</p>
                    <p><strong>Email:</strong> ${user.email || 'Não informado'}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary btn-sm" data-user-id="${user.id}">Ver Detalhes</button>
                </div>
            `;
            container.appendChild(employeeCard);
        });
    };

    // --- FUNÇÕES DE INTERAÇÃO DA UI ---

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

        ageSelectionRadios.forEach(radio => {
            radio.addEventListener('change', setFormVisibility);
        });
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
            // Abrir modais
            const buttonId = event.target.closest('[id]')?.id;
            if (buttonId && modalTriggers[buttonId]) {
                const modal = document.getElementById(modalTriggers[buttonId]);
                if(modal) modal.style.display = 'flex';
            }

            // Fechar modais
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

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    const initializeApp = () => {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.style.display = 'block';
        }

        loadDb();

        renderizarClientes();
        renderizarFuncionarios();

        setupTabNavigation();
        setupAgeSelection();
        setupModalToggles();
        setupLogout();
    };

    initializeApp();
});
