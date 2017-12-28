warningModal = function(headerText, contentText) {
    let warningModalHeader = document.getElementById("warningModalHeader");
    let warningModalText = document.getElementById("warningModalText");
    warningModalHeader.innerHTML = headerText;
    warningModalText.innerHTML = contentText;
    let modalToShow = document.getElementById("warningModal");
    modalToShow.style.display = "block";
}

Template.warningModal.events({
    'click #cancelAfterWarning' (event) {
        event.preventDefault();

        let warningModalPopup = document.getElementById("warningModal");
        warningModalPopup.style.display = "none";
    },
    'click #OkAfterWarning' (event) {
        event.preventDefault();

        Session.set("warnResp", "Ok");
        let formId = Session.get("formId");

        let warningModalPopup = document.getElementById("warningModal");
        warningModalPopup.style.display = "none";
        clearFields(formId);
    },
});
