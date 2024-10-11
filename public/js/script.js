document
    .getElementById('registerForm')
    .addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        const submitButton = document.querySelector('button[type="submit"]');

        if (!name || !email || !password) {
            messageDiv.style.color = 'red';
            messageDiv.innerText = 'Todos os campos são obrigatórios.';
            return;
        }

        submitButton.disabled = true;
        messageDiv.style.color = 'blue';
        messageDiv.innerText = 'Processando...';

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                messageDiv.style.color = 'green';
                messageDiv.innerText = 'Cadastro realizado com sucesso!';
                document.getElementById('registerForm').reset();
            } else {
                messageDiv.style.color = 'red';
                messageDiv.innerText =
                    data.message || 'Erro ao cadastrar usuário.';
            }
        } catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.innerText = 'Falha na conexão com o servidor.';
        } finally {
            submitButton.disabled = false;
        }
    });
