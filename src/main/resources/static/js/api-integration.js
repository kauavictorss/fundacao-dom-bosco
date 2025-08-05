// API Integration functions for Spring Boot backend

const API_BASE_URL = 'http://localhost:8081';

// Função para cadastrar usuário via API
async function cadastrarUsuarioAPI(dadosUsuario) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        });

        if (response.ok) {
            const resultado = await response.json();
            return { success: true, data: resultado };
        } else {
            const errorData = await response.json();
            console.error('Erro na API:', errorData);
            return { success: false, error: errorData.message || 'Erro ao cadastrar usuário' };
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, error: 'Erro de conexão com o servidor' };
    }
}

// Função para listar usuários ativos via API
async function listarUsuariosAtivosAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario/listar/ativos`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const resultado = await response.json();
            return { success: true, data: resultado };
        } else {
            console.error('Erro ao listar usuários:', response.status);
            return { success: false, error: 'Erro ao listar usuários' };
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, error: 'Erro de conexão com o servidor' };
    }
}

// Função para validar CPF (remove formatação)
function limparCPF(cpf) {
    return cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
}

// Mapeamento dos cargos do frontend para o backend
const CARGO_MAPPING = {
    'director': 'DIRETORIA',
    'coordinator_madre': 'COORDENADOR_MADRE',
    'coordinator_floresta': 'COORDENADOR_FLORESTA',
    'staff': 'FUNCIONARIO',
    'intern': 'ESTAGIARIO',
    'musictherapist': 'MUSICOTERAPEUTA',
    'financeiro': 'FINANCEIRO',
    'receptionist': 'RECEPCIONISTA',
    'psychologist': 'PSICOLOGO',
    'psychopedagogue': 'PSICOPEDAGOGO',
    'speech_therapist': 'FONOAUDIOLOGO',
    'nutritionist': 'NUTRICIONISTA',
    'physiotherapist': 'FISIOTERAPEUTA'
};

export { cadastrarUsuarioAPI, listarUsuariosAtivosAPI, limparCPF, CARGO_MAPPING };
