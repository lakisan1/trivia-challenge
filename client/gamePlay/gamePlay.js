import { Games } from '../../imports/api/games.js';
import { Questions } from '../../imports/api/questions.js';
import { GameQuestions } from '../../imports/api/gameQuestions.js';

Template.gamePlay.onCreated(function() {
    this.subscribe('questions');
    this.subscribe('games');
    this.subscribe('gameQuestions');
    var gameCode = Session.get("gameCode");
    var gameQuestions = Games.find({ active: "Yes", gameCode: gameCode }).fetch();
    Session.set("questionsToAsk", gameQuestions.questions);
});

Template.gamePlay.onRendered(function() {
    Session.set("questionStatus", "live");
});

Template.gamePlay.helpers({
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    currentGameStatus: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ active: "Yes", gameCode: gameCode });
    },
    nextQuestion: function() {
        var gameCode = Session.get("gameCode");
        return GameQuestions.find({ gameCode: gameCode, currentQuestion: "Y" });
    },
});

Template.activeQuestion.helpers({
    questionStatus: function() {
        return Session.get("questionStatus");
    },
});

Template.gamePlay.events({

});

Template.activeQuestion.events({
    'click .button-option' (event) {
        event.preventDefault();

        clickedAns = event.currentTarget.id;

        if (clickedAns != 'qCorrect') {
            Meteor.call('game.addPoints', gameCode, "No", function(err, result) {
                if (err){
                    showSnackbar("Unable to update score", "red");
                } else {
                    showSnackbar("Sorry, wrong answer!", "orange");
                    Session.set("questionStatus", "waiting");
                }
            });
        } else {
            Meteor.call('game.addPoints', gameCode, "Yes", function(err, result){
                if (err) {
                    showSnackbar("Unable to update score", "red");
                } else {
                    showSnackbar("Correct! Well done.", "green");
                    Session.set("questionStatus", "waiting");
                }
            });
        }

        // console.log("Answer chosen is: " + clickedAns);
    },
})
