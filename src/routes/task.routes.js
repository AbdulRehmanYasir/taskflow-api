const router = require('express').Router();
const c = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(c.getTasks).post(c.createTask);
router.route('/:id').get(c.getTask).put(c.updateTask).delete(c.deleteTask);

module.exports = router;
