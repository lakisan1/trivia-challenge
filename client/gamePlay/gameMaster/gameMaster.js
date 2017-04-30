import { Games } from '../../../imports/api/games.js';
import { GameQuestions } from '../../../imports/api/gameQuestions.js';

Template.gameMaster.onCreated(function() {
    this.subscribe("games");
});

Template.gameMaster.onRendered(function() {
    // set the Game Status to 'Waiting' while players / teams
    // join the game.
    console.log("Game should be in 'Waiting' status.");
    var gameCode = Session.get("gameCode");
    Meteor.call('setGameWaiting', gameCode, function(err, result) {
        if (err) {
            showSnackbar("Error setting Game to Waiting...", "red");
            Meteor.call('Error.Set', "gameMaster.js", "line 13", err);
        } else {
            showSnackbar("Game is Waiting for Players", "green");
        }
    });
});

Template.gameMaster.helpers({
    gameName: function() {
        return gameName = Session.get("gameName");
    },
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    playersInfo: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ gameCode: gameCode, active: "Yes" });
    },
});

Template.gameMaster.events({
    'click #cancelStartGame' (event) {
        event.preventDefault();
        console.log("cancel clicked.");
    },
    'click #startGame' (event) {
        event.preventDefault();
        console.log("Start Game clicked.");
        Meteor.call('startGame', gameCode, function(err, result) {
            if (err) {
                showSnackbar("An error occurred starting the game.", "red");
                cMeteor.call('Error.Set', "gameMaster.js", "line 44", err);
            } else {
                Meteor.call('SetCurrentQuestion', gameCode, 1, function(err,result){
                    if (err) {
                        showSnackbar("An error occurred setting start question.", "red");
                        Meteor.call('Error.Set', "gameMaster.js", "line 49", err);
                    } else {
                        showSnackbar("Game Started!", "green");
                        FlowRouter.go('/displayQuestions');
                    }
                });
            }
        });
    }
});
