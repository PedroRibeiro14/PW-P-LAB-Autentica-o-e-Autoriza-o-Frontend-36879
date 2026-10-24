const express           = require('express');
const { getAll, create, deleteTask } = require('../controllers/task.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken); // protege todas as rotas de tasks

router.get('/',     getAll);
router.post('/',    create);
router.delete('/:id', deleteTask);

module.exports = router;
