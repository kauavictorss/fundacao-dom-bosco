// Main application entry point
import { loadDb, saveDb, db } from './database.js';
import { login, logout, checkLogin, getCurrentUser, isRoleAllowed, DIRECTOR_ONLY, FINANCE_ONLY, DIRECTOR_OR_FINANCE, STOCK_MANAGERS, ALL_USERS, PROFESSIONAL_ROLES, COORDINATOR_AND_HIGHER, NON_FINANCE_ACCESS, ALL_ADMIN_VIEW_CLIENTS_AND_EMPLOYEES, DIRECTOR_AND_PROFESSIONALS, DIRECTOR_AND_COORDINATORS_ONLY_DOCUMENTS, checkTabAccess } from './auth.js'; 
import { showLoginScreen, showMainApp, switchTab, updateCurrentDate, showNotification, updateGlobalSearchDatalist } from './ui.js'; 
import { renderClientList, showClientDetails, addClientNote, addClientDocument, deleteClientDocument, renderMeusPacientes, renderClientReport, showAssignProfessionalModal, assignProfessionalToClient, unassignProfessionalFromClient, deleteClient, duplicateClient, showEmployeeReport, showClientReportModal, generateClientReport } from './clients.js'; 
import { renderSchedule, updateScheduleStatus, initializeCalendar, renderCalendar, saveEditedSchedule, cancelScheduleWithReason, reassignSchedule, populateAssignableUsers, serviceNames, editSchedule, saveReassignedSchedule, initScheduleView } from './schedule.js'; 
import { renderFinancialReport, renderDailyNotes, addDailyNote, generateDetailedFinancialReport, downloadDailyNotes, deleteDailyNote } from './financial.js'; 
import { setupFormHandlers } from './forms.js';
import { renderStockList, renderStockMovements, updateStockSummary, showDeleteStockItemConfirmation } from './stock.js';
import { renderFuncionarioList, showFuncionarioDetails, showEditFuncionarioModal, saveFuncionarioChanges, deleteFuncionario, addFuncionario, showEditPasswordModal, populateTabPermissions, saveUserPermissions, initRolesManagement, deleteRole } from './funcionarios.js'; 
import { convertTimeToDecimalHours } from './utils.js'; 

// --- Inactivity Logout Variables ---
let idleTimeout;
const IDLE_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// --- Inactivity Logout Functions ---
function resetIdleTimer() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(logoutUser, IDLE_TIME);
}

function logoutUser() {
    logout(); // Perform the actual logout logic
    showLoginScreen(); // Show the login screen
    showNotification('Você foi desconectado(a) devido à inatividade.', 'info', 'Inatividade', 7000);
}

// Make necessary functions globally available for onclicks or direct access
window.showClientDetails = showClientDetails;
window.updateScheduleStatus = updateScheduleStatus;
window.deleteClientDocument = deleteClientDocument;
window.cancelScheduleWithReason = cancelScheduleWithReason;
window.editSchedule = editSchedule;
window.reassignSchedule = reassignSchedule; 
window.saveReassignedSchedule = saveReassignedSchedule; 
window.getCurrentUser = getCurrentUser;
window.showDeleteStockItemConfirmation = showDeleteStockItemConfirmation;
window.showFuncionarioDetails = showFuncionarioDetails; 
window.showEditFuncionarioModal = showEditFuncionarioModal; 
window.showEditPasswordModal = showEditPasswordModal; 
window.deleteFuncionario = deleteFuncionario;
window.fillLoginForm = fillLoginForm; // NEW: Make fillLoginForm globally available
window.deleteMuralItem = (id) => {
    const itemToDelete = db.generalDocuments.find(d => d.id === id);
    if (!itemToDelete) return;

    window.currentDeleteItem = id;
    window.currentDeleteItemType = 'generalDocument'; 

    const modal = document.getElementById('modal-confirm-delete');
    const message = document.getElementById('delete-confirmation-message');
    
    let confirmationText = '';
    if (itemToDelete.documentType === 'note') {
        confirmationText = `Tem certeza que deseja excluir a nota "${itemToDelete.title}"?`;
    } else if (itemToDelete.documentType === 'reuniao') {
        confirmationText = `Tem certeza que deseja excluir a reunião "${itemToDelete.title}"? Uma notificação será enviada aos participantes sobre o cancelamento.`;
    } else {
        confirmationText = `Tem certeza que deseja excluir o documento "${itemToDelete.title}"?`;
    }

    message.textContent = `${confirmationText} Esta ação é irreversível.`;
    
    modal.style.display = 'flex';
};
window.showAssignProfessionalModal = showAssignProfessionalModal; 
window.assignProfessionalToClient = assignProfessionalToClient; 
window.deleteClient = deleteClient; 
window.saveUserPermissions = saveUserPermissions;
window.deleteDailyNote = deleteDailyNote;
window.deleteRole = deleteRole;
window.duplicateClient = duplicateClient; // Make duplicate function globally accessible if needed, though listener is better
window.showEmployeeReport = showEmployeeReport;
window.showClientReportModal = showClientReportModal;

// NEW: Global file preview function
window.previewFile = (title, fileData, fileName) => {
    const modal = document.getElementById('modal-file-preview');
    const titleElement = document.getElementById('file-preview-title');
    const contentElement = document.getElementById('file-preview-content');

    if (!modal || !titleElement || !contentElement) return;

    titleElement.textContent = `Visualizando: ${title}`;

    if (/\.(jpe?g|png|gif|webp)$/i.test(fileName)) {
        contentElement.innerHTML = `<img src="${fileData}" alt="${title}">`;
    } else {
        contentElement.innerHTML = `<p>A pré-visualização não está disponível para este tipo de arquivo (${fileName}).</p>`;
    }

    modal.style.display = 'flex';
};

