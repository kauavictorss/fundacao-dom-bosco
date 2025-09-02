document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    // Função principal de inicialização
    const initializeApp = () => {
        if (appContainer) {
            // Torna o conteúdo principal da aplicação visível
            appContainer.style.display = 'block';
        }

        // Aqui você pode adicionar outras lógicas globais que devem rodar em todas as páginas
        // Por exemplo, verificar a sessão do usuário, carregar dados do usuário no header, etc.
        const logoutButton = document.getElementById('btn-logout');
        if(logoutButton) {
            logoutButton.addEventListener('click', () => {
                // Lógica de logout (ex: limpar sessão e redirecionar)
                // Esta é uma implementação simples. O ideal é invalidar a sessão no backend.
                window.location.href = '/login.html';
            });
        }
    };

    // Executa a inicialização
    initializeApp();
});
