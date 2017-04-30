import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ErrorLog = new Mongo.Collection('errorLog');

ErrorLog.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'Error.Set' (filename, lineNo, error) {
        check(filename, String);
        check(lineNo, String);
        check(error, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to log errors, please login.');
        }

        ErrorLog.insert({
            filename: filename,
            lineNo: lineNo,
            errorText: error,
            loggedOn: new Date(),
        });
    }
});
