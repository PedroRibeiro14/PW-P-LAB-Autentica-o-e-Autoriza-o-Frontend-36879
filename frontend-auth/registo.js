const form      = document.getElementById('form-registo');
const msgDiv    = document.getElementById('mensagem');
const btnSubmit = document.getElementById('btn-registar');

const API = 'http://localhost:3000';

function mostrarMensagem(texto, tipo) {
  msgDiv.textContent = texto;
  msgDiv.className   = 'mensagem ' + tipo;
}

form.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'A criar conta...';

  try {
    const resposta = await fetch(API + '/auth/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: nome, email, password }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.message || 'Erro ao criar conta.', 'erro');
      return;
    }

    mostrarMensagem('Conta criada! A redirecionar...', 'sucesso');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);

  } catch (erro) {
    mostrarMensagem('Não foi possível ligar ao servidor.', 'erro');
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = 'Criar conta';
  }
});
