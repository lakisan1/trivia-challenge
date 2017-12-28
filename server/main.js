import { Meteor } from 'meteor/meteor';
import { EmailSetup } from '../imports/api/emailSetup.js';

Meteor.startup(() => {
    // code to run on server at startup
    try {
        let msgSettings = EmailSetup.findOne({});
        if (typeof msgSettings == 'undefined' || msgSettings == null || msgSettings == "") {
          // msg settings not set, route user to setup for message settings.
          // console.log("Didn't find email settings.");
        } else {
            console.log("Found email settings");
            let user = msgSettings.emailUser;
            // console.log("User = " + user);
            Meteor.call('setEmailFromServer', msgSettings);
        }
    } catch (error) {
        console.log("Error caught in server/main.js: " + error);
    }

 });

 Meteor.methods({
     'setEmailFromServer' (msgSettings) {
         if (msgSettings) {
             smtp = {
                 username: msgSettings.emailUser,
                 password: msgSettings.emailPswd,
                 server: msgSettings.emailSrv,
                 port: msgSettings.emailPort
             }
             // console.log("email user is: " + smtp.username);
             // console.log("email pass is: " + smtp.password);
             // console.log("email server is: " + smtp.server);
             // console.log("email port is: " + smtp.port);
             process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
         }
     },
 });
