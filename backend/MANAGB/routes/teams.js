var express = require('express');
var router = express.Router();

var teams_controller = require('../controllers/teamsController');

router.get('', teams_controller.teams_list);

module.exports = router;