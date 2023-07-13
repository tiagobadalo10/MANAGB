var express = require('express');
var router = express.Router();

var users_controller = require('../controllers/usersController');

router.get('', users_controller.users_list);

module.exports = router;