import { Games } from '../../imports/api/games.js';
import { Questions } from '../../imports/api/questions.js';
import { GameQuestions } from '../../imports/api/gameQuestions.js';
import { ErrorLog } from '../../imports/api/errorLog.js';

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
        var continueGame = Games.find({ gameCode: gameCode, active: "Yes" }).fetch();
        var statusNow = continueGame[0].nextQuestionStatus;
        console.log("-----    Status is currently: " + statusNow + "    -----");
        if (statusNow == "live") {
            Session.set("questionStatus", "live");
        } else if (statusNow == "complete") {
            FlowRouter.go("/finalScoreCard");
        }
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
                    Meteor.call('Error.Set', "gamePlay.js", "line 58", err);
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
                    Meteor.call('Error.Set', "gamePlay.js", "line 72", err);
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
    var game_id = gameAnswers[0]._id;
    Session.set("game_id", game_id);
    var status = Session.get("questionStatus");



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
        var status = "live";

        var totalQuestions = gameAnswers[0].numberofQuestions;

        console.log("** -- ** -- ** Total Questions: " + totalQuestions);

        // now increment the currQuestionNo in the db
        Meteor.call('gameQuestions.changeCurrent', gameCode, nextQuestionNo, totalQuestions, function(err, result){
            if (err) {
                showSnackbar("Couldn't move to next Question.", "red");
                Meteor.call('Error.Set', "gamePlay.js", "line 115", err);
            } else if (result == "complete") {
                console.log("Game Complete!");
                Meteor.call('setGameStatus', gameCode, "complete", function(err, result){
                    if (err) {
                        Meteor.call('Error.Set', "gamePlay.js", "line 118", err);
                    }
                });
            } else {
                // now set gameStatus back to 'live'
                Meteor.call('resetPlayerAnswerCount', gameCode, function(err, result){
                    if (err) {
                        showSnackbar("Unable to reset Player Answer Count.", "red");
                        Meteor.call('Error.Set', "gamePlay.js", "line 128", err);
                    } else {
                        showSnackbar("Next Question", "green");
                        Meteor.call('setGameLive', gameCode, status, function(err, result) {
                            if (err) {
                                showSnackbar("Unable to set game live again.", "red");
                                Meteor.call('Error.Set', "gamePlay.js", "line 134", err);
                            }
                        });
                        // Session.set("questionStatus", "live");
                    }
                });
            }
        });
    } else {
        // call and set game for this player to waiting status until all have Answered
        // has to be done through db or can't set it back to live for all at once.
        Meteor.call('setGameLive', gameCode, status, function(err, result){
            if (err) {
                showSnackbar("Unable to change Game to Waiting.", "red");
                Meteor.call('Error.Set', "gamePlay.js", "line 148", err);
            }
        });
    }
}
