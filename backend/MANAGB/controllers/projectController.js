var Project = require('../models/project');
var User = require('../models/user');
var Task = require('../models/task');
var Team = require('../models/team');

exports.project_create = function(req, res) {

    var project = new Project();
    project.name = req.body.name;
    project.start_date = req.body.start_date;
    project.acronym = req.body.acronym;
    project.task = [];
    project.team = null;
    if (req.body.end_date) {
        project.end_date = req.body.end_date;
    }

    project.save(function(err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(project);
        }
    });

}

exports.project_get = function(req, res) {

    var id = req.params.id;

    if (id.length == 3) { // acronym
        Project.where("acronym").equals(id).populate("tasks").populate("team")
            .exec(function(err, project) {
                if (err) {
                    res.sendStatus(500);
                } else if (project) {
                    res.json(project[0]);
                } else {
                    res.sendStatus(404);
                }
            })

    } else {

        Project.findById(id)
            .populate("tasks").populate("team")
            .exec(function(err, project) {
                if (err) {
                    res.sendStatus(500);
                } else if (project) {
                    res.json(project);
                } else {
                    res.sendStatus(404);
                }
            });
    }

}


exports.project_update = function(req, res) {

    if (req.body.flag == "delete") {
        Project.findById(req.params.id).updateOne({ team: null },
            function(err, project) {
                if (err) {
                    res.sendStatus(500);
                } else if (project) {
                    res.json({});
                } else {
                    res.sendStatus(404);
                }
            })
    } else {

        if (req.body.project.team != null) { 

            Project.findById(req.params.id).updateOne({ team: req.body.project.team, tasks: req.body.project.tasks },
                function(err, project) {
                    if (err) {
                        res.sendStatus(500);
                    } else if (project) {
                        req.body.project.tasks.forEach(task => {
                            Task.findById(task._id)
                                .exec(function(err, task) {
                                    var new_users = new Array();

                                    Team.findById(req.body.project.team._id).exec(function(err, team) {
                                        new_users = task.users.filter(x => !team.users.includes(x));

                                        Team.findOneAndUpdate({ "_id": req.body.project.team._id }, { "$push": { "users": { "$each": new_users } } })
                                            .exec();
                                    });
                                })
                        });
                        res.json({});
                    } else {
                        res.sendStatus(404);
                    }

                });
        } else {
            Project.findById(req.params.id).updateOne({ tasks: req.body.project.tasks },
                function(err, project) {
                    if (err) {
                        res.sendStatus(500);
                    } else if (project) {
                        res.json({});
                    } else {
                        res.sendStatus(404);
                    }

                });
        }
    }




}