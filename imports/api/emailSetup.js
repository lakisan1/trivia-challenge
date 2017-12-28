import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const EmailSetup = new Mongo.Collection('emailSetup');

EmailSetup.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'emailSettings.add' (user, pswd, srvName, srvPort) {
        check(user, String);
        check(pswd, String);
        check(srvName, String);
        check(srvPort, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to setup Email SMTP, please login.');
        }

        return EmailSetup.insert({
            emailUser: user,
            emailPswd: pswd,
            emailSrv: srvName,
            emailPort: srvPort,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
        });
    },
    'emailSettings.change' (settingId, user, pswd, srvName, srvPort) {
        check(settingId, String);
        check(user, String);
        check(pswd, String);
        check(srvName, String);
        check(srvPort, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to change email SMTP, please Login.');
        }

        return EmailSetup.update({ _id: settingId }, {
            $set: {
                emailUser: user,
                emailPswd: pswd,
                emailSrv: srvName,
                emailPort: srvPort,
                updatedOn: new Date(),
                updatedBy: Meteor.users.findOne(this.userId).username,
            }
        });
    },
    'emailSettings.delete' (settingId) {
        check(settingId, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to delete SMTP settings, please login.');
        }

        return EmailSetup.remove({ _id: settingId });
    },
});
