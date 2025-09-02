document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                alert('Por favor, preencha o usuário e a senha.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usuario: username,
                        senha: password,
                    }),
                });

                if (response.ok) {
                    window.location.href = '/index.html';
                } else {
                    const errorMessage = await response.text();
                    alert(`Erro no login: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Erro ao tentar fazer login:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
        });
    }
});