// Initialize mobile-specific functions
function setupMobileGestures() {
  const nav = document.querySelector('.nav-wrapper');
  if (!nav) return; 

  let touchStartX = 0;
  
  nav.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  nav.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;
    
    if(Math.abs(diffX) > 50) { 
      const currentActive = nav.querySelector('.tab-button.active');
      if (!currentActive) return;

      const tabButtons = Array.from(nav.querySelectorAll('.tab-button'));
      const visibleTabButtons = tabButtons.filter(button => button.style.display !== 'none');
      const currentIndex = visibleTabButtons.indexOf(currentActive);

      if (diffX > 0) { 
        if (currentIndex < visibleTabButtons.length - 1) {
          visibleTabButtons[currentIndex + 1].click();
        }
      } else { 
        if (currentIndex > 0) {
          visibleTabButtons[currentIndex - 1].click();
        }
      }
    }
  }, false);
}

// NEW: Function to populate demo credentials
function populateDemoCredentials() {
    const demoCredentialsContainer = document.getElementById('demo-credentials-list');
    if (!demoCredentialsContainer) return;

    // Definir credenciais de demonstração
    const demoCredentials = [
        { username: 'director', password: 'admin123', role: 'Diretoria Geral' },
        { username: 'financeiro', password: 'admin123', role: 'Financeiro' },
        { username: 'staff', password: 'staff123', role: 'Funcionário' },
        { username: 'raquel', password: 'admin123', role: 'Coordenadora (Floresta)' },
        { username: 'tatiana_admin', password: 'admin123', role: 'Coordenadora (Madre)' },
        { username: 'frances', password: 'intern123', role: 'Estagiária' },
        { username: 'kimberly', password: 'kimberly123', role: 'Psicóloga' },
        { username: 'beethoven', password: 'beethoven123', role: 'Musicoterapeuta' }
    ];

    demoCredentialsContainer.innerHTML = '';

    demoCredentials.forEach(credential => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${credential.role}:</strong> 
            <span class="credential-item" onclick="fillLoginForm('${credential.username}', '${credential.password}')">
                ${credential.username} / ${credential.password}
            </span>
        `;
        demoCredentialsContainer.appendChild(listItem);
    });

    // Mostrar o container de credenciais demo
    const demoContainer = document.querySelector('.demo-credentials');
    if (demoContainer) {
        demoContainer.style.display = 'block';
    }
}

// Function to fill login form with demo credentials
function fillLoginForm(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadDb();
    populateDemoCredentials(); 
    
    // CORREÇÃO: Sempre mostrar tela de login, removendo login automático
    // Limpar qualquer sessão anterior armazenada
    logout();
    showLoginScreen();

    setupEventListeners();
    setupFormHandlers();
    setupMobileGestures(); 
    setupGlobalSearch(); // NEW: Setup global search
});

function initializeApp() {
    updateCurrentDate();
    initializeCalendar();
    initScheduleView(); // Initialize agenda view, including the professional filter
    
    const currentUser = getCurrentUser();
    
    // Determine initial tab based on user permissions
    let initialTab = 'cadastro'; // Default fallback

    const availableTabs = [
        'cadastro', 'agenda', 'historico', 'meus-pacientes', 'financeiro',
        'relatorios', 'estoque', 'funcionarios', 'documentos'
    ];

    // Find the first tab the user has view access to
    const firstAccessibleTab = availableTabs.find(tabId => checkTabAccess(tabId, 'view'));
    if (firstAccessibleTab) {
        initialTab = firstAccessibleTab;
    }
    
    // Render the content of the initial tab
    // This will trigger the respective render functions with their own permission checks
    switchTab(initialTab);

    // Call relevant render functions for initial load if they are not triggered by switchTab for the initial tab
    // This ensures all dashboards/lists that are part of the initial view are updated.
    if (checkTabAccess('historico', 'view')) { renderClientList(); }
    if (checkTabAccess('meus-pacientes', 'view')) { renderMeusPacientes(); }
    if (checkTabAccess('financeiro', 'view')) {
        const financialPeriodSelector = document.getElementById('financial-period-selector');
        if (financialPeriodSelector) {
            financialPeriodSelector.value = 'current-month';
            renderFinancialReport('current-month');
            renderDailyNotes('current-month');
        } else {
            renderFinancialReport();
            renderDailyNotes();
        }
    }
    if (checkTabAccess('estoque', 'view')) {
        renderStockList();
        renderStockMovements();
        updateStockSummary();
    }
    if (checkTabAccess('relatorios', 'view')) { renderClientReport(); }
    if (checkTabAccess('funcionarios', 'view')) { renderFuncionarioList(); }
    if (checkTabAccess('documentos', 'view')) {
        renderGeneralDocuments();
        const documentsControls = document.querySelector('.documents-controls');
        if (documentsControls) {
            if (checkTabAccess('documentos', 'edit')) { // Check for edit access to show controls
                documentsControls.style.display = 'flex';
            } else {
                documentsControls.style.display = 'none';
            }
        }
    }
}

// NEW: Setup for the global search
function setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchDatalist = document.getElementById('global-search-datalist');
    const gotoButton = document.getElementById('btn-global-search');

    if (!searchInput || !searchDatalist || !gotoButton) return;

    // Populate once on load
    updateGlobalSearchDatalist();

    const executeGlobalSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;

        const match = query.match(/^(Paciente|Funcionário|Estoque): .+\(ID: (\d+)\)$/);

        if (match && match[1] && match[2]) {
            const type = match[1];
            const id = parseInt(match[2], 10);

            if (type === 'Paciente') {
                showClientDetails(id);
            } else if (type === 'Funcionário') {
                showFuncionarioDetails(id);
            } else if (type === 'Estoque') {
                switchTab('estoque');
                // Use a timeout to ensure the DOM is updated before scrolling
                setTimeout(() => {
                    const itemCard = document.getElementById(`stock-item-card-${id}`);
                    if (itemCard) {
                        itemCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        itemCard.classList.add('highlight');
                        setTimeout(() => itemCard.classList.remove('highlight'), 2500);
                    } else {
                        showNotification(`Item de estoque com ID ${id} não encontrado na lista.`, 'warning');
                    }
                }, 100);
            }
            searchInput.value = ''; // Clear input after search
        } else {
            showNotification(`Por favor, selecione um item válido da lista de busca.`, 'warning');
        }
    };

    gotoButton.addEventListener('click', executeGlobalSearch);
    
    // Also allow 'Enter' key to trigger the search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if it's in a form
            executeGlobalSearch();
        }
    });
}

function setupEventListeners() {
    // --- Inactivity Logout Event Listeners ---
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    document.addEventListener('click', resetIdleTimer);
    document.addEventListener('scroll', resetIdleTimer);
    // --- End Inactivity Logout Event Listeners ---

    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            document.getElementById('form-login').reset();
            showMainApp();
            initializeApp();
            checkNotifications(); 
            resetIdleTimer(); // Start idle timer on successful login
        } else {
            showNotification('Usuário ou senha inválidos!', 'error');
        }
    });

    // NEW: Notification Bell click handler
    document.getElementById('notification-bell').addEventListener('click', () => {
        const dropdown = document.getElementById('notification-dropdown');
        dropdown.classList.toggle('active');

        if (dropdown.classList.contains('active')) {
            dropdown.style.display = 'block';
            markNotificationsAsRead(); 
        } else {
            // Use timeout to allow fade-out animation
            setTimeout(() => {
                if (!dropdown.classList.contains('active')) {
                    dropdown.style.display = 'none';
                }
            }, 200);
        }
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        const bellWrapper = document.querySelector('.notification-bell-wrapper');
        const dropdown = document.getElementById('notification-dropdown');
        // Check if the dropdown is active and the click was outside the bell wrapper
        if (dropdown.classList.contains('active') && !bellWrapper.contains(event.target)) {
            dropdown.classList.remove('active');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        clearTimeout(idleTimeout); // Clear the idle timer on manual logout
        logout();
        showLoginScreen();
    });

    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            if (!checkTabAccess(tabId, 'view')) { // Check if user has view permission for the clicked tab
                showNotification(`Você não tem permissão para acessar a aba "${button.querySelector('span').textContent}".`, 'error');
                return; // Prevent switching if no permission
            }

            switchTab(tabId);
            
            // Refresh data when switching tabs - Ensure all rendering aligns with tab visibility
            if (tabId === 'historico') {
                const searchTerm = document.getElementById('search-cliente').value;
                const activityFilter = document.getElementById('client-activity-filter-select').value;
                const internFilter = document.getElementById('client-intern-filter-select').value;
                const unitFilter = document.getElementById('client-unit-filter-select').value;
                renderClientList(searchTerm, activityFilter, internFilter, unitFilter);
            } else if (tabId === 'agenda') {
                renderSchedule();
                renderCalendar();
                initScheduleView(); // Re-initialize when switching to the tab
            } else if (tabId === 'relatorios') {
                renderClientReport(document.getElementById('client-report-period').value);
            } else if (tabId === 'financeiro') {
                const selectedPeriod = document.getElementById('financial-period-selector').value;
                renderFinancialReport(selectedPeriod);
                renderDailyNotes(selectedPeriod);
            } else if (tabId === 'estoque') {
                renderStockList();
                renderStockMovements();
                updateStockSummary();
            } else if (tabId === 'meus-pacientes') {
                renderMeusPacientes();
            } else if (tabId === 'funcionarios') {
                renderFuncionarioList();
            } else if (tabId === 'documentos') {
                renderGeneralDocuments();
                const documentsControls = document.querySelector('.documents-controls');
                if (documentsControls) {
                    if (checkTabAccess('documentos', 'edit')) { // Check for edit access to show controls
                        documentsControls.style.display = 'flex';
                    } else {
                        documentsControls.style.display = 'none';
                    }
                }
            } else if (tabId === 'cadastro') {
                // No specific re-render needed, form state is maintained.
            }
        });
    });

    // Search functionality
    document.getElementById('search-cliente').addEventListener('input', (e) => {
        if (!checkTabAccess('historico', 'view')) return; // Check if user has view permission for the tab
        const activityFilter = document.getElementById('client-activity-filter-select').value;
        const internFilter = document.getElementById('client-intern-filter-select').value;
        const unitFilter = document.getElementById('client-unit-filter-select').value;
        renderClientList(e.target.value, activityFilter, internFilter, unitFilter);
    });

    const searchMeusPacientes = document.getElementById('search-meus-pacientes');
    if (searchMeusPacientes) {
        searchMeusPacientes.addEventListener('input', (e) => {
            if (!checkTabAccess('meus-pacientes', 'view')) return; // Check if user has view permission for the tab
            renderMeusPacientes(e.target.value);
        });
    }

    const searchFuncionario = document.getElementById('search-funcionario');
    if (searchFuncionario) {
        searchFuncionario.addEventListener('input', (e) => {
            if (!checkTabAccess('funcionarios', 'view')) return; // Check if user has view permission for the tab
            const roleFilter = document.getElementById('funcionario-role-filter').value;
            renderFuncionarioList(e.target.value, roleFilter);
        });
    }

    const funcionarioRoleFilter = document.getElementById('funcionario-role-filter');
    if (funcionarioRoleFilter) {
        funcionarioRoleFilter.addEventListener('change', (e) => {
            if (!checkTabAccess('funcionarios', 'view')) return;
            const searchTerm = document.getElementById('search-funcionario').value;
            renderFuncionarioList(searchTerm, e.target.value);
        });
    }

    const clientActivityFilterSelect = document.getElementById('client-activity-filter-select');
    if (clientActivityFilterSelect) {
        clientActivityFilterSelect.addEventListener('change', () => {
            if (!checkTabAccess('historico', 'view')) return; // Check if user has view permission for the tab
            const searchTerm = document.getElementById('search-cliente').value;
            const internFilter = document.getElementById('client-intern-filter-select').value;
            const unitFilter = document.getElementById('client-unit-filter-select').value;
            renderClientList(searchTerm, clientActivityFilterSelect.value, internFilter, unitFilter);
        });
    }

    const clientInternFilterSelect = document.getElementById('client-intern-filter-select');
    if (clientInternFilterSelect) {
        clientInternFilterSelect.addEventListener('change', () => {
            if (!checkTabAccess('historico', 'view')) return; // Check if user has view permission for the tab
            const searchTerm = document.getElementById('search-cliente').value;
            const activityFilter = document.getElementById('client-activity-filter-select').value;
            const unitFilter = document.getElementById('client-unit-filter-select').value;
            renderClientList(searchTerm, activityFilter, clientInternFilterSelect.value, unitFilter);
        });
    }

    const clientUnitFilterSelect = document.getElementById('client-unit-filter-select');
    if (clientUnitFilterSelect) {
        clientUnitFilterSelect.addEventListener('change', () => {
            if (!checkTabAccess('historico', 'view')) return; // Check if user has view permission for the tab
            const searchTerm = document.getElementById('search-cliente').value;
            const activityFilter = document.getElementById('client-activity-filter-select').value;
            const internFilter = document.getElementById('client-intern-filter-select').value;
            renderClientList(searchTerm, activityFilter, internFilter, clientUnitFilterSelect.value);
        });
    }

    document.getElementById('date-selector').addEventListener('change', (e) => {
        if (!checkTabAccess('agenda', 'view')) return; // Check if user has view permission for the tab
        renderSchedule(e.target.value);
        renderCalendar();
    });

    const financialPeriodSelector = document.getElementById('financial-period-selector');
    if (financialPeriodSelector) {
        financialPeriodSelector.addEventListener('change', (e) => {
            if (!checkTabAccess('financeiro', 'view')) return; // Check if user has view permission for the tab
            renderFinancialReport(e.target.value);
            renderDailyNotes(e.target.value);
        });
    }

    const btnUpdateFinancial = document.getElementById('btn-update-financial');
    if (btnUpdateFinancial) {
        btnUpdateFinancial.addEventListener('click', () => {
            if (!checkTabAccess('financeiro', 'view')) return; // Check if user has view permission for the tab
            const selectedPeriod = document.getElementById('financial-period-selector').value;
            renderFinancialReport(selectedPeriod);
            renderDailyNotes(selectedPeriod);
            showNotification('Relatório financeiro atualizado!', 'success');
        });
    }

    const stockMonthSelector = document.getElementById('stock-month-selector');
    if (stockMonthSelector) {
        const today = new Date();
        const currentMonthFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        stockMonthSelector.value = currentMonthFormatted;
    }

    const btnUpdateStockMovements = document.getElementById('btn-update-stock-movements');
    if (btnUpdateStockMovements) {
        btnUpdateStockMovements.addEventListener('click', () => {
            if (!checkTabAccess('estoque', 'view')) return; // Check if user has view permission for the tab
            const selectedMonth = document.getElementById('stock-month-selector').value;
            renderStockMovements(selectedMonth);
            showNotification('Movimentações de estoque filtradas por período!', 'success');
        });
    }

    const btnClearStockFilter = document.getElementById('btn-clear-stock-filter');
    if (btnClearStockFilter) {
        btnClearStockFilter.addEventListener('click', () => {
            if (!checkTabAccess('estoque', 'view')) return; // Check if user has view permission for the tab
            document.getElementById('stock-month-selector').value = '';
            renderStockMovements();
            showNotification('Filtro removido - mostrando todas as movimentações!', 'info');
        });
    }

    document.getElementById('btn-novo-agendamento').addEventListener('click', () => {
        if (!checkTabAccess('agenda', 'edit')) { showNotification('Você não tem permissão para adicionar agendamentos.', 'error'); return; }
        populateClientSelect();
        populateServiceTypes();
        populateAssignableUsers();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('data-agendamento').value = today;
        document.getElementById('modal-novo-agendamento').style.display = 'flex';
        document.getElementById('select-cliente-agenda').value = '';
    });

    document.getElementById('btn-schedule-new-appointment').addEventListener('click', () => {
        if (!checkTabAccess('agenda', 'edit') && !checkTabAccess('historico', 'edit') && !checkTabAccess('meus-pacientes', 'edit')) { // Check edit access for relevant tabs
            showNotification('Você não tem permissão para agendar novos atendimentos.', 'error');
            return;
        }
        const currentClientId = window.currentClientId;
        document.getElementById('modal-detalhes-cliente').style.display = 'none';

        populateClientSelect();
        populateServiceTypes();
        populateAssignableUsers();
        
        document.getElementById('select-cliente-agenda').value = currentClientId;
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('data-agendamento').value = today;
        document.getElementById('modal-novo-agendamento').style.display = 'flex';
    });

    document.getElementById('form-novo-agendamento').addEventListener('submit', (e) => {
        e.preventDefault();
        saveNewSchedule();
    });

    // New attendance button
    document.getElementById('btn-novo-atendimento').addEventListener('click', () => {
        if (!checkTabAccess('historico', 'edit') && !checkTabAccess('meus-pacientes', 'edit')) { // Check edit access for client related tabs
            showNotification('Você não tem permissão para adicionar atendimentos.', 'error');
            return;
        }
        // Close client details modal first for a cleaner transition
        document.getElementById('modal-detalhes-cliente').style.display = 'none';
        
        populateAnamnesisSelect();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('data-atendimento').value = today;
        document.getElementById('modal-novo-atendimento').style.display = 'flex';
    });

    document.getElementById('form-novo-atendimento').addEventListener('submit', (e) => {
        e.preventDefault();
        saveNewAttendance();
    });

    document.getElementById('form-cancelar-agendamento').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCancellation();
    });

    document.getElementById('imagem-cancelamento').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('img-preview-cancelamento').src = e.target.result;
                document.getElementById('preview-imagem-cancelamento').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('preview-imagem-cancelamento').style.display = 'none';
        }
    });

    document.getElementById('form-confirmar-atendimento').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAttendanceConfirmation();
    });

    document.getElementById('btn-add-stock-item').addEventListener('click', () => {
        if (!checkTabAccess('estoque', 'edit')) { showNotification('Você não tem permissão para adicionar itens ao estoque.', 'error'); return; }
        document.getElementById('form-add-stock').reset();
        document.getElementById('modal-add-stock').style.display = 'flex';
    });

    document.getElementById('form-add-stock').addEventListener('submit', (e) => {
        e.preventDefault();
        addStockItem();
    });

    document.getElementById('form-adjust-stock').addEventListener('submit', (e) => {
        e.preventDefault();
        processStockAdjustment();
    });

    document.getElementById('btn-add-material').addEventListener('click', () => {
        if (!checkTabAccess('historico', 'edit') && !checkTabAccess('meus-pacientes', 'edit')) { return; } // Check edit access for client related tabs
        addMaterialSelection();
    });

    document.getElementById('btn-add-material-confirm').addEventListener('click', () => {
        if (!checkTabAccess('agenda', 'edit')) { return; } // Check edit access for agenda tab
        addMaterialSelection('confirm');
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', () => {
        // Consolidated permission check for deletion actions
        if (window.currentDeleteItemType === 'stock') {
            const itemIdToDelete = window.currentDeleteItem;
            if (checkTabAccess('estoque', 'edit') && itemIdToDelete) { // Use checkTabAccess
                const itemIndex = db.stockItems.findIndex(item => item.id === itemIdToDelete);
                if (itemIndex !== -1) {
                    const itemToDelete = db.stockItems[itemIndex];
                     // Add a movement record for deletion
                    db.stockMovements.push({
                        id: db.nextMovementId++,
                        itemId: itemToDelete.id, 
                        itemName: itemToDelete.name,
                        type: 'exclusao',
                        quantity: itemToDelete.quantity, 
                        reason: 'Item excluído do estoque',
                        date: new Date().toISOString(),
                        user: getCurrentUser().name,
                        itemUnitValue: itemToDelete.unitValue,
                        purchaseNotes: null, 
                        purchaseFileData: null,
                        purchaseFileName: null
                    });
                    db.stockItems.splice(itemIndex, 1);
                    saveDb();
                    renderStockList();
                    renderStockMovements();
                    updateStockSummary();
                    showNotification(`Item "${itemToDelete.name}" excluído do estoque com sucesso!`, 'success');
                }
            } else {
                showNotification('Você não tem permissão para realizar esta exclusão.', 'error');
            }
        } else if (window.currentDeleteItemType === 'funcionario') {
            const funcIdToDelete = window.currentDeleteItem;
            if (checkTabAccess('funcionarios', 'edit') && funcIdToDelete) { // Use checkTabAccess
                deleteFuncionario(funcIdToDelete);
            } else {
                showNotification('Você não tem permissão para realizar esta exclusão.', 'error');
            }
        } else if (window.currentDeleteItemType === 'client') {
            const clientIdToDelete = window.currentDeleteItem;
            if (checkTabAccess('historico', 'edit') && clientIdToDelete) { // Use checkTabAccess
                deleteClient(clientIdToDelete);
            } else {
                showNotification('Você não tem permissão para realizar esta exclusão.', 'error');
            }
        } else if (window.currentDeleteItemType === 'generalDocument') {
            const docIdToDelete = window.currentDeleteItem;
            if (checkTabAccess('documentos', 'edit') && docIdToDelete) { // Use checkTabAccess
                deleteMuralItemConfirm(docIdToDelete);
            } else {
                showNotification('Você não tem permissão para excluir este item.', 'error');
            }
        } else if (window.currentDeleteItemType === 'role') {
            const roleIdToDelete = window.currentDeleteItem;
            if (checkTabAccess('funcionarios', 'edit') && isRoleAllowed(DIRECTOR_ONLY) && roleIdToDelete) {
                deleteRole(roleIdToDelete);
            } else {
                showNotification('Você não tem permissão para excluir cargos.', 'error');
            }
        } else {
            showNotification('Você não tem permissão para realizar esta exclusão.', 'error');
        }
        document.getElementById('modal-confirm-delete').style.display = 'none';
        window.currentDeleteItem = null;
        window.currentDeleteItemType = null;
        updateGlobalSearchDatalist();
    });

    document.getElementById('btn-cancel-delete').addEventListener('click', () => {
        document.getElementById('modal-confirm-delete').style.display = 'none';
        window.currentDeleteItem = null;
        window.currentDeleteItemType = null;
    });

    document.getElementById('form-reassign-schedule').addEventListener('submit', (e) => {
        e.preventDefault();
        saveReassignedSchedule();
    });

    // NEW: Duplicate Client Button Handler
    const btnDuplicateClient = document.getElementById('btn-duplicate-client');
    if (btnDuplicateClient) {
        btnDuplicateClient.addEventListener('click', () => {
            if (!checkTabAccess('cadastro', 'view')) { // Use 'view' as it implies creation access for these roles
                showNotification('Você não tem permissão para cadastrar (e duplicar) clientes.', 'error');
                return;
            }
            duplicateClient(window.currentClientId);
        });
    }

    // NEW: Edit Funcionario Button
    document.getElementById('btn-edit-funcionario').addEventListener('click', () => {
        // Permission check is inside showEditFuncionarioModal
        showEditFuncionarioModal(window.currentFuncionarioId);
    });

    // NEW: Edit Funcionario Form Submit
    document.getElementById('form-editar-funcionario').addEventListener('submit', (e) => {
        e.preventDefault();
        saveFuncionarioChanges();
    });

    // NEW: Edit Password Button
    document.getElementById('btn-edit-funcionario-password').addEventListener('click', () => {
        // Permission check is inside showEditPasswordModal
        showEditPasswordModal(window.currentFuncionarioId);
    });

    document.getElementById('form-edit-password').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            showNotification('As senhas não coincidem.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showNotification('A nova senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        const funcionarioId = window.currentFuncionarioId;
        if (updateUserPassword(funcionarioId, newPassword)) { // Permission check is inside updateUserPassword
            showNotification('Senha atualizada com sucesso!', 'success');
            document.getElementById('modal-edit-password').style.display = 'none';
        } else {
            showNotification('Erro ao atualizar a senha. Usuário não encontrado ou sem permissão.', 'error');
        }
    });

    // NEW: Delete Funcionario Button Handler
    const btnDeleteFuncionario = document.getElementById('btn-delete-funcionario');
    if (btnDeleteFuncionario) {
        btnDeleteFuncionario.addEventListener('click', () => {
            if (!checkTabAccess('funcionarios', 'edit')) { showNotification('Você não tem permissão para excluir funcionários.', 'error'); return; }
            const funcToDelete = db.users.find(u => u.id === parseInt(window.currentFuncionarioId));
            if (!funcToDelete) {
                showNotification('Funcionário não encontrado.', 'error');
                return;
            }
            window.currentDeleteItem = funcToDelete.id;
            window.currentDeleteItemType = 'funcionario';

            const modal = document.getElementById('modal-confirm-delete');
            const message = document.getElementById('delete-confirmation-message');
            message.textContent = `Tem certeza que deseja excluir o funcionário "${funcToDelete.name}"? Todos os agendamentos e pacientes vinculados a ele serão desvinculados. Esta ação é irreversível.`;
            modal.style.display = 'flex';
        });
    }

    // NEW: Add Funcionario Button Handler
    document.getElementById('btn-add-funcionario').addEventListener('click', () => {
        if (!checkTabAccess('funcionarios', 'edit')) { showNotification('Você não tem permissão para adicionar funcionários.', 'error'); return; }
        document.getElementById('form-add-funcionario').reset();
        
        // NEW: Populate the role dropdown for the new user form
        populateNewFuncionarioRoleSelect();
        
        // The container 'new-funcionario-tab-permissions' is for the NEW user being added.
        // It should always be editable, so disableSelfEdit is false here.
        // For a new user, there's no pre-existing role yet to determine defaults, so pass null for userRoleForDefaults
        populateTabPermissions('new-funcionario-tab-permissions', {}, false, null); 

        // Add event listener to show/hide academic fields based on role
        const roleSelect = document.getElementById('new-funcionario-role');
        const academicFields = document.getElementById('new-funcionario-academic-fields');

        const handleRoleChange = () => {
            const selectedRole = roleSelect.value;
            // The academic fields should be shown if the selected role is a professional one,
            // OR if the field is not empty (in case it was pre-filled and the role is not professional).
            // For a new user, the latter condition is less relevant, but it's good practice.
            if (PROFESSIONAL_ROLES.includes(selectedRole)) {
                academicFields.style.display = 'block';
            } else {
                academicFields.style.display = 'none';
            }
            // Also update the permission hints when the role changes
            populateTabPermissions('new-funcionario-tab-permissions', {}, false, selectedRole);
        };

        // Remove previous listener to avoid duplicates if modal is opened multiple times
        roleSelect.removeEventListener('change', handleRoleChange);
        roleSelect.addEventListener('change', handleRoleChange);
        handleRoleChange(); // Call once to set initial visibility

        document.getElementById('modal-add-funcionario').style.display = 'flex';
    });

    document.getElementById('form-add-funcionario').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewFuncionario();
    });

    // NEW: Role Management button
    document.getElementById('btn-manage-roles').addEventListener('click', () => {
        if (!checkTabAccess('funcionarios', 'edit') || !isRoleAllowed(DIRECTOR_ONLY)) {
            showNotification('Você não tem permissão para gerenciar cargos.', 'error');
            return;
        }
        initRolesManagement();
        document.getElementById('modal-manage-roles').style.display = 'flex';
    });

    const clientReportPeriodSelector = document.getElementById('client-report-period');
    if (clientReportPeriodSelector) {
        clientReportPeriodSelector.addEventListener('change', (e) => {
            if (!checkTabAccess('relatorios', 'view')) return; // Check if user has view permission for the tab
            renderClientReport(e.target.value);
        });
    }

    const btnUpdateClientReport = document.getElementById('btn-update-client-report');
    if (btnUpdateClientReport) {
        btnUpdateClientReport.addEventListener('click', () => {
            if (!checkTabAccess('relatorios', 'view')) return; // Check if user has view permission for the tab
            const selectedPeriod = document.getElementById('client-report-period').value;
            renderClientReport(selectedPeriod);
            showNotification('Relatório de clientes atualizado!', 'success');
        });
    }

    document.getElementById('btn-add-daily-note').addEventListener('click', () => {
        if (!checkTabAccess('financeiro', 'edit')) { showNotification('Você não tem permissão para adicionar notas diárias financeiras.', 'error'); return; }
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('daily-note-date').value = today;
        document.getElementById('form-add-daily-note').reset();
        document.getElementById('daily-note-date').value = today;
        document.getElementById('modal-add-daily-note').style.display = 'flex';
    });

    document.getElementById('form-add-daily-note').addEventListener('submit', (e) => {
        e.preventDefault();
        addDailyNote();
    });

    document.getElementById('btn-generate-monthly-report').addEventListener('click', () => {
        if (!checkTabAccess('financeiro', 'view')) { showNotification('Você não tem permissão para gerar relatórios financeiros.', 'error'); return; }
        const selectedPeriod = document.getElementById('financial-period-selector').value ||
                             'current-month';
        document.getElementById('report-period-selector-modal').value = selectedPeriod;
        generateDetailedFinancialReport(selectedPeriod);
        document.getElementById('modal-monthly-report').style.display = 'flex';
    });

    document.getElementById('btn-update-monthly-report').addEventListener('click', () => {
        if (!checkTabAccess('financeiro', 'view')) { showNotification('Você não tem permissão para atualizar relatórios financeiros.', 'error'); return; }
        const selectedPeriod = document.getElementById('report-period-selector-modal').value;
        generateDetailedFinancialReport(selectedPeriod);
        showNotification('Relatório mensal atualizado!', 'success');
    });

    document.getElementById('btn-print-report').addEventListener('click', () => {
        const reportContent = document.getElementById('monthly-report-content');
        if (reportContent) {
            document.getElementById('printable-content').innerHTML = reportContent.innerHTML;
            window.print();
            document.getElementById('printable-content').innerHTML = '';
        }
    });

    document.getElementById('btn-print-employee-report').addEventListener('click', () => {
        const reportContent = document.getElementById('employee-report-content');
        if (reportContent) {
            document.getElementById('printable-content').innerHTML = reportContent.innerHTML;
            window.print();
            document.getElementById('printable-content').innerHTML = '';
        }
    });

    document.getElementById('btn-download-all-notes').addEventListener('click', () => {
        if (!checkTabAccess('financeiro', 'view')) {
            showNotification('Você não tem permissão para baixar notas diárias.', 'error');
            return;
        }
        const selectedPeriod = document.getElementById('financial-period-selector').value;
        downloadDailyNotes(selectedPeriod);
    });

    document.getElementById('btn-add-general-document').addEventListener('click', () => {
        if (!checkTabAccess('documentos', 'edit')) { showNotification('Você não tem permissão para adicionar documentos gerais.', 'error'); return; }
        document.getElementById('form-add-general-document').reset();
        document.getElementById('modal-add-general-document').style.display = 'flex';
    });

    document.getElementById('form-add-general-document').addEventListener('submit', (e) => {
        e.preventDefault();
        addGeneralDocument();
    });

    document.getElementById('btn-add-general-note').addEventListener('click', () => {
        if (!checkTabAccess('documentos', 'edit')) { showNotification('Você não tem permissão para adicionar notas gerais.', 'error'); return; }
        document.getElementById('form-add-general-note').reset();
        document.getElementById('modal-add-general-note').style.display = 'flex';
    });

    document.getElementById('form-add-general-note').addEventListener('submit', (e) => {
        e.preventDefault();
        addGeneralNote();
    });

    // NEW: Meeting Alert functionality
    document.getElementById('btn-add-meeting-alert').addEventListener('click', () => {
        if (!checkTabAccess('documentos', 'edit')) { 
            showNotification('Você não tem permissão para agendar reuniões.', 'error'); 
            return; 
        }
        populateMeetingAttendees();
        document.getElementById('form-add-meeting-alert').reset();
        // Set default date/time for meeting
        const now = new Date();
        const futureTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
        document.getElementById('meeting-alert-date').value = now.toISOString().split('T')[0];
        document.getElementById('meeting-alert-time').value = futureTime.toTimeString().slice(0, 5);

        document.getElementById('modal-add-meeting-alert').style.display = 'flex';
    });

    document.getElementById('form-add-meeting-alert').addEventListener('submit', (e) => {
        e.preventDefault();
        addMeetingAlert();
    });

    // Search and filter for general documents (now handled by renderGeneralDocuments which includes permission checks)
    document.getElementById('search-documents').addEventListener('input', (e) => {
        renderGeneralDocuments(e.target.value, document.getElementById('documents-type-filter').value);
    });

    document.getElementById('documents-type-filter').addEventListener('change', (e) => {
        renderGeneralDocuments(document.getElementById('search-documents').value, e.target.value);
    });

    document.getElementById('search-client-report').addEventListener('input', (e) => {
        if (!checkTabAccess('relatorios', 'view')) return; // Check if user has view permission for the tab
        const selectedPeriod = document.getElementById('client-report-period').value;
        renderClientReport(e.target.value, selectedPeriod);
    });

    document.getElementById('btn-assign-professional-to-client').addEventListener('click', () => {
        if (!checkTabAccess('historico', 'edit') && !checkTabAccess('meus-pacientes', 'edit')) { // Check edit access for client related tabs
            showNotification('Você não tem permissão para vincular profissionais.', 'error');
            return;
        }
        showAssignProfessionalModal(window.currentClientId);
    });

    document.getElementById('form-assign-professional').addEventListener('submit', (e) => {
        e.preventDefault();
        assignProfessionalToClient();
    });

    const btnUnassignProfessional = document.getElementById('btn-unassign-professional');
    if (btnUnassignProfessional) { // Check if the element exists before adding listener
        btnUnassignProfessional.addEventListener('click', () => {
            if (!checkTabAccess('historico', 'edit') && !checkTabAccess('meus-pacientes', 'edit')) { // Check edit access for client related tabs
                showNotification('Você não tem permissão para desvincular profissionais.', 'error');
                return;
            }
            unassignProfessionalFromClient();
        });
    }
    // NEW: Stock History Shortcut button
    document.getElementById('btn-goto-stock-history').addEventListener('click', () => {
        const historyFilters = document.getElementById('stock-history-filters');
        if (historyFilters) {
            historyFilters.scrollIntoView({ behavior: 'smooth' });
            historyFilters.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.4)';
            historyFilters.style.transition = 'box-shadow 0.3s ease-in-out';
            setTimeout(() => {
                historyFilters.style.boxShadow = 'none';
            }, 1500);
        }
    });

    document.getElementById('btn-print-employee-report').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('btn-update-employee-report').addEventListener('click', () => {
        if (!checkTabAccess('relatorios', 'view')) { return; }
        const selectedPeriod = document.getElementById('employee-report-period-selector').value;
        generateEmployeeReport(window.currentEmployeeReportId, selectedPeriod);
        showNotification('Relatório do funcionário atualizado!', 'success');
    });

    // NEW: Generate Client Report Button Handler
    document.getElementById('btn-generate-client-report').addEventListener('click', () => {
        showClientReportModal(window.currentClientId);
    });

    // NEW: Client Report Modal Listeners
    document.getElementById('btn-update-client-report-modal').addEventListener('click', () => {
        const selectedPeriod = document.getElementById('client-report-period-selector-modal').value;
        generateClientReport(window.currentClientReportId, selectedPeriod);
        showNotification('Relatório do paciente atualizado!', 'success');
    });

    document.getElementById('btn-print-client-report').addEventListener('click', () => {
        const reportContent = document.getElementById('client-report-content');
        if (reportContent) {
            document.getElementById('printable-content').innerHTML = reportContent.innerHTML;
            window.print();
            document.getElementById('printable-content').innerHTML = '';
        }
    });
}

function populateClientSelect() {
    const select = document.getElementById('select-cliente-agenda');
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    
    const currentUser = getCurrentUser();
    let clientsForDropdown = [];

    // If the current user has 'view' access to 'historico' (all clients) or 'meus-pacientes' (their own clients)
    if (checkTabAccess('historico', 'view')) { // If can see all clients, show all
        clientsForDropdown = db.clients;
    } else if (checkTabAccess('meus-pacientes', 'view')) { // Otherwise if can only see own clients, filter
        clientsForDropdown = db.clients.filter(client =>
            client.assignedProfessionalIds && client.assignedProfessionalIds.includes(currentUser.id) // Clients assigned to current user
        );
    } else {
        // If no relevant view access, no clients
        clientsForDropdown = [];
    }

    clientsForDropdown.sort((a, b) => a.name.localeCompare(b.name));

    clientsForDropdown.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.name} (ID: ${client.id})`;
        select.appendChild(option);
    });
}

