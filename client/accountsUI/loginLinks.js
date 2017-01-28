Template.loginLinks.events({
    'click #signIn': () => {
        var signInModal = document.getElementById('signInModal');
        signInModal.style.display = "block";
    },
    'click #signOut': () => {
        Meteor.logout();
    },
})
