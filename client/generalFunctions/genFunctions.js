clearFields = function(formIdentifier) {
    switch (formIdentifier) {
        case "emailSetup":
            let warnResponse = Session.get("warnResp");

            if (warnResponse == "Ok") {
                // clear form values
                // console.log("should clear fields.");
                $("#emailUser").val("");
                $("#userPass").val("");
                $("#smtpSrvURL").val("");
                $("#smtpPort").val("");
                // console.log("fields should be clear now.");
                setTimeout(function() {
                    Session.set("warnResp", false);
                }, 500);
                Session.set("EditSettings", false);
            } else {
                return;
            }
            break;
        default:
            console.log("No form identifier sent.");
            break;
    }
}
