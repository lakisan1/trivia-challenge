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
        var gameType = $("#gameType").val();
        var numOfQs = $("#numberOfQuestions").val();
        var qType = $("#questionType").val();
        var qDifficulty = $("#questionDifficulty").val();
        var qCat = $("#questonCategories").val();

        console.log('game type is ' + gameType);

        if (gameType == '' || gameType == null) {
            showSnackbar("You must choose a Game Type.", "red");
            document.getElementById('gameType').style.borderColor = "red";
        } else {
            $("#gameCodeSpace").append("Game Code is: " + gameCode);
        }

        // need to get all form information

    },
    'click #cancelCreateGame' (event) {

    },
});
