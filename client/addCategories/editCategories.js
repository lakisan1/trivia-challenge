import { Categories } from '../../imports/api/categories.js';

Template.editCategories.onCreated(function() {
    this.subscribe('categories');
});

Template.editCategories.onRendered(function() {

});

Template.editCategories.helpers({
    thisCategory: function() {
        let catId = Session.get('editCatId');
        return Categories.find({ _id: catId });
    },
});

Template.editCategories.events({
    'click #cancelEditCategory' (event) {
        event.preventDefault();

        FlowRouter.go("/addCategories");
    },
    'click #saveEditCategory' (event) {
        event.preventDefault();

        let catId = Session.get('editCatId');
        let catName = $("#catName").val();
        let catDesc = $("#catDesc").val();

        if (catName == "" || catName == null) {
            showSnackbar("Category Name is Required!", "red");
            $("#catName").addClass("reqField");
            return;
        } else {
            if (catDesc == "" || catDesc == null) {
                showSnackbar("Category Description is Required!", "red");
                $("#catDesc").addClass("reqField");
                return;
            } else {
                Meteor.call('category.update', catId, catName, catDesc, function(err, result) {
                    if (err) {
                        // console.log("Error updating the category: " + err);
                        showSnackbar("Error Updating Category!", "red");
                    } else {
                        showSnackbar("Category Updated Successfully!", "green");
                        FlowRouter.go("/addCategories");
                    }
                });
            }
        }
    },
    'keyup #catName' (event) {
        $("#catName").removeClass('reqField');
    },
    'keyup #catDesc' (event) {
        $("#catDesc").removeClass('reqField');
    }
});
