var Channel = require('./../models/channel');
var http = require('http');
var request = require('request');
var iconv   = require('iconv');
var env     = require('jsdom').env;
var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "", // Configure HERE
        pass: "" // Configure HERE
    }
});




/*
 * GET home page.
 */



exports.index = function(req, res){
	Channel.find(function(err, channels) {
		if (err) console.log(err);
		res.render('index', { title: 'Welcome', channels : channels });
	});
};

exports._404 = function(req, res)
{
	res.setHeader("HTTP/1.0 404 Not Found", "");
	res.render('404', {title: 'Not Found'});
};

exports.ajax = function(req, res)
{
	var query = req.params.query;
	var ws = req.params.what;
	switch(query)
	{
		case 'programme':
			request({ 
			    uri: "http://tvsmotr.ru/online/" + ws,
			    method: 'GET',
			    encoding: 'binary'
			}, function (error, response, body) {
			        body = new Buffer(body, 'binary');
			        conv = new iconv.Iconv('windows-1251', 'utf8');
			        body = conv.convert(body).toString();
			        
			        env(body, function(errors, window) {
			        	var $ = require('jquery')(window);

			        	var result = {
			        		shortTVP : $('.tvprogramm').html(),
							now      : $('h2').html(),
							fullTVP  : $('.noprogramm').html()
			        	};
			        	res.setHeader('Content-type', 'application/json');
			        	res.send(result);
			        });
			    	
			});
		break;
		default:
		break;
	}
};

exports.contact = function(req, res)
{
	var options = {
		from : "WebSite",
		subject : "Message from Swooosh",
		text : "Name:" + req.body.name + "\nE-mail: " + req.body.email + "\nMessage: " + req.body.message + "\n",
		to: "" // Configure here
	};

	transport.sendMail(options, function(err, response) {

		if (err) {
			res.send({
				_class : 'error',
				message : 'There was an error sending your message. Please try again later.'
			});
			return console.log(err);
		}
		res.send({
			_class : 'success',
			message : 'Thank you. Your message has been sent!'
		});

		transport.close();
	});
	
}
