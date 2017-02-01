Template.gameTypeSelection.onRendered(function() {
    $("#secondsQuestion").hide();
    $("#minutesGame").hide();
    $("#timeLimit").hide();
    $("#timeLimitType").hide();
});

Template.gameTypeSelection.helpers({

});

Template.gameTypeSelection.events({
    'change #gameType' (event) {
        event.preventDefault();

        var gameType = $("#gameType").val();

        switch (gameType) {
            case "timed":
                $("#minutesGame").show();
                $("#timeLimit").show();
                $("#timeLimitType").hide();
                $("#secondsQuestion").hide();
                break;
            case "allA":
                $("#minutesGame").hide();
                $("#timeLimit").hide();
                $("#timeLimitType").hide();
                $("#secondsQuestion").hide();
                break;
            case "allATimed":
                $("#minutesGame").hide();
                $("#timeLimit").show();
                $("#timeLimitType").show();
                $("#secondsQuestion").hide();
                break;
        }
    },
    'change #timeLimitType' (event) {
        event.preventDefault();

        var timeLimitType = $("#timeLimitType").val();

        switch (timeLimitType) {
            case "timedGame":
                $("#minutesGame").show();
                $("#secondsQuestion").hide();
                break;
            case "timedQuestions":
                $("#minutesGame").hide();
                $("#secondsQuestion").show();
                break;
        }
    }
});
