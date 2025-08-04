// API Client - Substitui o localStorage com chamadas para o backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

// Classe para gerenciar chamadas à API
class ApiClient {

    // ========== CLIENTES ==========

    async cadastrarCliente(clienteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) {
                throw new Error(`Erro ao cadastrar cliente: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            throw error;
        }
    }

    async listarClientes(filtros = {}) {
        try {
            const params = new URLSearchParams();

            if (filtros.nome) params.append('nome', filtros.nome);
            if (filtros.unidade && filtros.unidade !== 'all') params.append('unidade', filtros.unidade);

            const response = await fetch(`${API_BASE_URL}/clientes?${params}`);

            if (!response.ok) {
                throw new Error(`Erro ao listar clientes: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        }
    }

    async buscarCliente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`);

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Erro ao buscar cliente: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            throw error;
        }
    }

    async listarClientesParaAgenda() {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/agenda`);

            if (!response.ok) {
                throw new Error(`Erro ao listar clientes para agenda: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar clientes para agenda:', error);
            throw error;
        }
    }

    async desativarCliente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}/desativar`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error(`Erro ao desativar cliente: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Erro ao desativar cliente:', error);
            throw error;
        }
    }

    // ========== AGENDAMENTOS ==========

    async criarAgendamento(agendamentoData) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agendamentoData)
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar agendamento: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            throw error;
        }
    }

    async obterAgendaDoDia(data = null) {
        try {
            const params = data ? `?data=${data}` : '';
            const response = await fetch(`${API_BASE_URL}/agendamentos/agenda-dia${params}`);

            if (!response.ok) {
                throw new Error(`Erro ao obter agenda do dia: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter agenda do dia:', error);
            throw error;
        }
    }

    async obterAgendaPorCliente(clienteId) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/cliente/${clienteId}`);

            if (!response.ok) {
                throw new Error(`Erro ao obter agenda do cliente: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter agenda do cliente:', error);
            throw error;
        }
    }

    async obterAgendaPorProfissional(profissionalId) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/profissional/${profissionalId}`);

            if (!response.ok) {
                throw new Error(`Erro ao obter agenda do profissional: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter agenda do profissional:', error);
            throw error;
        }
    }

    async obterAgendaPorPeriodo(dataInicio, dataFim) {
        try {
            const params = new URLSearchParams({
                dataInicio: dataInicio,
                dataFim: dataFim
            });

            const response = await fetch(`${API_BASE_URL}/agendamentos/periodo?${params}`);

            if (!response.ok) {
                throw new Error(`Erro ao obter agenda por período: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter agenda por período:', error);
            throw error;
        }
    }

    async atualizarStatusAgendamento(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/${id}/status?status=${status}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            throw error;
        }
    }

    async vincularProfissional(agendamentoId, profissionalId) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/${agendamentoId}/profissional?profissionalId=${profissionalId}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error(`Erro ao vincular profissional: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao vincular profissional:', error);
            throw error;
        }
    }

    async excluirAgendamento(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir agendamento: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
            throw error;
        }
    }

    async listarTiposServico() {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/servicos`);

            if (!response.ok) {
                throw new Error(`Erro ao listar tipos de serviço: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar tipos de serviço:', error);
            throw error;
        }
    }
}

// Instância global do cliente da API
const apiClient = new ApiClient();

// Função auxiliar para converter dados do JS para o formato esperado pelo backend
function converterClienteParaBackend(clienteJS) {
    const tipoCliente = clienteJS.type === 'adult' ? 'MAIOR_IDADE' : 'MENOR_IDADE';

    return {
        nome: clienteJS.name,
        usuario: clienteJS.username || `user_${Date.now()}`,
        senha: clienteJS.password || 'senha123',
        dataNascimento: clienteJS.birthDate,
        genero: clienteJS.gender,
        unidadeAtendimento: clienteJS.unit?.toUpperCase(),
        cep: clienteJS.cep,
        logradouro: clienteJS.address,
        numeroEndereco: clienteJS.number,
        complemento: clienteJS.complement,
        bairro: clienteJS.neighborhood,
        cidade: clienteJS.city,
        estado: clienteJS.state,
        observacoesGerais: clienteJS.observations,
        diagnosticoPrincipal: clienteJS.diagnosticoPrincipal,
        historicoMedico: clienteJS.historicoMedico,
        queixaNeuropsicologica: clienteJS.queixaNeuropsicologica,
        expectativasTratamento: clienteJS.expectativasTratamento,
        tipoCliente: tipoCliente,

        // Campos específicos para maior de idade
        cpf: clienteJS.cpf,
        rg: clienteJS.rg,
        naturalidade: clienteJS.naturalidade,
        cidadeEstado: clienteJS.cidadeEstado,
        estadoCivil: clienteJS.estadoCivil,
        escolaridade: clienteJS.education,
        profissao: clienteJS.profession,
        email: clienteJS.email,
        telefone: clienteJS.phone,
        contatoEmergencia: clienteJS.emergencyContact,

        // Campos específicos para menor de idade
        nomeEscola: clienteJS.schoolName,
        tipoEscola: clienteJS.schoolType,
        anoEscolar: clienteJS.schoolYear,
        nomePai: clienteJS.fatherName,
        idadePai: clienteJS.fatherAge,
        profissaoPai: clienteJS.fatherProfession,
        telefonePai: clienteJS.fatherPhone,
        nomeMae: clienteJS.motherName,
        idadeMae: clienteJS.motherAge,
        profissaoMae: clienteJS.motherProfession,
        telefoneMae: clienteJS.motherPhone,
        responsavelFinanceiro: clienteJS.financialResponsible,
        outroResponsavel: clienteJS.otherResponsible
    };
}

function converterAgendamentoParaBackend(agendamentoJS) {
    return {
        clienteId: agendamentoJS.clientId,
        profissionalId: agendamentoJS.professionalId,
        data: agendamentoJS.date,
        horaInicio: agendamentoJS.startTime,
        horaFim: agendamentoJS.endTime,
        servico: agendamentoJS.service,
        status: agendamentoJS.status?.toUpperCase(),
        unidadeAtendimento: agendamentoJS.unit?.toUpperCase(),
        observacoes: agendamentoJS.notes
    };
}

// Exportar para uso em outros módulos
export { apiClient, converterClienteParaBackend, converterAgendamentoParaBackend };
