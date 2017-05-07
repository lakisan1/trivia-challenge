import { Games } from '../../../imports/api/games.js';

Template.activeGameListMstr.onCreated(function() {
    this.subscribe("games");
});

Template.activeGameListMstr.helpers({
    activeGamesMstr: function() {
        return Games.find({ active: "Yes", addedBy: Meteor.user().username });
    },
});

Template.activeGameListMstr.events({
    "click .startThisGame" (event) {
        event.preventDefault();

        var game_id = this._id;
        console.log("Start Game id is:" + game_id);
        var myGame = Games.find({ _id: game_id }).fetch();
        var gameCode = myGame[0].gameCode;

        Meteor.call('startGame', game_id, function(err, result) {
            if (err) {
                showSnackbar("An error occurred starting the game.", "red");
                Meteor.call('Error.Set', "activeGameListMstr.js", "line 20", err);
            } else {
                Meteor.call('SetCurrentQuestion', gameCode, 1, function(err,result){
                    if (err) {
                        showSnackbar("An error occurred setting start question.", "red");
                        Meteor.call('Error.Set', "gameMaster.js", "line 27", err);
                    } else {
                        showSnackbar("Game Started!", "green");
                        FlowRouter.go('/displayQuestions');
                    }
                });
            }
        });
    }
});
