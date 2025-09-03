document.addEventListener('DOMContentLoaded', () => {

    // Função para controlar a navegação por abas
    const setupTabNavigation = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;

                // Desativa todas as abas e conteúdos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Ativa a aba e o conteúdo selecionado
                button.classList.add('active');
                const activeContent = document.getElementById(`tab-${tabName}`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    };

    // Função para controlar a seleção de formulário (adulto/menor)
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

        // Garante o estado inicial correto
        setFormVisibility();
    };

    // Função para controlar a abertura e fechamento de todos os modais
    const setupModalToggles = () => {
        // Mapeamento explícito de botões para modais
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
            // Adicione outros mapeamentos aqui conforme necessário
        };

        Object.keys(modalTriggers).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            const modalId = modalTriggers[buttonId];
            const modal = document.getElementById(modalId);

            if (button && modal) {
                button.addEventListener('click', () => {
                    modal.style.display = 'flex';
                });
            }
        });

        // Lógica para fechar os modais
        const closeButtons = document.querySelectorAll('.modal-close-btn');
        const modalOverlays = document.querySelectorAll('.modal-overlay');

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-overlay');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Fecha o modal se clicar fora do conteúdo
        modalOverlays.forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Lógica para o botão de cancelar exclusão
        const cancelDeleteButton = document.getElementById('btn-cancel-delete');
        if(cancelDeleteButton) {
            cancelDeleteButton.addEventListener('click', () => {
                const modal = cancelDeleteButton.closest('.modal-overlay');
                if(modal) {
                    modal.style.display = 'none';
                }
            });
        }
    };

    // Função para o botão de logout
    const setupLogout = () => {
        const logoutButton = document.getElementById('btn-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                // Idealmente, invalidaria a sessão no backend
                window.location.href = 'login.html';
            });
        }
    };

    // Inicializa todas as funcionalidades
    const initializeApp = () => {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.style.display = 'block'; // Garante que o app principal seja exibido
        }

        setupTabNavigation();
        setupAgeSelection();
        setupModalToggles();
        setupLogout();
    };

    initializeApp();
});
