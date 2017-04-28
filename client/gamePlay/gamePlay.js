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
                    // call the games method to update an playersAnswered count, then check
                    // the number of players, against the playersAnswered, and change the
                    // questionStatus flag back to 'live', while updating the next question to
                    // a 'current' status so the game progresses
                    checkAllAnswered();
                }
            });
        } else {
            Meteor.call('game.addPoints', gameCode, "Yes", function(err, result){
                if (err) {
                    showSnackbar("Unable to update score", "red");
                } else {
                    showSnackbar("Correct! Well done.", "green");
                    Session.set("questionStatus", "waiting");
                    checkAllAnswered();
                }
            });
        }

        // console.log("Answer chosen is: " + clickedAns);
    },
});

var checkAllAnswered = function() {
    var gameCode = Session.get("gameCode");
    var gameAnswers = Games.find({ gameCode: gameCode, active: "Yes" }).fetch();

    console.log("No of Players: " + gameAnswers[0].numberOfPlayers + " = Players Answered: " + gameAnswers[0].playersAnswered + " ?");
    if (gameAnswers[0].numberOfPlayers == gameAnswers[0].playersAnswered) {
        // now set gameStatus to "live" again, and change the question with
        // current = "Y" to the next questionNo in the list.

        // get the current questionNo
        var questionInfo = GameQuestions.find({ gameCode: gameCode, currentQuestion: "Y" }).fetch();
        var currQuestionNo = questionInfo[0].questionNo;
        var nextQuestionNo = currQuestionNo + 1;
        console.log("------------------");
        console.log("Changing current question from " + currQuestionNo + " to " + nextQuestionNo);
        console.log("------------------");

        var totalQuestions = gameAnswers[0].numberofQuestions;

        console.log("** -- ** -- ** Total Questions: " + totalQuestions);

        // now increment the currQuestionNo in the db
        Meteor.call('gameQuestions.changeCurrent', gameCode, nextQuestionNo, totalQuestions, function(err, result){
            if (err) {
                showSnackbar("Couldn't move to next Question.", "red");
            } else if (result == "complete") {
                console.log("Game Complete!");
                FlowRouter.go('/displayQuestions');
                // Meteor.call("gameEnd", gameCode);
            } else {
                // now set gameStatus back to 'live'
                Meteor.call('resetPlayerAnswerCount', gameCode, function(err, result){
                    if (err) {
                        showSnackbar("Unable to reset Player Answer Count.", "red");
                        console.log(err);
                    } else {
                        showSnackbar("Next Question", "green");
                        Session.set("questionStatus", "live");
                    }
                });
            }
        });
    } else {

    }
}
