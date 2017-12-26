import { Questions } from '../../imports/api/questions.js';

Template.importQuestions.onCreated(function() {
    this.subscribe('questions');
});

Template.importQuestions.onRendered(function() {

});

Template.importQuestions.helpers({

});

Template.importQuestions.events({
    'click #saveImport' (event) {
        event.preventDefault();

        let importType = $("#importType").val();
        let importCat = $("#importCategory").val();
        let importDiff = $("#importDifficulty").val();
        let noImpQuest = $("#noOfQuestionsImport").val();

        if (noImpQuest > 50 ) {
            $("#noOfQuestionsImport").addClass("borderRed");
            showSnackbar("Number of Imported Questions must be less than 50.", "red");
        } else if (noImpQuest < 1) {
            $("noOfQuestionsImport").addClass("borderRed");
            showSnackbar("Number of Imported Questions must be greater than 1.", "red");
        } else {
            // https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple
            let starterAPI = "https://opentdb.com/api.php?";
            let importQuestNoAPI = "amount=" + noImpQuest;


            if (importCat == "" || importCat == null) {
                var importCatAPI = "";
            } else {
                var importCatAPI = "&category=" + importCat;
            }

            if (importDiff == "" || importDiff == null) {
                var importDiffAPI = "";
            } else {
                var importDiffAPI = "&difficulty=" + importDiff;
            }

            if (importType == "" || importType == null) {
                var importTypeAPI = "";
            } else {
                var importTypeAPI = "&type=" + importType;
            }

            // now build the api call URL
            let APICall = starterAPI + importQuestNoAPI + importCatAPI + importDiffAPI + importTypeAPI;
            console.log("API URL = " + APICall);

            Meteor.call('importFrom.opentdb', APICall, function(err, result) {
                if (err) {
                    console.log("Error calling API: " + err);
                    showSnackbar("Error Calling Import API!", "red");
                } else {
                    showSnackbar("API Called Successfully!", "green");
                }
            });
        }
    },
});
