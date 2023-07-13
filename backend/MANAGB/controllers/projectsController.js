var Project = require('../models/project');
var User = require('../models/user');

exports.project_list = function(req, res) {
    Project.find().populate("tasks").populate("team")
        .exec(function(err, list_projects) {
            if (err) {
                res.sendStatus(500);
            } else if (list_projects) {
                res.json(list_projects);
            } else {
                res.sendStatus(404);
            }
        });
}