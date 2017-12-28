import { EmailSetup } from '../../../imports/api/emailSetup.js';

Template.emailSetup.onCreated(function() {
    this.subscribe("emailSetup");
});

Template.emailSetup.onRendered(function() {
    // get an active email setup
    Session.set("editSettings", false);
});

Template.emailSetup.helpers({
    emailSettings: function() {
        let emailIsSetup = EmailSetup.find({}).count();
        if (emailIsSetup > 0) {
            Session.set("editSettings", true);
            // console.log("Edit Settings: true");
            return EmailSetup.find({});
        } else {
            // try again
            Session.set("editSettings", false);
            return false;
        }

    },
    editSettings: function() {
        let editSettingsSet = Session.get("editSettings");
        return editSettingsSet;
    },
});

Template.emailSetup.events({
    'click #saveEmailSetup, click #updateEmailSetup' (event) {
        event.preventDefault();

        let editMode = Session.get("editSettings");

        // let editId = this._id; // Session.get("SettingsId");
        let emailUser = $("#emailUser").val();
        let emailPass = $("#userPass").val();
        let emailSrv = $("#smtpSrvURL").val();
        let emailPort = $("#smtpPort").val();

        if (editMode == true) {
            let emailSet = EmailSetup.findOne({});
            var editId = emailSet._id;

            // update existing active email settings
            Meteor.call('emailSettings.change', editId, emailUser, emailPass, emailSrv, emailPort, function(err, result) {
                if (err) {
                    // console.log("Error updating email settings: " + err);
                    showSnackbar("Error Updating Email Settings!", "red");
                } else {
                    Session.set("NoEmailSet", false);
                    showSnackbar("Email Settings Updated!", "green");
                    let msgSettings = EmailSetup.findOne({});
                    Meteor.call('setEmailFromServer', msgSettings);
                }
            });
        } else {
            // add new active email settings
            Meteor.call("emailSettings.add", emailUser, emailPass, emailSrv, emailPort, function(err, result) {
                if (err) {
                    // console.log("Error adding email settings: " + err);
                    showSnackbar("Error Updatingn Email Settings", "red");
                } else {
                    Session.set("NoEmailSet", false);
                    showSnackbar("Email Settings Added!", "green");
                    let msgSettings = EmailSetup.findOne({});
                    Meteor.call('setEmailFromServer', msgSettings);
                }
            });
        }
    },
    'click #cancelEmailSetup' (event) {
        event.preventDefault();
        Session.set("formId", "emailSetup");
        warningModal("Warning - Potential Data Loss!", "If you continue, any entered data not already saved, will be lost.");
    },
    'click #testEmailSetup' (event) {
        event.preventDefault();

        let toPerson = $("#toRecip").val();
        // console.log("Recipient email entered: " + toPerson);

        if (toPerson == "" || toPerson == null) {
            showSnackbar("You Must Enter an Email Address!", "red");
            return;
        } else {
            Meteor.call('sendTestEmail', toPerson, function(err, result) {
                if (err) {
                    // console.log("Error sending test email: " + err);
                    showSnackbar("Error Sending Test Email!", "red");
                } else {
                    showSnackbar("Test Email Sent - Check Your Email!", "green");
                }
            });
        }
    },
});
