var express = require('express')
	nba = require('nba')
	http = require('http')
	cheerio = require('cheerio')
	async = require('async')
	request = require('request')
	router = express.Router();

var getTeamStats = function(teamName, callback) {
	nba.ready(function (){
		nba.stats.teamStats(function(err, resp) {
			if(err) return(err);
			for(var i=0; i<resp.length; i++) {
				if(resp[i].teamName === teamName) {
					var teamStats = resp[i];
				}
			}
			callback(teamStats);
		});
	});
}

var getRoster = function(teamName, callback) {
	nba.ready(function () {
		getTeamStats(teamName, function(teamStats) {
			nba.stats.commonTeamRoster({teamId: teamStats.teamId}, function(err, resp) {
				if(err) return(err);
				var roster = resp.commonTeamRoster;
				callback(roster);
			})
		})
	});
}

var getPlayer = function(ID, callback) {
	nba.ready(function () {
		nba.stats.playerInfo({playerId: ID}, function(err, resp) {
			if(err) return(err);
			callback(resp);
		});
	});
}

var assignStarValue = function(roster, callback) {
	async.forEach(roster, function(roster, callback) {
		getPlayer(roster.playerId, function(resp) {
			console.log(resp.playerHeadlineStats[0].pie);
			starPower += resp.playerHeadlineStats[0].pie;
			callback();
		});
	}, function(err) {
		if(err) return(err);
		console.log(starPower);
	});
}

/*getRoster('Oklahoma City Thunder', function(roster) {
	async.forEach(roster, function(roster, callback) {
		getPlayer(roster.playerId, function(resp) {
			console.log(resp.playerHeadlineStats[0].pie);
			starPower += resp.playerHeadlineStats[0].pie;
			callback();
		});
	}, function(err) {
		if(err) return(err);
		console.log(starPower);
	});
});*/

/**********************************EXPORTS*****************************************/

router.route('/teamStats/:teamName')
	
	.get(function(req, res) {
		var teamName = req.params.teamName.split('_').join(' ');
		getTeamStats(teamName, function(teamStats) {
			res.send(teamStats);
		});
	});

router.route('/playerStats/:playeriD')

	.get(function(req, res) {
		getPlayer(req.params.playerName, function(playerStats) {
			res.send(playerStats);
		})
	})

router.route('/roster/:teamName')
	
	.get(function(req, res) {
		var teamName = req.params.teamName.split('_').join(' ');
		getRoster(teamName, function(roster) {
			res.send(roster);
		})
	})


module.exports = router;