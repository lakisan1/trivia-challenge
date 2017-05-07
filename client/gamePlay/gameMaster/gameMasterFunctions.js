import { GameQuestions } from '../../../imports/api/gameQuestions.js';
import { Games } from '../../../imports/api/games.js';

Template.displayQuestions.onCreated(function() {
    this.subscribe('gameQuestions');
    this.subscribe('games');
});

endGameFunc = function(gameCode) {
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
