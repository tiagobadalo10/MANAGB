var express = require('express');
var router = express.Router();

var team_controller = require('../controllers/teamController');

router.put('/:_id', team_controller.team_update);

router.post('', team_controller.team_create);

router.get('/:_id', team_controller.team_get);

module.exports = router;