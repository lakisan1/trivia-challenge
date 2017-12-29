import { EmailSetup } from '../../imports/api/emailSetup.js';

Template.quickJoin.onCreated(function() {
    this.subscribe('emailSetup');
});

Template.quickJoin.onRendered(function() {
    setTimeout(function() {
        let msgSettings = EmailSetup.findOne({});
        if (typeof msgSettings == 'undefined' || msgSettings == null || msgSettings == "") {
            // add an if user is in role Admin then show this...
            if (Roles.userIsInRole(Meteor.userId(), 'SuperAdmin')) {
                // console.log("Client side didn't find email settings.");
                showSnackbar('You need to add Email Settings!', "red");
            }
        }
    }, 750);
});

Template.quickJoin.events({
    'click #joinGame' (event) {
        event.preventDefault();
        FlowRouter.go('/joinAGame');
    },
    'click #joinChallengeGame' (event) {
        event.preventDefault();
        FlowRouter.go('/challengeGame');
    },
});