function populateServiceTypes() {
    const select = document.getElementById('tipo-servico');
    select.innerHTML = '';
    
    Object.entries(serviceNames).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
    });
}

function populateAnamnesisSelect() {
    const select = document.getElementById('select-anamnese');
    select.innerHTML = '';
    
    db.anamnesisTypes.forEach(anamnesis => {
        const option = document.createElement('option');
        option.value = anamnesis.id;
        option.textContent = anamnesis.name;
        select.appendChild(option);
    });
}

async function saveNewSchedule() {
    const clientId = parseInt(document.getElementById('select-cliente-agenda').value);
    const date = document.getElementById('data-agendamento').value;
    const time = document.getElementById('hora-agendamento').value;
    const serviceType = document.getElementById('tipo-servico').value;
    const selectedProfessionalId = document.getElementById('select-assigned-professional').value;
    const observations = document.getElementById('observacoes-agendamento').value;
    const sendEmail = document.getElementById('send-email-confirmation').checked; 
    const currentUser = getCurrentUser();

    if (!clientId || !date || !time || !serviceType) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }

    let assignedToUserId = null;
    let assignedToUserName = null;

    if (selectedProfessionalId) {
        const selectedUser = db.users.find(u => u.id === parseInt(selectedProfessionalId));
        if (selectedUser) {
            assignedToUserId = selectedUser.id;
            assignedToUserName = selectedUser.name;
        }
    } else if (PROFESSIONAL_ROLES.includes(currentUser.role)) { // If current user is a professional, assign to them by default
        assignedToUserId = currentUser.id;
        assignedToUserName = currentUser.name;
    }

    const newSchedule = {
        id: db.nextScheduleId++,
        clientId: clientId,
        date: date,
        time: time,
        serviceType: serviceType,
        observations: observations,
        status: 'agendado',
        assignedToUserId: assignedToUserId,
        assignedToUserName: assignedToUserName
    };

    db.schedules.push(newSchedule);

    // NEW: Create a notification for the assigned professional
    if (assignedToUserId) {
        const client = db.clients.find(c => c.id === clientId);
        if (client) {
            if (!db.notifications) db.notifications = [];
            db.notifications.push({
                id: db.nextNotificationId++,
                userId: assignedToUserId,
                type: 'schedule_assignment',
                title: 'Novo Agendamento',
                message: `Um novo agendamento para o paciente ${client.name} foi atribuído a você.`,
                relatedId: newSchedule.id,
                createdAt: new Date().toISOString(),
                isRead: false
            });
        }
    }

    // Update client's assigned professional if applicable
    if (assignedToUserId && PROFESSIONAL_ROLES.includes(db.users.find(u => u.id === assignedToUserId)?.role) && db.users.find(u => u.id === assignedToUserId)) {
        const client = db.clients.find(c => c.id === clientId);
        if (client) {
            client.assignedProfessionalIds = client.assignedProfessionalIds || [];
            if (!client.assignedProfessionalIds.includes(assignedToUserId)) {
                client.assignedProfessionalIds.push(assignedToUserId);
            }
        }
    }

    saveDb();
    renderSchedule();
    renderCalendar();
    document.getElementById('modal-novo-agendamento').style.display = 'none';
    showNotification('Agendamento criado com sucesso.', 'success');
}

