import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Question } from './questions.js';

export const GameQuestions = new Mongo.Collection('gameQuestions');

GameQuestions.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'addGameQuestions' (questionIds, gameCode) {
        check(questionIds, [String]);
        check(gameCode, String);

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add game questions.');
        }

        for (i=0; i<questionIds.length; i++) {
            var questionInfo = Question.find({ _id: questionIds[i]}).fetch();

            GameQuestions.insert({
                gameCode: gameCode,
                questionNo: (i + 1),
                qType: questionInfo.type,
                qQuet: questionInfo.question,
                qCorrect: questionInfo.correctAnswer,
                qIncorrect: questionInfo.inCorrectAnswers,
            });
        }
    },
    'gameOver' (gameCode) {
        // this is to remove the questions from the db for the game
        // that's over.

        check(gameCode, String);

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not logged in, cannot remove questions.');
        }

        return GameQuestions.remove({ gameCode: gameCode });
    },
});
