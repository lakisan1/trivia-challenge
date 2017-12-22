import { Categories } from '../../imports/api/categories.js';
import { Questions } from '../../imports/api/questions.js';

Template.addCategories.onCreated(function() {
    this.subscribe("categories");
    this.subscribe("questionsCounter");
});


Template.addCategories.helpers({
    getCategories: function() {
        return Categories.find({});
    },
    countQuestions: function() {
        let myCat = this.category;
        console.log("My Cat: " + myCat);
        return Questions.find({ category: myCat }).count();
    },
});

Template.addCategories.events({
    'click #cancelAddCategory' (event) {
        event.preventDefault();

        $("#addCategory").val('');
        $("#addDescription").val('');
    },
    'click #saveCategory' (event) {
        event.preventDefault();

        var catName = $("#addCategory").val();
        var catDesc = $("#addDescription").val();

        if(catName == '') {
            showSnackbar("You must enter a Category Name!", "red");
        } else {
            Meteor.call('categories.insert', catName, catDesc, function(err, result){
                if (err) {
                    showSnackbar("Error Saving Category.", "red");
                    Meteor.call('Error.Set', "addCategories.js", "line 30", err);
                } else {
                    showSnackbar("Saved Category Successfully!", "green");
                    $("#addCategory").val('');
                    $("#addDescription").val('');
                }
            });
        }
    },
    'click .deleteCategory' (event) {
        event.preventDefault();

        let categoryId = this._id;

        Meteor.call('categories.remove', categoryId, function(err, result) {
            if (err) {
                showSnackbar("Error Deleting Category!", "red");
                Meteor.call("Error.Set", "addCategories.js", "line 47", err);
            } else {
                showSnackbar("Category Successfully Deleted!", "green");
            }
        });
    },
});
