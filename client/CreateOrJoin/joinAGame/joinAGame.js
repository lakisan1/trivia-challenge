import { Games } from '../../../imports/api/games.js';

Template.joinAGame.onCreated(function() {
    this.subscribe("games");
});


Template.joinAGame.events({
    'click #joinNow' (event) {
        event.preventDefault();

        var joinId = $("#joinWithId").val();
        var joinName = $("#joinWithName").val();
        var joinOwner = $("#joinWithOwner").val();

        if (joinId != '' && joinId != null) {
            // we want to use id if we have it
            console.log('Game ID entered: ' + joinId);
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
                    var gameId = currentGame.gameCode;
                    console.log("Game Id found is: " + gameId);
                    Session.set("gameCode", gameId);
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
function validateGameCode() {
    var gameCode = Session.get("gameCode");
    var currentGame = Games.findOne({ gameCode: gameCode, active: "Yes" });
    console.log(currentGame);
    if (currentGame != null) {
        console.log("Found Active Game!  Success!");
        FlowRouter.go("/gamePlay");
    } else {
        console.log('Did not Find an Active Game! Fail!!!');
    }
}
