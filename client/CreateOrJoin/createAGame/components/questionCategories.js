import { Categories } from '../../../../imports/api/categories.js';

Template.questionCategories.onCreated(function() {
    this.subscribe("categories");
});

Template.questionCategories.helpers({
    getCategories: function() {
        return Categories.find({});
    },
});
