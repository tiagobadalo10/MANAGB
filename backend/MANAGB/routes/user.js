var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

router.get('/:name', user_controller.user_get);

router.post('/register', user_controller.user_create);

router.post('/authenticate', user_controller.user_authenticate);

router.get('/:name/availability', user_controller.user_availability);

router.post('/:name/availability', user_controller.user_new_unavailable);

module.exports = router;