var mongoose = require('mongoose');
//mongoose.connect()

var channelSchema = mongoose.Schema({
	title      : String,
	slug       : String,
	code       : String,
	icon       : String,
	created_at : Date,
	updated_at : Date
});


module.exports = mongoose.model('Channel', channelSchema);
