showSnackbar = function(message, color) {
    // console.log("Snackbar Called!");
    // var snackbarText = Session.get("snackbarText");
    // var notificationColor = Session.get("snackbarColor");
    var snackbarNotification = document.getElementById("snackbar");
    snackbarNotification.innerHTML = message;
    snackbarNotification.style.backgroundColor = color;
    snackbarNotification.className = "show";
    setTimeout(function() {
        snackbarNotification.className = snackbarNotification.className.replace("show", "");
    }, 5000);
}
