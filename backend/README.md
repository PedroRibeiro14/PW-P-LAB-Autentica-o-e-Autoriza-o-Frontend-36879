# Backend — Autenticação JWT com Node.js, Express e Prisma

API REST com autenticação JWT, passwords cifradas com bcrypt e rotas protegidas.

## Tecnologias

- Node.js + Express
- Prisma ORM (SQLite)
- JWT (jsonwebtoken)
- bcrypt

## Instalação

```bash
cd backend
npm install
```

## Configuração

Copia o ficheiro de exemplo e preenche as variáveis:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="uma_chave_secreta_muito_segura_muda_isto_em_producao"
PORT=3000
```

## Base de dados

```bash
npx prisma migrate dev --name init
```

## Arrancar o servidor

```bash
npm run dev
```

O servidor fica disponível em `http://localhost:3000`.

---

## Endpoints

### Autenticação (públicos)

| Método | Rota           | Descrição              |
|--------|----------------|------------------------|
| POST   | /auth/signup   | Criar conta            |
| POST   | /auth/signin   | Login — devolve token  |

### Autenticação (protegidos)

| Método | Rota           | Descrição              |
|--------|----------------|------------------------|
| GET    | /auth/profile  | Perfil do utilizador   |

### Tasks (protegidos — requer `Authorization: Bearer <token>`)

| Método | Rota           | Descrição              |
|--------|----------------|------------------------|
| GET    | /tasks         | Listar tarefas         |
| POST   | /tasks         | Criar tarefa           |
| DELETE | /tasks/:id     | Apagar tarefa          |

---

## Exemplos de pedidos

### Signup
```json
POST /auth/signup
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

### Signin
```json
POST /auth/signin
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```
Resposta: `{ "token": "eyJ..." }`

### Criar tarefa (com token)
```
POST /tasks
Authorization: Bearer eyJ...

{ "title": "Estudar JWT" }
```

---

## Estrutura do projeto

```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```
