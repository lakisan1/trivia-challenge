import { Categories } from '../imports/api/categories.js';



Meteor.publish('categories', function() {
    return Categories.find({});
});
