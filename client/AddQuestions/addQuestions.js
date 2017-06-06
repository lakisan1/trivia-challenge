import { Questions } from '../../imports/api/questions.js';
import { Categories } from '../../imports/api/categories.js';

Template.addQuestions.onCreated(function() {
    this.subscribe('questionsCounter');
    this.subscribe('categories');
    Session.set("nextSeqNo", 0);
});

Template.addQuestions.helpers({
    getCategories: function() {
        return Categories.find({});
    },
    getLastQuestionSeq: function() {
        console.log("this user is: " + Meteor.user().username);
        var lastSeqNo = Questions.findOne({}, { sort: { addedOn: -1 }, limit: 1 });
        console.log("lasSeqNo: " + lastSeqNo);
        if (lastSeqNo) {
            console.log("seq no found: ")
            console.log(lastSeqNo.seqNo);
            var nextSeqNo = lastSeqNo.seqNo + 1;
            console.log("Next Seq No: " + nextSeqNo);
            Session.set("nextSeqNo", nextSeqNo);
            return nextSeqNo;
        } else {
            console.log('no seq no found.');
            var nextSeqNo = 0;
            Session.set("nextSeqNo", nextSeqNo);
            return nextSeqNo;
        }
    },
});

Template.addQuestions.events({
    'change #questionTypeEntry' (event) {
        event.preventDefault();
        var typeChosen = $("#questionTypeEntry").val();
        if (typeChosen == "trueFalse") {
            var hideDiv = document.getElementById('answerEntryMC');
            hideDiv.style.display = "none";

            var showDiv = document.getElementById('answerEntryTF');
            showDiv.style.display = "block";
        } else {
            var hideDiv = document.getElementById('answerEntryTF');
            hideDiv.style.display = "none";

            var showDiv = document.getElementById('answerEntryMC');
            showDiv.style.display = "block";
        }
    },
    'change #tFAnswer' (event) {
        event.preventDefault();
        var tfChosen = $("#tFAnswer").val();
        if (tfChosen == 'false') {
            var showTrueAnswerField = document.getElementById('falseAnswerFull');
            showTrueAnswerField.style.display = "block";
        } else {
            var showTrueAnswerField = document.getElementById('falseAnswerFull');
            showTrueAnswerField.style.display = "none";
        }
    },
    'click #saveAddQuestion' (event) {
        event.preventDefault();
        var nextSeqNo = parseInt(Session.get("nextSeqNo"));
        var questionCat = $("#questionCategoryEntry").val();
        var questionDiff = $("#questionDiffEntry").val();
        var questionType = $("#questionTypeEntry").val();
        var private = $("#privateGameQuestion").val();
        var question = $("#mainQuestion").val();
        console.log("Question text: " + question);

        if (questionCat == null) {
            showSnackbar("You must enter a Category for this Question.", "red");
            document.getElementById('questionCategoryEntry').style.borderColor = "red";
        } else if (questionDiff == null) {
            showSnackbar("You must set a difficulty level.", "red");
            document.getElementById('questionDiffEntry').style.borderColor = "red";
        } else if (questionType == null) {
            showSnackbar("You must set a question type.", "red");
            document.getElementById('questionTypeEntry').style.borderColor = "red";
        } else if (question == '' || question == null) {
            showSnackbar("You must enter a question.", "red");
            document.getElementById('mainQuestion').style.borderColor = "red";
        } else {
            if (questionType == 'trueFalse') {
                var tOrF = $("#tFAnswer").val();

                if (tOrF == null) {
                    showSnackbar("You must select either True or False.", "red");
                    document.getElementById('tFAnswer').style.borderColor = "red";
                    return;
                }

                if (tOrF == 'false') {
                    var trueAnswer = $("#trueAnswer").val();
                    if (trueAnswer == null || trueAnswer == '') {
                        showSnackbar("You must enter the Correct Answer.", "red");
                        document.getElementById('trueAnswer').style.borderColor = "red";
                    }
                } else {
                    trueAnswer = question;
                }

                console.log("All Good on TF type.");

                Meteor.call('newQuestionTF.insert', questionCat, questionDiff, questionType, private, question, tOrF, trueAnswer, nextSeqNo, function(err, result) {
                    if (err) {
                        showSnackbar("An Error Occurred while Saving This Question.", "red");
                        Meteor.call('Error.Set', "addQuestions.js", "line 106", err);
                    } else {
                        showSnackbar("Question Added Successfully!", "green");
                        document.getElementById("questionEntryForm").reset();
                        var hideDiv = document.getElementById('answerEntryTF');
                        hideDiv.style.display = "none";
                        var showTrueAnswerField = document.getElementById('falseAnswerFull');
                        showTrueAnswerField.style.display = "none";
                    }
                });



            } else if (questionType == 'multipleChoice') {
                var correctAnswer = $("#correctMCAnswer").val();
                var incorrect1 = $("#incorrectMCAnswer1").val();
                var incorrect2 = $("#incorrectMCAnswer2").val();
                var incorrect3 = $("#incorrectMCAnswer3").val();

                if (correctAnswer == '' || correctAnswer == null) {
                    showSnackbar("You must enter a correct answer.", "red");
                    document.getElementById('correctMCAnswer').style.borderColor = "red";
                }

                if (incorrect1 == null || incorrect1 == '') {
                    showSnackbar("you must enter 3 incorrect answers.", "red");
                    document.getElementById('incorrectMCAnswer1').style.borderColor = "red";
                }

                if (incorrect2 == null || incorrect2 == '') {
                    showSnackbar("you must enter 3 incorrect answers.", "red");
                    document.getElementById('incorrectMCAnswer2').style.borderColor = "red";
                }

                if (incorrect3 == null || incorrect3 == '') {
                    showSnackbar("you must enter 3 incorrect answers.", "red");
                    document.getElementById('incorrectMCAnswer3').style.borderColor = "red";
                }

                Meteor.call('newQuestionMC.insert', questionCat, questionDiff, questionType, private, question, correctAnswer, incorrect1, incorrect2, incorrect3, nextSeqNo, function(err, result) {
                    if (err) {
                        showSnackbar("An Error Occurred while Saving This Question.", "red");
                        Meteor.call('Error.Set', "addQuestions.js", "line 148", err);
                    } else {
                        showSnackbar("Question Added Successfully!", "green");
                        document.getElementById("questionEntryForm").reset();
                        var hideDiv = document.getElementById('answerEntryMC');
                        hideDiv.style.display = "none";
                    }
                });

            }
        }
    },
    'click #cancelAddQuestion' (event) {
        event.preventDefault();

        document.getElementById("questionEntryForm").reset();
        var hideDiv = document.getElementById('answerEntryMC');
        hideDiv.style.display = "none";
        var hideDiv = document.getElementById('answerEntryTF');
        hideDiv.style.display = "none";
        var showTrueAnswerField = document.getElementById('falseAnswerFull');
        showTrueAnswerField.style.display = "none";
    },
});
