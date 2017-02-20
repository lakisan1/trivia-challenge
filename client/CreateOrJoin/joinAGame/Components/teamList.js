import { Games } from '../../../../imports/api/games.js';

Template.teamList.onCreated(function() {
    this.subscribe("games");
});

Template.teamList.helpers({
    teamWaiting: function() {
        var gameCode = Session.get("gameCode");
        return Games.find({ gameCode: gameCode });
    },
});
