import { Games } from '../../../imports/api/games.js';

Template.challengeGame.onCreated(function() {
    this.subscribe("games");
});

Template.challengeGame.onRendered(function() {
    Session.set("gameType", "challenge");
});

Template.challengeGame.events({
    'click #joinNow' (event) {
        event.preventDefault();

        var joinId = $("#joinWithId").val();
        var joinName = $("#joinWithName").val();
        var joinOwner = $("#joinWithOwner").val();

        if (joinId != '' && joinId != null) {
            // we want to use id if we have it
            // console.log('Game ID entered: ' + joinId);
            Session.set("gameCode", joinId);
            validateGameCode();
        } else if ((joinName != '' && joinName != null) || (joinOwner != '' && joinOwner != null)) {
            // we'll try name if no Id
            if (joinName == '' || joinName == null) {
                // warn this is required
                showSnackbar("You must fill in Game Name.", "red");
            } else if (joinOwner == '' || joinOwner == null) {
                // warn this is required
                showSnackbar("You must fill in Game Owner", "red");
            } else {
                // do what we want to join a Game
                var currentGame = Games.findOne({ addedBy: joinOwner, gameName: joinName, active: "Yes" });
                if (currentGame == null) {
                    showSnackbar("No Active Game for this Name and Owner", "red");
                } else {
                    var gameCode = currentGame.gameCode;
                    var gameId = currentGame._id;
                    // console.log("Game code found is: " + gameCode);
                    Session.set("gameCode", gameCode);
                    Session.set("gameId", gameId);
                    validateGameCode();
                }
            }
        } else {
            // we warn that at least 1 field is required.
            showSnackbar("At least Game ID or Game Name must be filled in.", "red");
        }
    }
});

// create a function to validate that the Game code is good before sending
// the user to the game view.
validateGameCode = function() {
    var gameCode = Session.get("gameCode");
    var gameId = Session.get("gameId");
    var currentGame = Games.findOne({ gameCode: gameCode, active: "Yes" });
    // console.log(currentGame);
    if (currentGame != null) {
        var gameId = currentGame._id;
        // console.log("GAME ID is " + gameId);
        // console.log("Found Active Game!  Success!");
        Meteor.call('game.addPlayers', Meteor.user().username, gameId, function(err, result){
            if (err) {
                showSnackbar("Something went wrong joining the game.", "red");
                Meteor.call('Error.Set', "joinAGame.js", "line 61", err);
            } else {
                showSnackbar("Game Joined!", "green");
                FlowRouter.go("/gamePlay");
            }
        });
    } else {
        showSnackbar("Unable to find an Active Game!", "red");
        // console.log('Did not Find an Active Game! Fail!!!');
    }
}
