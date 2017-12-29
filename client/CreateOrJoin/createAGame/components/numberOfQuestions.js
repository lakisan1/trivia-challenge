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
    theGameType: function() {
        return Session.get("gameType");
    },
});

Template.numberOfQuestions.events({
    'click #makeGame' (event) {
        event.preventDefault();
        let gType = Session.get("gameType");
        let countField = $("#numberOfQuestions").val();
        var countAvail = Session.get("countAvail");
        var theQuestions = Session.get("theSeqNo");
        var countEntered = parseInt($("#numberOfQuestions").val());

        if (gType == "allA") {
            if (countAvail < countEntered) {
                $("#numberOfQuestions").val('');
                document.getElementById('numberOfQuestions').style.borderColor = "red";
                showSnackbar("The Number of Questions Entered is Too High!", "red");
            } else if (countField == "" || countEntered == null) {
                showSnackbar("Number of Questions Is Required!", "red");
                return;
            } else {
                getGameQuestions(countEntered, theQuestions);
            }
        } else if (gType == "challenge") {
            if (countField == "" || countField == "null") {
                if (countAvail < 41) {
                    var countEntered = countAvail;
                    console.log("Count = " + countEntered);
                    getGameQuestions(countEntered, theQuestions);
                } else {
                    var countEntered = 40;
                    console.log("Count = " + countEntered);
                    getGameQuestions(countEntered, theQuestions);
                }
            } else {
                if (countAvail < countEntered) {
                    $("#numberOfQuestions").val('');
                    document.getElementById('numberOfQuestions').style.borderColor = "red";
                    showSnackbar("The Number of Questions Entered is Too High!", "red");
                } else if (countAvail > 40 && countEntered > 40) {
                    $("#numbeerOFQuestions").val('');
                    document.getElementById('numberOfQuestions').style.borderColor = "red";
                    showSnackbar("No More than 40 Questions per Game!", "red");
                } else {
                    console.log("Count = " + countEntered);
                    getGameQuestions(countEntered, theQuestions);
                }
            }
        }
    },
});

function getGameQuestions(countEntered, theQuestions) {
    var myQuestionSet = [];
    for (i=0; i<countEntered; i++) {
        randNoSize = theQuestions.length;

        var QuestionIndex = Math.floor((Math.random() * randNoSize));

        var QuestionNo = theQuestions[QuestionIndex];
        // console.log("Question Randomly picked is: " + QuestionNo);

        myQuestionSet.push(QuestionNo);

        // console.log("My Question set is: " + myQuestionSet);

        theQuestions.splice(QuestionIndex, 1);

    }
    writeQuestionsToDB(myQuestionSet, countEntered);
}

function writeQuestionsToDB(myQuestionSet, numOfQs) {
    var gameCode = Session.get("gameCode");
    var gameName = Session.get("gameName");
    var QuestionSet = [];

    for (i=0; i<numOfQs; i++) {
        var questionIdGet = Questions.find({ seqNo: myQuestionSet[i] }).fetch();
        QuestionSet.push(questionIdGet[0]._id);
    }

    Meteor.call('gameQuestions', numOfQs, QuestionSet, gameCode, gameName, function(err, result) {
        if (err) {
            // console.log("Error Writing Questions to Game: " + err);
            showSnackbar("An Error Occurred Adding Questions to Game.", "red");
        } else {
            showSnackbar("Questions added to Game.", "green");
            Meteor.call('addGameQuestions', QuestionSet, gameCode, function(err2, result2) {
                if (err2) {
                    showSnackbar("Error Occurred while Adding Question Set.", "red");
                    Meteor.call('Error.Set', "numberOfQuestions.js", "line 74", err);
                } else {
                    showSnackbar("Game is Ready for Players.", "green");
                    FlowRouter.go('/gameMaster');
                }
            });
        }
    });
}
