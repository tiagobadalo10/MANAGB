var User = require('../models/user');

exports.user_create = function(req, res) {

    var user = new User({ name: req.body.username, password: req.body.password, admin: false });
    user.save(function(err, user) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(user);

        }

    });
}

exports.user_authenticate = function(req, res) {

    User.findOne({ name: req.body.username, password: req.body.password }, function(err, user) {
        if (err) {
            // fail: server error
            res.sendStatus(500);
        } else if (user) {
            // success: user pass matches, 200 OK response with admin status
            res.json({ isAdmin: user.admin });
        } else {
            // fail: wrong user or wrong password
            res.sendStatus(401);
        }
    });
}

exports.user_get = function(req, res) {

    User.where("name").equals(req.params.name).exec(
        function(err, user) {
            if (err) {
                res.sendStatus(500);
            } else if (user) {
                res.json(user[0]);
            } else {
                res.sendStatus(404);
            }
        }
    )
}

exports.user_availability = function(req, res) {

    User.where("name").equals(req.params.name).exec(
        function(err, user) {
            if (err) {
                res.sendStatus(500);
            } else if (user) {
                res.json(user[0].unav_periods);
            } else {
                res.sendStatus(404);
            }
        }
    )
}

exports.user_new_unavailable = function(req, res) {

    User.findOne({ name: req.params.name }, function(err, user) {
        if (err) { res.sendStatus(500); } else if (user) {
            let period = {
                start_time: req.body.start,
                end_time: req.body.end
            }
            user.unav_periods.push(period);
            user.save(function(err) {
                if (err) { res.sendStatus(500);
                    console.log(err); }
                res.json();
            });
        } else { res.sendStatus(404) }
    });
}