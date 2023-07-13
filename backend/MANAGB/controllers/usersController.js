var User = require('../models/user');

exports.users_list = function(req, res) {

    User.find()
        .sort({ _id: 1 })
        .exec(function(err, list_users) {
            if (err) {
                res.sendStatus(500);
            } else if (list_users) {
                res.json(list_users);
            } else {
                res.sendStatus(404);
            }
        });
}