var postSignUp = function(userId, info) {
    if (Meteor.users.find().count() > 1) {
        Roles.addUsersToRoles(userId, 'allUsers');
    } else if (Meteor.users.find().count() === 1){
        Roles.addUsersToRoles(userId, 'SuperAdmin');
    }
}

AccountsTemplates.configure({
    postSignUpHook: postSignUp,

    sendVerificationEmail: true,
});

Accounts.emailTemplates.from = 'no-reply@trivia-challenge.org';
Accounts.emailTemplates.siteName = 'Trivia Challenge Sign Up';

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return 'Confirm Your Email Address Please';
    },
    text(user, url) {
        let emailAddress = user.emails[0].address,
          urlWithoutHash = url.replace('#/', ''),
          supportEmail = "no-reply@trivia-challenge.org",
          emailBody = "You recently signed up to play Trivia-Challenge online. \n\n You signed up with " + emailAddress + " . Please confirm your email address.\n\n We will not enroll you in any mailing lists, nor will we ever share you email address or personal information for any reason.\n\n You can confirm your email address by clicking the following link: \n\n " + urlWithoutHash

        return emailBody;
    },
}
