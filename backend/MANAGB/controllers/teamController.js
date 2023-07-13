var Team = require('../models/team');

exports.team_update = function(req, res) {


    

    Team.findById(req.params._id).updateOne({ users: req.body },
        function(err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json({});
            }
        }
    );


}

exports.team_create = function(req, res) {

    var team = new Team({ name: req.body.name, users: [] })

    team.save(function(err, team) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(team);
        }
    });
}

exports.team_get = function(req, res) {

    Team.findById(req.params._id).populate("users").exec(
        function(err, team) {
            if (err) {
                res.sendStatus(500);
            } else if (team) {
                res.json(team);
            } else {
                res.sendStatus(404);
            }
        });

}