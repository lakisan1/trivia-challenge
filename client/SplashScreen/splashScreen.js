Template.splashScreen.events({
    'click #splashLogin' (event) {
        event.preventDefault();

        var signInModal = document.getElementById('signInModal');
        signInModal.style.display = "block";
    },
});
