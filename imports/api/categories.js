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

        Categories.insert({
            category: categoryName,
            description: categoryDescription,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
        });
    },
    'categories.delete' (categoryId) {

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to delete a category.');
        }
        
        Categories.remove({ _id: categoryId });
    },
});
