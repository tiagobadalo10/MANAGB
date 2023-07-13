var express = require('express');
var router = express.Router();

var meetings_controller = require('../controllers/meetingsController');

router.get('', meetings_controller.meetings_list);

module.exports = router;