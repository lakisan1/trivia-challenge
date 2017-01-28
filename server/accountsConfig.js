var postSignUp = function(userId, info) {
    Roles.addUsersToRoles(userId, 'allUsers');
}

AccountsTemplates.configure({
    postSignUpHook: postSignUp,
});
