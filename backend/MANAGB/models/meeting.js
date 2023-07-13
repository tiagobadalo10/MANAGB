var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    duration: { type: String, required: true, maxlength: 6 },
    start_date: { type: Schema.Types.Date },
    end_date: { type: Schema.Types.Date },
})

MeetingSchema.virtual('url').get(function() {
    return '/meetings';
});

module.exports = mongoose.model('Meeting', MeetingSchema);