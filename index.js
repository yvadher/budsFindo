var express   = require('express');
var config  = require('./config');
var http      = require('http');
var util      = require('util');
var path = require('path');
var async = require('async');
var colors  = require('colors');
var mongoose = require('mongoose');
var cors = require('cors');

//Database
var Schema = mongoose.Schema;
const MONGO_URL = 'mongodb://admin:admin@ds113626.mlab.com:13626/budsfindodev';


var topics = new Schema({
		place : String,
		desc : String,
		lat : Number,
		long : Number,
		topics: [
			{
				title : String,
				activePeople: Number,
				desc: String
			}
		]
	},
	{
		collection: 'topics'
	});

var Model = mongoose.model('Model', topics);
mongoose.connect(MONGO_URL);




console.log(('Server time: ').yellow, (new Date()).toString());
require('log-timestamp')(function() { return '[' + new Date() + '] %s' });

let app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));




app.get('/api/getData', function(req,res){

	Model.find({}, function(err, result) {
		if (err) throw err;
		if (result != "") {
			//console.log('Result :' + result);

			var jsonObj = {"result" : "found"};
			console.log("Sending : "+ JSON.stringify(jsonObj));
			res.json(result);

		} else {
			var jsonObj = {"result" : "notFound"};
			console.log("Sending : "+ JSON.stringify(jsonObj));
			res.json(jsonObj);
		};
	});
});

app.post('/api/save', cors(), function(req,res){
	if (req.body){
		console.log(req.body);
		var saveTopicData = new Model(req.body).save(function(err, result) {
					if (err) throw err;
					if(result) {
						var jsonObj = {"result" : "Saved"};
						console.log("Sending : "+ JSON.stringify(jsonObj));
						res.json(jsonObj);
						return;
					}
				});
	}else {
		var jsonObj = {"result" : "NotSaved"};
		console.log("Sending : "+ JSON.stringify(jsonObj));
		res.json(jsonObj);
	};

});

app.post('/api/update', cors(), function(req,res){
	if (req.body){
		console.log(req.body);
		var obj = {"_id": req.body._id};
		console.log("This is what created at same location !!!"+obj);
		var saveTopicData = Model.update({"_id": req.body._id}, req.body,function(err, result) {
					if (err) throw err;
					if(result) {
						var jsonObj = {"result" : "Updated"};
						console.log("Sending : "+ JSON.stringify(jsonObj));
						res.json(jsonObj);
						return;
					}
				});
	}else {
		var jsonObj = {"result" : "NotSaved"};
		console.log("Sending : "+ JSON.stringify(jsonObj));
		res.json(jsonObj);
	};

});




app.get('*', function(req, res) {
	console.log("Sending the index.html");
    res.status(200).sendFile(path.resolve('public/index.html'));
});


app.set('port', (process.env.PORT || 5000));

//MARK::::: HEROKU does not listen in any other port than 5000
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
