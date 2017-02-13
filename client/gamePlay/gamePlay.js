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

    },

});

Template.gamePlay.events({

});
