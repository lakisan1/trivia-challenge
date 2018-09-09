import { Accounts } from 'meteor/accounts-base';

Template.userInfo.onCreated(function() {
    this.subscribe('allUsers');
});

Template.userInfo.onRendered(function() {

});

Template.userInfo.helpers({
    users: function() {
        return Meteor.users.find({});
    },
    userEmail: function() {
        return this.emails[0].address;
    },
    userRole: function() {
        return this.roles[0];
    }
});

Template.userInfo.events({
    'click .deleteUser' (event) {
        event.preventDefault();

        let userId = this._id;
        console.log("User Id is: " + userId);

        Meteor.call('deleteAUser', userId, function(err, result) {
            if (err) {
                console.log("Error deleting user: " + err);
                showSnackbar("Error Deleting User!", "red");
            } else {
                showSnackbar("User Deleted Successfully!");
            }
        });
    },
    'click .resetPassword' (event) {
        event.preventDefault();

        let userId = this._id;
        console.log("User Id is: " + userId);
        
        Meteor.call('changeUserPass', userId, function(err, result) {
            if (err) {
                // console.log("Error changing user Password to default: " + err);
                showSnackbar("Error Changing Password to Default!", "red");
            } else {
                showSnackbar("Password Set Back to Default!", "green");
            }
        });
    },
});
