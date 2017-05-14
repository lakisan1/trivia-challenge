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

        // next function --> /client/gamePlay/gameMaster/gameMasterFunctions.js
        endGameFunc(gameCode);
    }
});
