const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A password deve ter pelo menos 6 caracteres.' });
  }

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) {
    return res.status(409).json({ message: 'Este email já está registado.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  res.status(201).json(user);
}

async function signin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const passwordValida = await bcrypt.compare(password, user.password);
  if (!passwordValida) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
}

async function profile(req, res) {
  const user = await prisma.user.findUnique({
    where:  { id: req.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'Utilizador não encontrado.' });
  }

  res.json(user);
}

module.exports = { signup, signin, profile };
