import { Games } from '../../imports/api/games.js';
import { Questions } from '../../imports/api/questions.js';

Template.gamePlay.onCreated(function() {
    this.subscribe('questions');
    this.subscribe('games');
    var gameCode = Session.get("gameCode");
});

Template.gamePlay.helpers({
    gameCode: function() {
        return gameCode = Session.get("gameCode");
    },
    multChoice: function() {
        var gameCode = Session.get("gameCode");
        var game = Games.findOne({ active: "Yes", gameCode: gameCode });
    },

});

Template.gamePlay.events({

});