// Function to close create schedule modal
function closeCreateScheduleModal() {
    document.getElementById('modal-novo-agendamento').style.display = 'none';
}

// Function to check notifications (placeholder)
function checkNotifications() {
    // This function will check for notifications when user logs in
    // Implementation depends on your notification system
    console.log('Checking notifications...');
}

// Function to save new attendance (placeholder)
function saveNewAttendance() {
    // Implementation for saving new attendance
    console.log('Saving new attendance...');
}

// Function to save cancellation (placeholder)
function saveCancellation() {
    // Implementation for saving cancellation
    console.log('Saving cancellation...');
}

// Function to save attendance confirmation (placeholder)
function saveAttendanceConfirmation() {
    // Implementation for saving attendance confirmation
    console.log('Saving attendance confirmation...');
}

// Function to add stock item (placeholder)
function addStockItem() {
    // Implementation for adding stock item
    console.log('Adding stock item...');
}

// Function to process stock adjustment (placeholder)
function processStockAdjustment() {
    // Implementation for processing stock adjustment
    console.log('Processing stock adjustment...');
}

// Function to add material selection (placeholder)
function addMaterialSelection(type) {
    // Implementation for adding material selection
    console.log('Adding material selection...', type);
}

// Function to delete mural item confirm (placeholder)
function deleteMuralItemConfirm(id) {
    // Implementation for deleting mural item
    console.log('Deleting mural item:', id);
}

