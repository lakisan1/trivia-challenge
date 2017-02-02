import { Categories } from '../../../../imports/api/categories.js';

Template.questionCategories.onCreated(function() {
    this.subscribe("categories");
});

Template.questionCategories.helpers({
    getCategories: function() {
        return Categories.find({});
    },
});

Template.questionCategories.events({
    'mousedown #questionCategories' (event) {
        event.preventDefault();

        var select = this;
        var scroll = select .scrollTop;

        event.target.selected = !event.target.selected;

        setTimeout(function(){select.scrollTop = scroll;}, 0);

        $(select ).focus();
    },
});
