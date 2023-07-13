var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: { type: String, required: true, minlength: 4 },
    acronym: { type: String, required: true, length: 3 },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    start_date: { type: Schema.Types.Date, required: true },
    end_date: { type: Schema.Types.Date },
    team: { type: Schema.Types.ObjectId, ref: "Team" }
})

ProjectSchema.virtual('url').get(function() {
    return '/project/' + this._id;
});

module.exports = mongoose.model('Project', ProjectSchema);