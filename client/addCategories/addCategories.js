import { Categories } from '../../imports/api/categories.js';

Template.addCategories.onCreated(function() {
    this.subscribe("categories");
})


Template.addCategories.helpers({
    getCategories: function() {
        return Categories.find({});
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
                    console.log(err);
                } else {
                    showSnackbar("Saved Category Successfully!", "green");
                    $("#addCategory").val('');
                    $("#addDescription").val('');
                }
            });
        }
    },
});
