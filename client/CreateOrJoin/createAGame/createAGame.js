import { Games } from '../../../imports/api/games.js';
import { Questions } from '../../../imports/api/questions.js';

Template.createAGame.onCreated(function() {
    this.subscribe('games');
    this.subscribe('questions');
});

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

        // first get the highest question number in the system at the time.
        var count = Questions.find({}).count();
        console.log("Number of questions is: " + count);
        var uniqueQuestions = [];
        while (uniqueQuestions.length < numOfQs) {
            var questionToUse = parseInt(Math.floor((Math.random() * count)));
            if (uniqueQuestions.indexOf(questionToUse) == -1) {
                uniqueQuestions.push(questionToUse);
            }
        }

        // TODO: now start making sure the question selected meets the criteria entered
        // by the user in the while loop above as well.

        // figure out how to set 'mixed' in each option so it doesn't get
        // factored into the if statement below.
        
        for (i = 0; i < uniqueQuestions.length; i++) {
            var question = Questions.findOne({ mySeqNo: uniqueQuestions[i] });
            console.log("Question #" + uniqueQuestions[i]);
            if (question.type == qType && question.category == qCat && question.difficulty == qDifficulty) {
                console.log('Question is good');
            } else {
                console.log('Question not good');
                return;
            }
        }


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
                Session.set("gameCode", gameCode);
                Session.set("gameName", gameName);
                Meteor.call('newGame.insert', gameType, gameName, numOfQs, qType, qDifficulty, qCat, gameCode, function(err, result) {
                    if (err) {
                        showSnackbar("An error occurred saving the Game.", "red");
                        console.log("Save Error: " + err);
                    } else {
                        showSnackbar("Game Created Successfully!", "green");
                        FlowRouter.go('/gameMaster');
                    }
                });
            }
        }
    },
    'click #cancelCreateGame' (event) {
        event.preventDefault();
        document.getElementById("createGameForm").reset();
    },
});
