const router = require('express').Router();
const c = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(c.getProjects).post(c.createProject);
router.route('/:id').get(c.getProject).put(c.updateProject).delete(c.deleteProject);

module.exports = router;
