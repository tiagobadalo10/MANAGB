var express = require('express');
var router = express.Router();

var task_controller = require('../controllers/taskController');

router.put('/:_id', task_controller.task_update);

router.delete('/:_id', task_controller.task_remove);

router.post('', task_controller.task_create);

router.get('/:_id', task_controller.task_get);

module.exports = router;