import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Categories = new Mongo.Collection('categories');

Categories.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'categories.insert' (categoryName, categoryDescription) {
        check(categoryName, String);
        check(categoryDescription, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }

        return Categories.insert({
            category: categoryName,
            description: categoryDescription,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
        });
    },
    'categories.remove' (categoryId) {
        check(categoryId, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to delete a category.');
        }

        let cat = Categories.findOne({ _id: categoryId });
        let catName = cat.category;

        Categories.remove({ _id: categoryId });
        // now update the questions from this category to 'uncategorized'
        Meteor.call('update.QuestionsToUncat', catName);
    },
    'category.update' (catId, catName, catDesc) {
        check(catId, String);
        check(catName, String);
        check(catDesc, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to delete a category.');
        }

        Categories.update({ _id: catId }, {
            $set: {
                category: catName,
                description: catDesc,
                editedOn: new Date(),
                editedBy: Meteor.users.findOne(this.userId).username,
            }
        });
    },
});
