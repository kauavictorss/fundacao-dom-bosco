// Authentication module
// import { db, saveDb } from './database.js'; // Comentado: Não usaremos mais o DB local.

export let currentUser = null;

// New: Role-based access control helper constants
// These constants define the roles allowed for different features/tabs.
// 'financeiro' is intentionally excluded from all non-financial access groups.

// Roles with access to only Director-specific features (e.g., full stock control)
export const DIRECTOR_ONLY = ['director'];
// Roles with access to only Finance-specific features (e.g., daily financial notes)
export const FINANCE_ONLY = ['financeiro'];
// Roles with combined Director or Finance access (e.g., viewing main financial report)
export const DIRECTOR_OR_FINANCE = ['director', 'financeiro'];
// NEW: Roles with access to stock management features (Director and Finance)
export const STOCK_MANAGERS = ['director', 'financeiro'];
// Roles with Coordinator access and higher (Director included)
export const COORDINATOR_AND_HIGHER = ['director', 'coordinator_madre', 'coordinator_floresta'];
// Roles with access to non-finance operational features (e.g., Client Registration, General Agenda)
// This group explicitly excludes 'financeiro'.
export const NON_FINANCE_ACCESS = ['director', 'coordinator_madre', 'coordinator_floresta', 'staff', 'intern', 'musictherapist', 'receptionist', 'psychologist', 'psychopedagogue', 'speech_therapist', 'nutritionist', 'physiotherapist'];
// All professional roles that can be assigned to clients/schedules, or perform services
export const PROFESSIONAL_ROLES = ['staff', 'intern', 'musictherapist', 'receptionist', 'psychologist', 'psychopedagogue', 'speech_therapist', 'nutritionist', 'physiotherapist'];
// Roles for Director and all professional roles (e.g., 'Meus Pacientes' tab)
export const DIRECTOR_AND_PROFESSIONALS = ['director', ...PROFESSIONAL_ROLES];
// Roles that can view all clients and employees (Director, Coordinators, and Receptionists)
export const ALL_ADMIN_VIEW_CLIENTS_AND_EMPLOYEES = ['director', 'coordinator_madre', 'coordinator_floresta', 'receptionist'];
// New: Roles that can view AND manage ALL schedules (confirm/cancel any schedule)
export const ALL_SCHEDULE_VIEW_EDIT_MANAGERS = ['director', 'coordinator_madre', 'coordinator_floresta', 'receptionist'];
// NEW: Roles that can add/edit/delete general documents and meetings (Director and Coordinators only)
export const DIRECTOR_AND_COORDINATORS_ONLY_DOCUMENTS = ['director', 'coordinator_madre', 'coordinator_floresta'];
// NEW: All users, for tab visibility (e.g. general view for "Mural do Coordenador")
export const ALL_USERS = ['director', 'coordinator_madre', 'coordinator_floresta', 'staff', 'intern', 'musictherapist', 'financeiro', 'receptionist', 'psychologist', 'psychopedagogue', 'speech_therapist', 'nutritionist', 'physiotherapist'];

/* FUNÇÃO DE LOGIN ANTIGA - BASEADA NO LOCALSTORAGE
export function login(username, password) {
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}
*/

// NOVA FUNÇÃO DE LOGIN - PREPARADA PARA API
// Esta função agora é assíncrona para lidar com a chamada de rede.
export async function login(username, password) {
    try {
        // TODO: Este endpoint precisa ser criado no backend Spring Boot.
        // Ele deve aceitar 'username' e 'password' e retornar um token JWT e os dados do usuário.
        const response = await fetch('/login', { // Usando /login como endpoint de autenticação
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // O backend precisa ter uma classe para receber esses dados
        });

        if (!response.ok) {
            // O backend deve retornar um status como 401 para credenciais inválidas
            console.error('Falha no login. Status:', response.status);
            return false;
        }

        const data = await response.json(); // Espera-se uma resposta como { token: 'seu-jwt-token', user: { ... } }

        // Armazena o token e os dados do usuário no localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        currentUser = data.user;

        return true;

    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        return false;
    }
}

export function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken'); // Remove o token ao deslogar
}

export function checkLogin() {
    const token = localStorage.getItem('authToken'); // A sessão agora é validada pela existência do token
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
        currentUser = JSON.parse(storedUser);
        return true;
    }
    return false;
}

export function getCurrentUser() {
    // Se o usuário não estiver em memória, tenta carregar do localStorage
    if (!currentUser && localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    return currentUser;
}

// New: Role-based access control helper
export function isRoleAllowed(allowedRoles) {
    const user = getCurrentUser();
    if (!user) return false;
    // allowedRoles can be a single string or an array of strings
    if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
}

// -------------------------------------------------------------------------------------
// IMPORTANTE: A LÓGICA DE PERMISSÕES ABAIXO PRECISA SER MIGRADADA PARA O BACKEND.
// O frontend não deve mais ter conhecimento de todas as regras de negócio e permissões.
// O ideal é que o backend informe quais abas/funcionalidades o usuário pode acessar.
// As funções abaixo estão comentadas para evitar erros, pois 'db.roles' não existe mais.
// -------------------------------------------------------------------------------------

// TODO: Esta função precisa ser recriada para chamar um endpoint da API para checar permissões.
// Por enquanto, vamos retornar 'true' para não quebrar a UI, mas isso deve ser implementado no backend.
export function checkTabAccess(tabId, requiredAccess = 'view', user = getCurrentUser()) {
    if (!user) return false;
    console.warn(`A verificação de acesso para a aba '${tabId}' está retornando 'true' por padrão. A lógica real precisa ser implementada no backend.`);
    return true;
}

// TODO: Esta função também precisa ser refeita.
export function hasEditAccess(tabId) {
    return checkTabAccess(tabId, 'edit');
}

// TODO: Esta função deve chamar um endpoint PUT para '/usuario/atualizar/senha' ou algo similar.
export async function updateUserPassword(userId, newPassword) {
    console.warn('A função updateUserPassword precisa ser conectada a um endpoint da API.');
    // Exemplo de como seria a chamada fetch:
    /*
    try {
        const response = await fetch(`/usuario/senha`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ userId, newPassword })
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return false;
    }
    */
    return false; // Retornando false por padrão
}