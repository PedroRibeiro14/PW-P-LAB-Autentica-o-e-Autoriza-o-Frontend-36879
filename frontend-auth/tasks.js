const API          = 'http://localhost:3000';
const listaEl      = document.getElementById('lista-tasks');
const msgDiv       = document.getElementById('mensagem');
const nomeEl       = document.getElementById('nome-utilizador');
const inputNova    = document.getElementById('nova-task');
const btnAdicionar = document.getElementById('btn-adicionar');
const btnSair      = document.getElementById('btn-sair');

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

async function pedidoAPI(endpoint, opcoes = {}) {
  const resposta = await fetch(API + endpoint, {
    ...opcoes,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + token,
      ...opcoes.headers,
    },
  });

  if (resposta.status === 401) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    return;
  }

  return resposta;
}

function mostrarMensagem(texto, tipo) {
  msgDiv.textContent = texto;
  msgDiv.className   = 'mensagem ' + tipo;
  setTimeout(() => { msgDiv.className = 'mensagem'; }, 3000);
}

async function carregarPerfil() {
  try {
    const resposta = await pedidoAPI('/auth/profile');
    if (!resposta) return;
    const dados = await resposta.json();
    nomeEl.textContent = dados.name || dados.email;
  } catch (e) {
    console.error('Erro ao carregar perfil:', e);
  }
}

function renderizarTasks(tasks) {
  listaEl.innerHTML = '';

  if (tasks.length === 0) {
    listaEl.innerHTML = '<li class="vazia">Ainda não tens tarefas. Adiciona uma acima!</li>';
    return;
  }

  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span class="task-titulo">${task.title}</span>
      <button class="perigo" data-id="${task.id}">Apagar</button>
    `;
    li.querySelector('button').addEventListener('click', function () {
      apagarTask(task.id);
    });
    listaEl.appendChild(li);
  });
}

async function carregarTasks() {
  listaEl.innerHTML = '<li class="vazia">A carregar...</li>';
  try {
    const resposta = await pedidoAPI('/tasks');
    if (!resposta) return;
    const dados = await resposta.json();
    renderizarTasks(dados);
  } catch (e) {
    mostrarMensagem('Erro ao carregar tarefas.', 'erro');
  }
}

async function criarTask() {
  const titulo = inputNova.value.trim();
  if (!titulo) return;

  btnAdicionar.disabled    = true;
  btnAdicionar.textContent = '...';

  try {
    const resposta = await pedidoAPI('/tasks', {
      method: 'POST',
      body:   JSON.stringify({ title: titulo }),
    });
    if (!resposta) return;

    if (!resposta.ok) {
      const dados = await resposta.json();
      mostrarMensagem(dados.message || 'Erro ao criar tarefa.', 'erro');
      return;
    }

    inputNova.value = '';
    await carregarTasks();
    mostrarMensagem('Tarefa criada!', 'sucesso');

  } catch (e) {
    mostrarMensagem('Erro ao criar tarefa.', 'erro');
  } finally {
    btnAdicionar.disabled    = false;
    btnAdicionar.textContent = 'Adicionar';
  }
}

async function apagarTask(id) {
  if (!confirm('Tens a certeza que queres apagar esta tarefa?')) return;

  try {
    const resposta = await pedidoAPI('/tasks/' + id, { method: 'DELETE' });
    if (!resposta) return;

    if (!resposta.ok) {
      mostrarMensagem('Erro ao apagar tarefa.', 'erro');
      return;
    }

    await carregarTasks();
    mostrarMensagem('Tarefa apagada.', 'sucesso');

  } catch (e) {
    mostrarMensagem('Erro ao apagar tarefa.', 'erro');
  }
}

btnAdicionar.addEventListener('click', criarTask);

inputNova.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') criarTask();
});

btnSair.addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

carregarPerfil();
carregarTasks();
