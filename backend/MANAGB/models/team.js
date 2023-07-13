var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: { type: String, required: true, minlength: 4 },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

TeamSchema.virtual('url').get(function() {
    return '/team/' + this.name;
});


module.exports = mongoose.model('Team', TeamSchema);