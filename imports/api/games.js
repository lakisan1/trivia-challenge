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
    'newGame.insert' (gameType, gameName, qType, qDiff, qCat, gameCode) {
        // check the values for proper / expected type
        check(gameType, String);
        check(gameName, String);
        check(qType, String);
        check(qDiff, String);
        check(qCat, [String]);
        check(gameCode, String);

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }

        // now add the neew Game to the system

        return Games.insert({
                gameType: gameType,
                gameName: gameName,
                questionType: qType,
                questionDifficulty: qDiff,
                questionCategory: qCat,
                gameCode: gameCode,
                gameStatus: '',
                active: 'Yes',
                addedOn: new Date(),
                addedBy: Meteor.users.findOne(this.userId).username,
            });
    },
    'setGameWaiting' (gameCode) {
        check(gameCode, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }

        var owner = Meteor.users.findOne(this.userId).username;

        return Games.update({ gameCode: gameCode, addedBy: owner, active: "Yes" },
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

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to set the game waiting.');
        }

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
    },
    'startGame' (gameCode) {
        check(gameCode, String);

        // verify the user is logged in before allowing game insert
        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to start a game.');
        }

        return Games.update({ gameCode: gameCode, active: "Yes" },
            {
                $set: {
                    gameStatus: "started",
                }
            }
        );

    },
    'gameQuestions' (numOfQs, gameQuestions, gameCode, gameName) {
        check(numOfQs, Number);
        check(gameQuestions, [String]);
        check(gameCode, String);
        check(gameName, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add new Questions to the game.');
        }

        return Games.update({ gameCode: gameCode, gameName: gameName, active: "Yes"},
            {
                $addToSet: {
                    numberofQuestions: numOfQs,
                    qandAs: gameQuestions
                }
            });
    }
});
