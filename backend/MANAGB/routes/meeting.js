var express = require('express');
var router = express.Router();

var meeting_controller = require('../controllers/meetingController');

router.post('', meeting_controller.meeting_create);

router.delete('/:_id', meeting_controller.meeting_remove);

module.exports = router;