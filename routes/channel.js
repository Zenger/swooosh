var Channel = require('./../models/channel');
/*
 * GET users listing.
 */

exports.toIndex = function(req, res)
{
	res.redirect('/');
	return;
};

exports.show = function(req, res){
	
  Channel.findOne({slug: req.params.channel}, function(err, channel) {
		if (err || !channel) res.redirect('/404');
		channel.rscode = channel.code.replace("640", "840"); // resize
		channel.rscode = channel.rscode.replace("<embed", "<embed wmode='opaque'");
		res.render('channel', { title: channel.title + " | Swooosh", channel : channel });
	});
};