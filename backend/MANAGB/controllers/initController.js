var User = require("../models/user");
var Task = require("../models/task");
var Team = require("../models/team");
var Project = require("../models/project");
var async = require('async');

var admins = []

exports.init = function(req, res) {
    User.deleteMany({}, function(err) {
        console.log("Users removed with sucess.");
    });
    Task.deleteMany({}, function(err) {
        console.log("Tasks removed with sucess.");
    });
    Project.deleteMany({}, function(err) {
        console.log("Projects removed with sucess.");
    });
    Team.deleteMany({}, function(err) {
        console.log("Teams removed with sucess.");
    });

    async.series([
        createAdmins,
    ]);

    res.send("Collections have been cleaned and initialized.");

};

function adminCreate(name, password, projects) {
    var admin = new User({ name: name, password: password, admin: true });

    admin.save(function(err) {

        admins.push(admin);

    })
}

function createAdmins(cb) {
    async.parallel([
        function(callback) {
            adminCreate('tiagobadalo', 'Tiagobadalo18', callback);
        },
        function(callback) {
            adminCreate('filipamonteiro', 'Filipamonteiro18', callback);
        }
    ], cb)
}