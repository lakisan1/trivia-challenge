import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'sendTestEmail' (to) {
        check(to, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to send reminder emails.');
        }

        // console.log(" ---- **** ---- **** -----")
        // console.log("To: " + to);
        // console.log("From: " + from);
        // console.log("Subject: " + subject);
        // console.log(" ---- **** ---- **** -----");

        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        this.unblock();

        return Email.send({
            to: to,
            from: to,
            subject: "Trivia Challenge - Check Email Settings",
            html: "This is an email to check your Trivia Challenge site email SMTP settings."
        });
    },
    'deleteAUser' (usersId) {
        check(usersId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete users from system.');
        }

        Meteor.users.remove({ _id: usersId });
    },
});
