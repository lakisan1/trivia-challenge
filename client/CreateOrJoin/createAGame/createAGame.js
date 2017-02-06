import { Games } from '../../../imports/api/games.js';

Template.createAGame.onCreated(function() {
    this.subscribe('games');
})

Template.createAGame.helpers({

});

Template.createAGame.events({
    'click #saveCreateGame' (event) {
        event.preventDefault();
        var gameCode = "";
        // need to generate a unique game number
        var randomString = function(stringLength) {

            var possible = "ABCDE0FGHIJ1KLMNO2PQRST3UVWXY4Zabcd5efghi6jklmn7opqrs8tuvwx9yz0123456789";
            for(var i = 0; i < stringLength; i++) {
                gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log('Game code is: ' + gameCode);
        }
        // call the function above, and pass the length you want for the random string code
        randomString(6);

        // check that certain fields are filled out
        qCat = [];
        var gameName = $("#gameName").val();
        var gameType = $("#gameType").val();
        var numOfQs = parseInt($("#numberOfQuestions").val());
        var qType = $("#questionType").val();
        var qDifficulty = $("#questionDifficulty").val();
        var qCat = $("#questionCategories").val();

        console.log('game type is ' + gameType);
        console.log('question category is + ');
        console.log(qCat);

        // need to add logic to pull the requested number of questions
        // from the questions collection, and add them to the game.
        // in order to avoid duplication, just grab the question ids.





        if (gameType == '' || gameType == null) {
            showSnackbar("You must choose a Game Type.", "red");
            document.getElementById('gameType').style.borderColor = "red";
        } else if (gameName == '' || gameName == null) {
            showSnackbar("You need a Game Name.", "red");
            document.getElementbyId('gameName').style.borderColor = "red";
        } else {
            if (qCat == '' || qCat == null) {
                showSnackbar("You must choose at least one Question Category.", "red");
                document.getElementById('questionCategories').style.borderColor = "red";
            } else {
                $("#gameCodeSpace").append("Game Code is: " + gameCode);
                Meteor.call('newGame.insert', gameType, gameName, numOfQs, qType, qDifficulty, qCat, gameCode, function(err, result) {
                    if (err) {
                        showSnackbar("An error occurred saving the Game.", "red");
                        console.log("Save Error: " + err);
                    } else {
                        showSnackbar("Game Created Successfully!", "green");
                        var clrFormBtn = document.getElementById('clearFormBtn');
                        clrFormBtn.style.display = "block";
                        var saveForm = document.getElementById('saveCreateGame');
                        saveForm.style.display = "none";
                    }
                });
            }
        }
    },
    'click #cancelCreateGame' (event) {
        event.preventDefault();
        document.getElementById("createGameForm").reset();
    },
    'click #clearFormBtn' (event) {
        event.preventDefault();
        document.getElementById("createGameForm").reset();
        var clrFormBtn = document.getElementById('clearFormBtn');
        clrFormBtn.style.display = "none";
        var saveForm = document.getElementById('saveCreateGame');
        saveForm.style.display = "block";
    }
});
