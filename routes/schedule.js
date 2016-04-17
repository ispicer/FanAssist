var express = require('express')
	nba = require('nba')
	http = require('http')
	cheerio = require('cheerio')
	async = require('async')
	request = require('request')
	router = express.Router();

var dayGames = function(date, callback) {
	url = 'http://nba.com/gameline/' + date;
	request(url, function(err, resp, html) {
		if(err) return(err);
		if(!err) {
			var $ = cheerio.load(html);
			var games = [];
			$('#nbaSSOuter').filter(function() {
				var data = $(this);
				for(var i=0; i<data[0].children.length - 1; i++) {
					var stuff = $(data[0].children[i]);
					var game = {
						team1: '',
						team2: ''
					}
					var teams = stuff.find('.nbaModTopTeamName').next();
					game.team1 = teams[0].attribs.title;
					game.team2 = teams[1].attribs.title;
					games.push(game);
				}
				callback(games);
			})
		}
	})
}

/**********************************EXPORTS*****************************************/

router.route('/:date')
	
	.get(function(req, res) {
		dayGames(req.params.date, function(games) {
			res.send(games);
		});
	});

module.exports = router;