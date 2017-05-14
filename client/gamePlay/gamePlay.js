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
        console.log("User ID:  " + Meteor.userId());
        var player = Meteor.userId();
        var currentlyAnswered = GameQuestions.find({ gameCode: gameCode, currentQuestion: "Y", playersAnswered: { $in: [player] } }).count();
        var continueGame = Games.find({ gameCode: gameCode, active: "Yes" }).fetch();
        console.log("cureently answered " + currentlyAnswered);
        var statusNow = continueGame[0].nextQuestionStatus;
        console.log("status now " + statusNow);
        if (currentlyAnswered > 0 && statusNow != "complete") {
            Session.set("questionStatus", "waiting");
            var questionStatus = Session.get("questionStatus");
            console.log("question status should be: " + questionStatus);
        } else if (currentlyAnswered <= 0 && statusNow != "complete"){
            Session.set("questionStatus", "live");
            var questionStatus = Session.get("questionStatus");
            console.log("question status should be: " + questionStatus);
        } else if (statusNow == "complete"){
            FlowRouter.go("/finalScoreCard");
        }
        return Session.get("questionStatus");
    },
});

Template.activeQuestion.events({
    'click .button-option' (event) {
        event.preventDefault();
        correctAnswerVal = $("#qCorrect").text();
        clickedAns = event.currentTarget.id;
        var questionInfo = GameQuestions.find({ gameCode: gameCode, currentQuestion: "Y" }).fetch();
        var questionNo = questionInfo[0].questionNo;
        console.log("the Question No is: " + questionNo);

        if (clickedAns != 'qCorrect') {
            Meteor.call('game.addPoints', gameCode, "No", function(err, result) {
                if (err){
                    Meteor.call('Error.Set', "gamePlay.js", "line 58", err);
                } else {
                    showSnackbar("Sorry, answer is " + correctAnswerVal, "orange");
                    var correctAnswer = document.getElementById("qCorrect");
                    correctAnswer.classList.add('button-correct');
                    var buttonOptions = document.getElementByClassName('button-option');
                    buttonOptions.classList.add('disabled');
                    setTimeout(function(){
                        Meteor.call('gameQuestion.answered', gameCode, questionNo, function(err, result){
                            if (err) {
                                Meteor.call('Error.Set', "gamePlay.js", "line 67", err);
                            } else {
                                checkAllAnswered();
                            }
                        });
                    }, 3000);
                }
            });
        } else {
            Meteor.call('game.addPoints', gameCode, "Yes", function(err, result){
                if (err) {
                    showSnackbar("Unable to update score", "red");
                    Meteor.call('Error.Set', "gamePlay.js", "line 72", err);
                } else {
                    showSnackbar("Correct! Well done.", "green");
                    var correctAnswer = document.getElementById("qCorrect");
                    correctAnswer.classList.add('button-correct');
                    var buttonOptions = document.getElementByClassName('button-option');
                    buttonOptions.classList.add('disabled');
                    setTimeout(function(){
                        Meteor.call('gameQuestion.answered', gameCode, questionNo, function(err, result){
                            if (err) {
                                Meteor.call('Error.Set', "gamePlay.js", "line 87", err);
                            } else {
                                checkAllAnswered();
                            }
                        });
                    }, 3000);
                }
            });
        }

        // console.log("Answer chosen is: " + clickedAns);
    },
});

var checkAllAnswered = function() {

    // console.log("Made it to checkAllAnswered function.");
    // var correctAnswer = document.getElementById("qCorrect");
    // correctAnswer.classList.remove('button-correct');

    var buttonOptions = document.getElementByClassName('button-option');
    buttonOptions.classList.remove('disabled');

    var gameCode = Session.get("gameCode");
    var gameAnswers = Games.find({ gameCode: gameCode, active: "Yes" }).fetch();
    var game_id = gameAnswers[0]._id;
    Session.set("game_id", game_id);
    var status = "waiting";



    console.log("No of Players: " + gameAnswers[0].numberOfPlayers + " = Players Answered: " + gameAnswers[0].playersAnswered + " ?");
    if (gameAnswers[0].numberOfPlayers <= gameAnswers[0].playersAnswered) {
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
                        Meteor.call('Error.Set', "gamePlay.js", "line 128", err);
                    } else {
                        Meteor.call('setGameLive', gameCode, status, function(err, result) {
                            if (err) {
                                Meteor.call('Error.Set', "gamePlay.js", "line 134", err);
                            }
                        });
                    }
                });
            }
        });
    } else if (gameAnswers[0].playersAnswered <= 0) {
        console.log("!!! *** !!! game tried to move forward on it's own. !!! *** !!!");
        var status = "live";
    } else {
        // call and set game for this player to waiting status until all have Answered
        // has to be done through db or can't set it back to live for all at once.
        Session.set("questionStatus", "waiting");
        Meteor.call('setGameLive', gameCode, status, function(err, result){
            if (err) {
                Meteor.call('Error.Set', "gamePlay.js", "line 148", err);
            }
        });
    }
}
