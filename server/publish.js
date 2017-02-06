import { Categories } from '../imports/api/categories.js';
import { Games } from '../imports/api/games.js';
import { Questions} from '../imports/api/questions.js';

Meteor.publish('categories', function() {
    return Categories.find({});
});

Meteor.publish('games', function() {
    return Games.find({ active: "Yes" });
});

Meteor.publish('questions', function() {
    var myUser = Meteor.users.findOne(this.userId).username;
    return Questions.find({ $or: [{ owner: "all" }, { owner: myUser }]});
});

Meteor.publish('questionsCounter', function() {
    return Questions.find({});
});
