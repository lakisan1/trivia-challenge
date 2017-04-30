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
                nextQuestionStatus: '',
                active: 'Yes',
                numberOfPlayers: 0,
                playersAnswered: 0,
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
    'setGameLive' (gameCode, status) {
        check(gameCode, String);
        check(status, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }
        console.log("Game Code sent is: " + gameCode);
        console.log("NQS: " + status + " by " + Meteor.users.findOne(this.userId).username);

        return Games.update({ gameCode: gameCode, active: "Yes" },
            {
                $set: {
                    nextQuestionStatus: status,
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

        return Games.update({ _id: gameId },
            { $addToSet: { players: { name: teamName, points: 0, questionsCorrect: 0, questionsAnswered: 0 }},
            $inc: { numberOfPlayers: 1 }
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
                    nextQuestionStatus: "live",
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
                    qandAs: gameQuestions
                },
                $set: {
                    numberofQuestions: numOfQs,
                }
            });
    },
    'game.addPoints' (gameCode, answerCorrect) {
        check(gameCode, String);
        check(answerCorrect, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to update game points, please login.');
        }

        if (answerCorrect == "No") {
            var gamePoints = 0;
            var numCorrect = 0;
        } else {
            var gamePoints = 1;
            var numCorrect = 1;
        }

        playerName = Meteor.users.findOne(this.userId).username;

        return Games.update({ gameCode: gameCode, active: "Yes", "players.name": playerName },
            {
                $inc: { playersAnswered: 1, "players.$.points": gamePoints, "players.$.questionsCorrect": numCorrect, "players.$.questionsAns": 1 }
            });
    },
    'resetPlayerAnswerCount' (gameCode) {
        check(gameCode, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to update player answer count, please login.');
        }

        return Games.update({ gameCode: gameCode, active: "Yes" },
            {
                $set: { playersAnswered: 0, }
            });
    },
    'gameEnd' (gameCode) {
        check(gameCode, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized remove a game, please login.');
        }

        return Games.update({ gameCode: gameCode, active: "Yes" }, {
            $set: {
                active: "No",
                nextQuestionStatus: "complete",
            }
        });
    },
    'setGameStatus' (gameCode, status) {
        check(gameCode, String);
        check(status, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to add a category');
        }
        console.log("Game Code sent is: " + gameCode);
        console.log("NQS: " + status + " by " + Meteor.users.findOne(this.userId).username);

        return Games.update({ gameCode: gameCode, active: "Yes" },
            {
                $set: {
                    gameStatus: status,
                }
            }
        )
    },
});
