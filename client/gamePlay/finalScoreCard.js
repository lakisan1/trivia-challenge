import { Games } from '../../imports/api/games.js';

Template.finalScoreCard.onCreated(function() {
    this.subscribe('games');
});

Template.finalScoreCard.helpers({
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    teamScore: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ gameCode: gameCode, active: "Yes" });
    },
});
