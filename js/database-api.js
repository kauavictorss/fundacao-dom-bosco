// Novo database.js que substitui o localStorage pelas APIs Node.js
const API_BASE_URL = 'http://localhost:3002/api';

// Cache local para dados frequentemente acessados
let cache = {
  clients: [],
  appointments: [],
  users: [],
  lastUpdate: null
};

// ========== FUNÇÕES PARA CLIENTES ==========

export async function loadClients(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.nome) params.append('nome', filters.nome);
    if (filters.unidade && filters.unidade !== 'all') params.append('unidade', filters.unidade);

    const response = await fetch(`${API_BASE_URL}/clientes?${params}`);
    if (!response.ok) throw new Error('Erro ao carregar clientes');

    const clients = await response.json();
    cache.clients = clients;
    return clients;
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    return cache.clients; // Retorna cache em caso de erro
  }
}

export async function saveClient(clientData) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar cliente');
    }

    const savedClient = await response.json();

    // Atualizar cache
    await loadClients();

    return savedClient;
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    throw error;
  }
}

export async function getClient(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Erro ao buscar cliente');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return null;
  }
}

export async function deactivateClient(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}/desativar`, {
      method: 'PUT'
    });

    if (!response.ok) throw new Error('Erro ao desativar cliente');

    // Atualizar cache
    await loadClients();

    return true;
  } catch (error) {
    console.error('Erro ao desativar cliente:', error);
    throw error;
  }
}

// ========== FUNÇÕES PARA AGENDAMENTOS ==========

export async function loadAppointments(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.data) params.append('data', filters.data);
    if (filters.clienteId) params.append('clienteId', filters.clienteId);
    if (filters.profissionalId) params.append('profissionalId', filters.profissionalId);
    if (filters.status) params.append('status', filters.status);

    const response = await fetch(`${API_BASE_URL}/agendamentos?${params}`);
    if (!response.ok) throw new Error('Erro ao carregar agendamentos');

    const appointments = await response.json();
    cache.appointments = appointments;
    return appointments;
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    return cache.appointments;
  }
}

export async function getAgendaDia(data = null) {
  try {
    const params = data ? `?data=${data}` : '';
    const response = await fetch(`${API_BASE_URL}/agendamentos/agenda-dia${params}`);

    if (!response.ok) throw new Error('Erro ao carregar agenda do dia');

    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar agenda do dia:', error);
    return [];
  }
}

export async function saveAppointment(appointmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar agendamento');
    }

    const savedAppointment = await response.json();

    // Atualizar cache
    await loadAppointments();

    return savedAppointment;
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    throw error;
  }
}

export async function updateAppointmentStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Erro ao atualizar status');

    // Atualizar cache
    await loadAppointments();

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

export async function assignProfessional(appointmentId, professionalId) {
  try {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${appointmentId}/profissional`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profissionalId: professionalId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao vincular profissional');
    }

    // Atualizar cache
    await loadAppointments();

    return await response.json();
  } catch (error) {
    console.error('Erro ao vincular profissional:', error);
    throw error;
  }
}

export async function deleteAppointment(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao excluir agendamento');

    // Atualizar cache
    await loadAppointments();

    return true;
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    throw error;
  }
}

// ========== FUNÇÕES PARA USUÁRIOS ==========

export async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) throw new Error('Erro ao carregar usuários');

    const users = await response.json();
    cache.users = users;
    return users;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return cache.users;
  }
}

export async function authenticateUser(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Credenciais inválidas');
    }

    const result = await response.json();

    // Salvar usuário logado no localStorage para manter sessão
    localStorage.setItem('currentUser', JSON.stringify(result.user));

    return result.user;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    throw error;
  }
}

// ========== COMPATIBILIDADE COM CÓDIGO EXISTENTE ==========

// Objeto db para compatibilidade com o código existente
export const db = {
  get clients() { return cache.clients; },
  get appointments() { return cache.appointments; },
  get users() { return cache.users; },

  // IDs para compatibilidade
  nextClientId: 1,
  nextAppointmentId: 1,
  nextUserId: 1
};

// Função saveDb para compatibilidade (agora não faz nada, pois dados são salvos na API)
export function saveDb() {
  console.log('Dados automaticamente salvos na API');
}

// Função loadDb para carregar dados iniciais
export async function loadDb() {
  try {
    console.log('🔄 Carregando dados da API...');

    await Promise.all([
      loadClients(),
      loadAppointments(),
      loadUsers()
    ]);

    cache.lastUpdate = new Date();
    console.log('✅ Dados carregados da API com sucesso');

    return true;
  } catch (error) {
    console.error('❌ Erro ao carregar dados da API:', error);

    // Em caso de erro, tentar carregar do localStorage como fallback
    const storedDb = localStorage.getItem('gestaoClientesDb');
    if (storedDb) {
      const parsedDb = JSON.parse(storedDb);
      cache.clients = parsedDb.clients || [];
      cache.appointments = parsedDb.appointments || [];
      cache.users = parsedDb.users || [];
      console.log('📁 Dados carregados do localStorage como fallback');
    }

    return false;
  }
}

// ========== FUNÇÕES DE INICIALIZAÇÃO ==========

// Carregar dados ao importar o módulo
loadDb();

// Função para verificar se API está online
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Exportar para usar em outros módulos
export { cache };
