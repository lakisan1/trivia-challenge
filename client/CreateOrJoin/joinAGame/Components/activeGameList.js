import { Games } from '../../../../imports/api/games.js';

Template.activeGameList.onCreated(function() {
    this.subscribe("games");
});

Template.activeGameList.helpers({
    activeGames: function() {
        return Games.find({ active: "Yes" });
    },
});

Template.activeGameList.events({
    "click .joinThisGame" (event) {
        event.preventDefault();

        var game_id = this._id;
        console.log("game id is:" + game_id);

        Meteor.call('game.addPlayers', Meteor.user().username, game_id, function(err, result){
            if (err) {
                showSnackbar("Something went wrong joining the game.", "red");
                Meteor.call('Error.Set', "activeGameList.js", "line 20", err);
            } else {
                showSnackbar("Game Joined!", "green");
                FlowRouter.go("/gamePlay");
            }
        });
    }
});
