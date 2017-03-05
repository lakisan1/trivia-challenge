import { Questions } from '../../../../imports/api/questions.js';
import { Games } from '../../../../imports/api/games.js';
import { GameQuestions } from '../../../../imports/api/gameQuestions.js';

Template.numberOfQuestions.onCreated(function () {
    this.subscribe('games');
    this.subscribe('questions');
    this.subscribe('gameQuestions');
})

Template.numberOfQuestions.helpers({
    availNum: function() {
        var availNum = Session.get("theSeqNo");
        var countAvail = availNum.length;
        Session.set("countAvail", countAvail);
        return countAvail;
    },
});

Template.numberOfQuestions.events({
    'click #makeGame' (event) {
        event.preventDefault();

        var countAvail = Session.get("countAvail");
        var theQuestions = Session.get("theSeqNo");
        var countEntered = parseInt($("#numberOfQuestions").val());

        if (countAvail < countEntered) {
            $("#numberOfQuestions").val('');
            document.getElementById('numberOfQuestions').style.borderColor = "red";
            showSnackbar("The Number of Questions Entered is Too High!", "red");
        } else {
            getGameQuestions(countEntered, theQuestions);
        }
    },
});

function getGameQuestions(countEntered, theQuestions) {
    var myQuestionSet = [];
    for (i=0; i<countEntered; i++) {
        randNoSize = theQuestions.length;

        var QuestionIndex = Math.floor((Math.random() * randNoSize));

        var QuestionNo = theQuestions[QuestionIndex];
        console.log("Question Randomly picked is: " + QuestionNo);

        myQuestionSet.push(QuestionNo);

        console.log("My Question set is: " + myQuestionSet);

        theQuestions.splice(QuestionIndex, 1);

    }
    writeQuestionsToDB(myQuestionSet, countEntered);
}

function writeQuestionsToDB(myQuestionSet, numOfQs) {
    var gameCode = Session.get("gameCode");
    var gameName = Session.get("gameName");
    var QuestionSet = [];

    for (i=0; i<numOfQs; i++) {
        var questionIdGet = Questions.find({ mySeqNo: myQuestionSet[i] }).fetch();
        QuestionSet.push(questionIdGet[0]._id);
    }

    Meteor.call('gameQuestions', numOfQs, QuestionSet, gameCode, gameName, function(err, result) {
        if (err) {
            console.log("Error Writing Questions to Game: " + err);
            showSnackbar("An Error Occurred Adding Questions to Game.", "red");
        } else {
            showSnackbar("Questions added to Game.", "green");
            Meteor.call('addGameQuestions', QuestionSet, gameCode, function(err2, result2) {
                if (err2) {
                    console.log("Error occurred adding Question Set: " + err2);
                    showSnackbar("Error Occurred while Adding Question Set.", "red");
                } else {
                    showSnackbar("Game is Ready for Players.", "green");
                    FlowRouter.go('/gameMaster');
                }
            });
        }
    });
}
