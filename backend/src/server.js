require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes  = require('./routes/auth.routes');
const taskRoutes  = require('./routes/task.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/auth',  authRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
