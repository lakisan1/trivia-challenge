import { Games } from '../../imports/api/games.js';
import { Questions } from '../../imports/api/questions.js';

Template.gamePlay.onCreated(function() {
    this.subscribe('questions');
    this.subscribe('games');
    var gameCode = Session.get("gameCode");
    var gameQuestions = Games.find({ active: "Yes", gameCode: gameCode }).fetch();
    Session.set("questionsToAsk", gameQuestions.questions);
});

Template.gamePlay.helpers({
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    multChoice: function() {
        var gameCode = Session.get("gameCode");
        var questions = Questions.find({ _id: currentQuestionId });
    },
    currentGameStatus: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ active: "Yes", gameCode: gameCode });
    },
    nextQuestion: function() {
        var gameCode = Session.get("gameCode");
        return Questions.find({  });
    },
});

Template.gamePlay.events({

});
