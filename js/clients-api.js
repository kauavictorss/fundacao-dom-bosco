// Exemplo de como adaptar o clients.js para usar a API do Spring Boot
// Este arquivo mostra as modificações necessárias no código existente

import { apiClient, converterClienteParaBackend } from './api-client.js';
import { showNotification } from './ui.js';

// EXEMPLO: Função para cadastrar cliente adaptada para usar a API
export async function cadastrarClienteComAPI(clienteData) {
    try {
        // Converter dados do formato JS para o formato esperado pelo backend
        const clienteParaBackend = converterClienteParaBackend(clienteData);

        // Chamar a API do Spring Boot
        const clienteCadastrado = await apiClient.cadastrarCliente(clienteParaBackend);

        showNotification('Cliente cadastrado com sucesso!', 'success');

        // Atualizar a lista de clientes na tela
        await renderClientListComAPI();

        return clienteCadastrado;

    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        showNotification('Erro ao cadastrar cliente: ' + error.message, 'error');
        throw error;
    }
}

// EXEMPLO: Função para listar clientes adaptada para usar a API
export async function renderClientListComAPI(filter = '', unitFilter = 'all') {
    const clientListContainer = document.getElementById('client-list-container');
    if (!clientListContainer) return;

    try {
        // Mostrar loading
        clientListContainer.innerHTML = '<p>Carregando clientes...</p>';

        // Chamar a API do Spring Boot
        const filtros = {};
        if (filter) filtros.nome = filter;
        if (unitFilter !== 'all') filtros.unidade = unitFilter;

        const clientes = await apiClient.listarClientes(filtros);

        // Renderizar clientes na tela
        clientListContainer.innerHTML = '';

        if (clientes.length === 0) {
            clientListContainer.innerHTML = '<p>Nenhum cliente encontrado.</p>';
            return;
        }

        clientes.forEach(cliente => {
            const card = document.createElement('div');
            card.className = 'client-card';
            card.dataset.clientId = cliente.id;

            const type = cliente.tipoCliente === 'MAIOR_IDADE' ? 'Adulto' : 'Menor';
            const contactInfo = cliente.tipoCliente === 'MAIOR_IDADE' ?
                (cliente.email || 'Sem email') :
                `Pais: ${cliente.telefonePai || ''} / ${cliente.telefoneMae || ''}`;

            const unitMap = {
                'MADRE': 'Clínica Social (Madre)',
                'FLORESTA': 'Neuro (Floresta)'
            };
            const clientUnitDisplay = unitMap[cliente.unidadeAtendimento] || 'N/A';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h3>${cliente.nome} <span style="font-size: 0.8em; color: var(--secondary-color);">(${type})</span></h3>
                    <span style="background: var(--primary-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">ID: ${cliente.id}</span>
                </div>
                <p><strong>Telefone:</strong> ${cliente.telefone || cliente.telefoneMae || 'N/A'}</p>
                <p><strong>CPF:</strong> ${cliente.cpf || 'N/A'}</p>
                <p><strong>Unidade:</strong> ${clientUnitDisplay}</p>
            `;

            card.addEventListener('click', () => {
                showClientDetailsComAPI(cliente.id);
            });

            clientListContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        clientListContainer.innerHTML = '<p>Erro ao carregar clientes.</p>';
        showNotification('Erro ao carregar clientes: ' + error.message, 'error');
    }
}

// EXEMPLO: Função para mostrar detalhes do cliente
export async function showClientDetailsComAPI(clienteId) {
    try {
        const cliente = await apiClient.buscarCliente(clienteId);

        if (!cliente) {
            showNotification('Cliente não encontrado', 'error');
            return;
        }

        // Preencher modal com dados do cliente
        document.getElementById('modal-nome-cliente').innerHTML = `
            ${cliente.nome} 
            <span style="background: var(--primary-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; margin-left: 10px;">ID: ${cliente.id}</span>
        `;

        if (cliente.tipoCliente === 'MAIOR_IDADE') {
            document.getElementById('modal-email-cliente').textContent = cliente.email || 'N/A';
            document.getElementById('modal-telefone-cliente').textContent = cliente.telefone || 'N/A';
            document.getElementById('modal-cpf-cliente').textContent = cliente.cpf || 'N/A';
        } else {
            document.getElementById('modal-email-cliente').textContent = 'N/A (Menor de idade)';
            document.getElementById('modal-telefone-cliente').textContent = `Pais: ${cliente.telefonePai || 'N/A'} / ${cliente.telefoneMae || 'N/A'}`;
            document.getElementById('modal-cpf-cliente').textContent = 'N/A (Menor de idade)';
        }

        document.getElementById('modal-data-nascimento').textContent = cliente.dataNascimento || 'N/A';
        document.getElementById('modal-cep-cliente').textContent = cliente.cep || 'N/A';
        document.getElementById('modal-logradouro-cliente').textContent = cliente.logradouro || 'N/A';
        document.getElementById('modal-numero-cliente').textContent = cliente.numeroEndereco || 'S/N';
        document.getElementById('modal-bairro-cliente').textContent = cliente.bairro || '';
        document.getElementById('modal-cidade-estado-cliente').textContent = `${cliente.cidade || ''} / ${cliente.estado || ''}`;
        document.getElementById('modal-observacoes-cliente').textContent = cliente.observacoesGerais || 'Nenhuma observação.';

        const unitMap = {
            'MADRE': 'Clínica Social (Madre)',
            'FLORESTA': 'Neuro (Floresta)'
        };
        document.getElementById('modal-unidade-cliente').textContent = unitMap[cliente.unidadeAtendimento] || 'N/A';

        // Mostrar modal
        document.getElementById('client-modal').style.display = 'block';

    } catch (error) {
        console.error('Erro ao carregar detalhes do cliente:', error);
        showNotification('Erro ao carregar detalhes do cliente: ' + error.message, 'error');
    }
}

// EXEMPLO: Função para obter agenda do dia
export async function obterAgendaDoDiaComAPI(data = null) {
    try {
        const agenda = await apiClient.obterAgendaDoDia(data);
        return agenda;
    } catch (error) {
        console.error('Erro ao obter agenda do dia:', error);
        showNotification('Erro ao carregar agenda: ' + error.message, 'error');
        return [];
    }
}

// EXEMPLO: Função para criar agendamento
export async function criarAgendamentoComAPI(agendamentoData) {
    try {
        const agendamentoParaBackend = converterAgendamentoParaBackend(agendamentoData);
        const agendamentoCriado = await apiClient.criarAgendamento(agendamentoParaBackend);

        showNotification('Agendamento criado com sucesso!', 'success');
        return agendamentoCriado;

    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        showNotification('Erro ao criar agendamento: ' + error.message, 'error');
        throw error;
    }
}
