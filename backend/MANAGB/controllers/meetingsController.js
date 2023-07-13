var Meeting = require('../models/meeting');

exports.meetings_list = function(req, res) {
    Meeting.find()
        .sort({ _id: 1 }).populate("users")
        .exec(function(err, list_meetings) {
            if (err) {
                res.sendStatus(500);
            } else if (list_meetings) {
                res.json(list_meetings);
            } else {
                res.sendStatus(404);
            }
        });
}