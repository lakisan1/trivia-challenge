import { Questions } from '../../imports/api/questions.js';
import { Categories } from '../../imports/api/categories.js';

Template.editQuestion.onCreated(function() {
    this.subscribe("questions");
    this.subscribe("categories");
});

Template.editQuestion.onRendered(function() {

});

Template.editQuestion.helpers({
    thisQuestion: function() {
        let questionId = Session.get("editQuestionNo");
        return Questions.find({ _id: questionId });
    },
    allCategories: function() {
        return Categories.find();
    },
});

Template.editQuestion.events({
    'click #cancelEditQuestion' (event) {
        event.preventDefault();

        FlowRouter.go('/questionsList');
    },
    'click #saveEditQuestion' (event) {
        event.preventDefault();

        let questionId = Session.get('editQuestionNo');
        let questionCat = $("#editCat").val();
        let questionType = $("#editType").val();
        let questionDiff = $("#editDifficulty").val();
        let questionPrivate = $("#editPrivate").val();
        let question = $("#editQuestion").val();

        if (questionType == "multipleChoice") {

            let correctAnswer = $("#correctAnswerEdit").val();
            // get the incorrect Answers
            let incAns1 = $("#incorrectEdit0").val();
            let incAns2 = $("#incorrectEdit1").val();
            let incAns3 = $("#incorrectEdit2").val();

            if (question == "" || question == null) {
                showSnackbar("Question is Required!","red");
                return;
            } else if (correctAnswer == "" || correctAnswer == null) {
                showSnackbar("Correct Answer is Required!", "red");
                return;
            } else if (incAns1 == "" || incAns2 == "" || incAns3 == "" || incAns1 == null || incAns2 == null || incAns3 == null) {
                showSnackbar("All Incorrect Answers must be Filled in!", "red");
                return;
            } else {
                Meteor.call('MCQuestion.update', questionId, questionCat, questionType, questionDiff, questionPrivate, question, correctAnswer, incAns1, incAns2, incAns3, function(err, result) {
                    if (err) {
                        console.log("Error Updating Question: " + err);
                        showSnackbar("Error Updating Question!", "red");
                    } else {
                        showSnackbar("Question Updated Successfully", "green");
                    }
                });
            }
        } else {
            let correctAnswer = $("#correctAnswerTFEdit").val();
            if (question == "" || question == null) {
                showSnackbar("Question is Required!","red");
                return;
            }

            var trueAnswer = $("#trueInfoEdit").val();
            if (correctAnswer == 'false') {
                if (trueAnswer == "" || trueAnswer == null) {
                    showSnackbar("True Answer is Required!", "red");
                    return;
                }
            }

            console.log("All Passed!");
            Meteor.call('TFQuestion.update', questionId, questionCat, questionType, questionDiff, questionPrivate, question, correctAnswer, trueAnswer, function(err, result) {
                if (err) {
                    console.log("Error Updating Question: " + err);
                    showSnackbar("Error Updating Question!", "red");
                } else {
                    showSnackbar("Question Updated Successfully", "green");
                }
            });
        }
        FlowRouter.go('/questionsList');
    }
});
