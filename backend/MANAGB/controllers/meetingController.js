var Meeting = require('../models/meeting');

exports.meeting_create = function(req, res) {

    var users = req.body.users;
    var duration = req.body.duration;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;

    var meeting = new Meeting({
        users: users,
        duration: duration,
        start_date: start_date,
        end_date: end_date
    })

    meeting.save(function(err, meeting) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(meeting)
        }
    });

}

exports.meeting_remove = function(req, res) {

    Meeting.findById(req.params._id).deleteOne().exec(
        function(err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({});
            }
        }
    )

}

exports.meeting_get = function(req, res) {

    Meeting.findById(req.params._id).populate("users").exec(
        function(err, task) {
            if (err) {
                res.sendStatus(500);
            } else if (task) {
                res.json(task);
            } else {
                res.sendStatus(404);
            }
        });

}