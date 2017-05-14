import { GameQuestions } from '../../../imports/api/gameQuestions.js';
import { Games } from '../../../imports/api/games.js';

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

startGameFunc = function(game_id, gameCode) {
    Meteor.call('startGame', game_id, function(err, result) {
        if (err) {
            showSnackbar("An error occurred starting the game.", "red");
            cMeteor.call('Error.Set', "gameMaster.js", "line 46", err);
        } else {
            Meteor.call('SetCurrentQuestion', gameCode, 1, function(err,result){
                if (err) {
                    showSnackbar("An error occurred setting start question.", "red");
                    Meteor.call('Error.Set', "gameMaster.js", "line 51", err);
                } else {
                    showSnackbar("Game Started!", "green");
                    FlowRouter.go('/displayQuestions');
                }
            });
        }
    });
}
