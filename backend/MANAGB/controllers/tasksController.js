var Task = require('../models/task');

exports.tasks_list = function(req, res) {
    Task.find()
        .sort({ _id: 1 }).populate("users")
        .exec(function(err, list_tasks) {
            if (err) {
                res.sendStatus(500);
            } else if (list_tasks) {
                res.json(list_tasks);
            } else {
                res.sendStatus(404);
            }
        });
}