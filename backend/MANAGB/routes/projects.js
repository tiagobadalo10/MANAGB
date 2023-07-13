var express = require('express');
var router = express.Router();

var projects_controller = require('../controllers/projectsController');

router.get('/', projects_controller.project_list);


module.exports = router;