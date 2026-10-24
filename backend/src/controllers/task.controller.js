const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res) {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
}

async function create(req, res) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'O título é obrigatório.' });
  }

  const task = await prisma.task.create({
    data: { title, userId: req.user.id },
  });

  res.status(201).json(task);
}

async function deleteTask(req, res) {
  const { id } = req.params;

  const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

  if (!task) {
    return res.status(404).json({ message: 'Tarefa não encontrada.' });
  }

  if (task.userId !== req.user.id) {
    return res.status(403).json({ message: 'Não tens permissão para apagar esta tarefa.' });
  }

  await prisma.task.delete({ where: { id: parseInt(id) } });

  res.json({ message: 'Tarefa apagada com sucesso.' });
}

module.exports = { getAll, create, deleteTask };
