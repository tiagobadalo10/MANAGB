var express = require('express');
var router = express.Router();

var tasks_controller = require('../controllers/tasksController');

router.get('', tasks_controller.tasks_list);

module.exports = router;