var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: { type: String, required: true, maxlength: 50 },
    priority: { type: String, enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'], required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    progress: { type: Number, required: true, min: 0 },
    start_date: { type: Schema.Types.Date },
    end_date: { type: Schema.Types.Date },
})

TaskSchema.virtual('url').get(function() {
    return '/task/' + this._id;
});

module.exports = mongoose.model('Task', TaskSchema);