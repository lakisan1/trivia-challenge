import { GameQuestions } from '../../../imports/api/gameQuestions.js';
import { Games } from '../../../imports/api/games.js';

Template.displayQuestions.onCreated(function() {
    this.subscribe('gameQuestions');
    this.subscribe('games');
});

Template.displayQuestions.helpers({
    currentQuestion: function() {
        var gameCode = Session.get("gameCode");
        return GameQuestions.find({ gameCode: gameCode, currentQuestion: "Y" });
    },
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    teamScore: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ gameCode: gameCode, active: "Yes" });
    },
});

Template.displayQuestions.events({
    'click #endGame' (event) {
        event.preventDefault();

        var gameCode = Session.get("gameCode");

        Meteor.call("gameEnd", gameCode, function(err, result){
                if (err) {
                    showSnackbar("Unable to end Game.");
                    Meteor.call('Error.Set', "displayQuestions.js", "line 29", err);
                } else {
                    showSnackbar("Game Over!", "green");
                    FlowRouter.go('/createAGame');
                }
        });
    }
});
