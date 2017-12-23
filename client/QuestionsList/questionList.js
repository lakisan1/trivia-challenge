import { Questions } from '../../imports/api/questions.js';

Template.questionsList.onCreated(function() {
    this.subscribe('questions');
});

Template.questionsList.onRendered(function() {

});

Template.questionsList.helpers({
    myQuestionsList: function() {
        return Questions.find({});
    },
});

Template.questionsList.events({
    'click .deleteQuestion' (event) {
        event.preventDefault();

        let questionId = this._id;

        Meteor.call('question.remove', questionId, function(err, result) {
            if (err) {
                showSnackbar("Error Deleting Question!", "red");
            } else {
                showSnackbar("Deleted Question Successfully!","green");
            }
        });
    },
    'click .editQuestion' (event) {
        event.preventDefault();

        let questionId = this._id;
        console.log("Id clicked for edit: " + questionId);
        Session.set('editQuestionNo', questionId);
        FlowRouter.go('/editQuestion');
    }
});
