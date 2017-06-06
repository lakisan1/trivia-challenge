import { Questions } from '../../imports/api/questions.js';

Template.printQuestions.onCreated(function() {
    this.subscribe('questions');
});

Template.printQuestions.helpers({
    allQuestions: function() {
        Session.set("sequence", Math.floor((Math.random() * 4) + 1));
        return Questions.find({});
    },
    sequence: function() {
        return Session.get("sequence");
    },
});
