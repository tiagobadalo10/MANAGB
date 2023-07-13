var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: true, minlength: 3 },
    password: { type: String, required: true, minlength: 8 },
    admin: { type: Boolean, required: true },
    unav_periods: [{
        start_time: Date,
        end_time: Date
    }]
})

UserSchema.virtual('url').get(function() {
    return '/user/' + this.name;
});



module.exports = mongoose.model('User', UserSchema);