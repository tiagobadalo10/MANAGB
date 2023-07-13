var express = require('express');
var router = express.Router();

var project_controller = require('../controllers/projectController');

router.post('', project_controller.project_create);

router.get('/:id', project_controller.project_get);

router.put('/:id', project_controller.project_update);

module.exports = router;