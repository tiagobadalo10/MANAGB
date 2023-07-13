var Task = require('../models/task');
var User = require('../models/user');

exports.task_update = function(req, res) {

    update = { users: req.body.users, progress: req.body.progress, start_date: req.body.start_date, end_date: req.body.end_date }
    Task.findById(req.params._id).updateOne(update,
        function(err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({});
            }
        }
    );
}

exports.task_create = function(req, res) {

    var users = [req.body.user];

    var task = new Task({ name: req.body.task.name, priority: req.body.task.priority, users: users, progress: 0 });

    if (req.body.task.start_date) {
        task.start_date = req.body.task.start_date;
    }
    if (req.body.task.end_date) {
        task.end_date = req.body.task.end_date;
    }

    task.save(function(err, task) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(task)
        }
    });


}

exports.task_remove = function(req, res) {


    Task.findById(req.params._id).deleteOne().exec(
        function(err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({});
            }
        }
    )

}

exports.task_get = function(req, res) {

    Task.findById(req.params._id).populate("users").exec(
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