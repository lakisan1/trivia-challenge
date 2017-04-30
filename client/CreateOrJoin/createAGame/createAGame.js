import { Games } from '../../../imports/api/games.js';
import { Questions } from '../../../imports/api/questions.js';
import { GameQuestions } from '../../../imports/api/gameQuestions.js';

Template.createAGame.onCreated(function() {
    this.subscribe('games');
    this.subscribe('questions');
    this.subscribe('gameQuestions');
});

Template.creatingGameView.onCreated(function() {
    // findQuestionsMatchingCriteria();
    setTimeout(findQuestionsMatchingCriteria, 2000);
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
        var qType = $("#questionType").val();
        var qDifficulty = $("#questionDifficulty").val();
        var qCat = $("#questionCategories").val();

        Session.set("gameCode", gameCode);
        Session.set("gameName", gameName);
        Session.set("qCat", qCat);
        Session.set("gameType", gameType);
        Session.set("qType", qType);
        Session.set("qDifficulty", qDifficulty);

        // form field validation
        if (gameType == '' || gameType == null) {
            showSnackbar("You must choose a Game Type.", "red");
            document.getElementById('gameType').style.borderColor = "red";
        } else if (gameName == '' || gameName == null) {
            showSnackbar("You need a Game Name.", "red");
            document.getElementById('gameName').style.borderColor = "red";
        } else {
            if (qCat == '' || qCat == null) {
                showSnackbar("You must choose at least one Question Category.", "red");
                document.getElementById('questionCategories').style.borderColor = "red";
            } else {
                console.log("call find questions function.");
                findQuestionsMatchingCriteria();
            }
        }
    },
    'click #cancelCreateGame' (event) {
        event.preventDefault();
        // document.getElementById("createGameForm").reset();
        var qCat = $("#questionCategories").val();
        console.log("Category is: " + qCat);
        var questions = Questions.find({ category: qCat }).fetch();
        console.log(questions);


        FlowRouter.go('/noOfQuestions');
    },
});

function findQuestionsMatchingCriteria() {
    var qType = Session.get("qType");
    console.log("Type = " + qType)
    var qDifficulty = Session.get("qDifficulty");
    console.log("Diff = " + qDifficulty);
    var qCat = Session.get("qCat");
    console.log("Category = " + qCat);

    console.log("Finding Questions to Match Criteria.")

    var theSeqNo = [];
    if (qType == 'mixed' && qDifficulty == 'mixed') {
        console.log("Find Questions mixed set diff and type.");
        var questions = Questions.find({ category: { $in: qCat }}).fetch();
        console.log(questions);
        for (i = 0; i < questions.length; i++) {
            theSeqNo[i] = questions[i].seqNo;
        }
    } else if (qType == 'mixed' && qDifficulty != 'mixed') {
        console.log("Find Questions mixed set type.");
        var questions = Questions.find({ category: { $in: qCat }, difficulty: qDifficulty }).fetch();
        console.log(questions);
        for (i = 0; i < questions.length; i++) {
            theSeqNo[i] = questions[i].seqNo;
        }
    } else if (qDifficulty == 'mixed' && qType != 'mixed') {
        console.log("Find Questions mixed set diff.");
        var questions = Questions.find({ type: qType, category: { $in: qCat }}).fetch();
        console.log(questions);
        for (i = 0; i < questions.length; i++) {
            theSeqNo[i] = questions[i].seqNo;
        }
    } else {
        console.log("Find Questions no mixed sets.");
        var questions = Questions.find({ type: qType, category: { $in: qCat }, difficulty: qDifficulty }).fetch();
        console.log(questions);
        for (i = 0; i < questions.length; i++) {
            theSeqNo[i] = questions[i].seqNo;
        }
    }

    console.log("Questions are: " + theSeqNo);
    Session.set("theSeqNo", theSeqNo);
    if (theSeqNo != []) {
        // lineUpQuestions();
        writeGameToDB();
    } else {
        console.log("seq no did not get any values.");

        // TODO: Add a message that no questions were open.
    }
}

function writeGameToDB() {
    var gameCode = Session.get("gameCode");
    var gameName = Session.get("gameName");
    var gameType = Session.get("gameType");
    var qType = Session.get("qType");
    var qDifficulty = Session.get("qDifficulty");
    var qCat = Session.get("qCat");

    $("#gameCodeSpace").append("Game Code is: " + gameCode);
    Session.set("gameCode", gameCode);
    Session.set("gameName", gameName);
    Meteor.call('newGame.insert', gameType, gameName, qType, qDifficulty, qCat, gameCode, function(err, result) {
        if (err) {
            showSnackbar("An error occurred saving the Game.", "red");
            Meteor.call('Error.Set', "createAGame.js", "line 142", err);
        } else {
            showSnackbar("Game Created Successfully!", "green");
            FlowRouter.go('/noOfQuestions');
        }
    });
}
