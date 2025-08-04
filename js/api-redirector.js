// API Redirector - Redireciona URLs para API Node.js quando disponível
const API_BASE_URL = 'http://localhost:3002/api';

// Status da API
let apiStatus = {
    isConnected: false,
    lastCheck: null
};

// Verificar se API está disponível
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            apiStatus.isConnected = true;
            apiStatus.lastCheck = new Date();
            console.log('✅ API Node.js conectada - redirecionamento ativo');
            return true;
        }
    } catch (error) {
        console.log('📁 API offline - usando localStorage');
    }
    apiStatus.isConnected = false;
    return false;
}

// Função para redirecionar chamadas para API quando disponível
window.redirectToApi = async function(endpoint, method = 'GET', data = null) {
    if (!apiStatus.isConnected) {
        return null; // Usar localStorage
    }

    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro na API:', error);
    }

    return null; // Fallback para localStorage
};

// Verificar conexão periodicamente
setInterval(checkApiConnection, 30000); // A cada 30 segundos

// Verificar conexão inicial
checkApiConnection();

// Exportar status da API
window.getApiStatus = () => apiStatus;
