var express = require('express');
var router = express.Router();

var init_controller = require('../controllers/initController');

router.get('/', init_controller.init);

router.get('', init_controller.init);

module.exports = router;