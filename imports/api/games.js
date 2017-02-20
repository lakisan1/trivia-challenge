import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Games = new Mongo.Collection('games');

Games.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'newGame.insert' (gameType, gameName, numOfQs, qType, qDiff, qCat, gameCode, thisGameQuestions) {
        // check the values for proper / expected type
        check(gameType, String);
        check(gameName, String);
        check(numOfQs, Number);
        check(qType, String);
        check(qDiff, String);
        check(qCat, [String]);
        check(gameCode, String);
        check(thisGameQuestions, [String]);

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }

        // now add the neew Game to the system

        return Games.insert({
                gameType: gameType,
                gameName: gameName,
                numberOfQuestions: numOfQs,
                questionType: qType,
                questionDifficulty: qDiff,
                questionCategory: qCat,
                gameCode: gameCode,
                gameStatus: '',
                active: 'Yes',
                addedOn: new Date(),
                addedBy: Meteor.users.findOne(this.userId).username,
                qAndAs: thisGameQuestions,
            });
    },
    'setGameWaiting' (gameCode) {
        check(gameCode, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }

        var owner = Meteor.users.findOne(this.userId).username;

        return Games.update({ gameCode: gameCode, owner: owner, active: "Yes" },
            {
                $set: {
                    gameStatus: "Waiting",
                }
            }
        )
    },
    'game.addPlayers' (teamName, gameId) {
        check(teamName, String);
        check(gameId, String);


        return Games.update({ _id: gameId }, {
            $addToSet: {
                players:
                    {
                        name: teamName,
                        points: 0,
                        questionsCorrect: 0,
                    },
            }
        });
    }
});