// Function to add new funcionario (placeholder)
function addNewFuncionario() {
    // Implementation for adding new funcionario
    console.log('Adding new funcionario...');
}

// Function to populate new funcionario role select (placeholder)
function populateNewFuncionarioRoleSelect() {
    // Implementation for populating role select
    console.log('Populating role select...');
}

// Function to add general document (placeholder)
function addGeneralDocument() {
    // Implementation for adding general document
    console.log('Adding general document...');
}

// Function to add general note (placeholder)
function addGeneralNote() {
    // Implementation for adding general note
    console.log('Adding general note...');
}

// Function to populate meeting attendees (placeholder)
function populateMeetingAttendees() {
    // Implementation for populating meeting attendees
    console.log('Populating meeting attendees...');
}

// Function to add meeting alert (placeholder)
function addMeetingAlert() {
    // Implementation for adding meeting alert
    console.log('Adding meeting alert...');
}

// Function to render general documents (placeholder)
function renderGeneralDocuments(search, filter) {
    // Implementation for rendering general documents
    console.log('Rendering general documents...', search, filter);
}

// Function to generate employee report (placeholder)
function generateEmployeeReport(id, period) {
    // Implementation for generating employee report
    console.log('Generating employee report...', id, period);
}

// Function to mark notifications as read (placeholder)
function markNotificationsAsRead() {
    // Implementation for marking notifications as read
    console.log('Marking notifications as read...');
}

// Function to update user password (placeholder)
function updateUserPassword(userId, newPassword) {
    // Implementation for updating user password
    console.log('Updating user password...', userId);
    return true; // Return success for now
}
