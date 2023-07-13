var Team = require('../models/team');

exports.teams_list = function(req, res) {

    Team.find()
        .sort({ _id: 1 }).populate("users")
        .exec(function(err, list_teams) {
            if (err) {
                res.sendStatus(500);
            } else if (list_teams) {
                res.json(list_teams);
            } else {
                res.sendStatus(404);
            }
        })
}