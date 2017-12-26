import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Questions } from './questions.js';

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
            var questionInfo = Questions.find({ _id: questionIds[i] }).fetch();
            if (i == 0) {
                currQuestion = "Y";
            } else {
                currQuestion = "N";
            }
            if(questionInfo[0].type == "trueFalse") {
                GameQuestions.insert({
                    questionId: questionInfo[0]._id,
                    gameCode: gameCode,
                    questionNo: (i + 1),
                    currentQuestion: currQuestion,
                    qType: questionInfo[0].type,
                    qQuet: questionInfo[0].question,
                    qCorrect: questionInfo[0].correctAnswer,
                    qAnswerInfo: questionInfo[0].trueAnswer,
                    playersAnswered: [],
                });
            } else {
                // need to take correct and incorrect answers, split them up, and randomly
                // assign them an answer letter
                var ansOrder = [];
                var ansOptions = ["A","B","C","D"];
                var rounds = ansOptions.length;
                for (j = 0; j < rounds; j++) {
                    var ansIndex = Math.floor((Math.random() * ansOptions.length));
                    // // console.log("Answer Index: " + ansIndex);

                    var ansPosition = ansOptions[ansIndex];
                    // // console.log("Answer " + j + ": " + ansPosition);

                    switch(j) {
                        case 0:
                            qCorrectLetter = ansPosition;
                            break;
                        case 1:
                            qIncorrectLetter1 = ansPosition;
                            break;
                        case 2:
                            qIncorrectLetter2 = ansPosition;
                            break;
                        case 3:
                            qIncorrectLetter3 = ansPosition;
                            break;
                    }

                    ansOrder.push(ansPosition);

                    ansOptions.splice(ansIndex, 1);
                    // // console.log("Answer Options: " + ansOptions);

                }
                // console.log('Answer Order: ' + ansOrder);

                GameQuestions.insert({
                    questionId: questionInfo[0]._id,
                    gameCode: gameCode,
                    questionNo: (i + 1),
                    currentQuestion: currQuestion,
                    qType: questionInfo[0].type,
                    qQuet: questionInfo[0].question,
                    qCorrect: questionInfo[0].correctAnswer,
                    qCorrectLetter: qCorrectLetter,
                    qIncorrect1: questionInfo[0].inCorrectAnswers[0],
                    qIncorrectLetter1: qIncorrectLetter1,
                    qIncorrect2: questionInfo[0].inCorrectAnswers[1],
                    qIncorrectLetter2: qIncorrectLetter2,
                    qIncorrect3: questionInfo[0].inCorrectAnswers[2],
                    qIncorrectLetter3: qIncorrectLetter3,
                    playersAnswered: [],
                });
            }
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
    'SetCurrentQuestion' (gameCode, questionNo) {
        check(gameCode, String);
        check(questionNo, Number);

        if(!this.userId) {
            throw new Meteor.Error('User is not logged in, cannot set game to start.');
        }

        return GameQuestions.update({ gameCode: gameCode, questionNo: questionNo },
        {
            $set: {
                currentQuestion: "Y",
            }
        });
    },
    'gameQuestions.changeCurrent' (gameCode, nextQuestionNo, totalQuestions) {
        // this is to move the game along from question to question by changing
        // the current question flag.

        check(gameCode, String);
        check(nextQuestionNo, Number);
        check(totalQuestions, Number);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to change question status.');
        }

        var prevQuestionNo = nextQuestionNo - 1;
        var questionInfo = GameQuestions.find({ gameCode: gameCode, active: "Yes" }, { sort: { questionNo: +1 }}, { limit: 1 }).fetch();
        // // console.log("--------  Total Questions: " + totalQuestions + " ----------");

        if (totalQuestions < nextQuestionNo ) {
            // need to complete the game
            GameQuestions.remove({ gameCode: gameCode });
            return "complete";
        } else {
            GameQuestions.update({ gameCode: gameCode, questionNo: prevQuestionNo },
                {
                    $set: {
                        currentQuestion: "N"
                    }
                });
            return GameQuestions.update({ gameCode: gameCode, questionNo: nextQuestionNo},
                {
                    $set: {
                        currentQuestion: "Y"
                    }
                });
        }
    },
    'gameQuestion.answered' (gameCode, questionNo) {
        check(gameCode, String);
        check(questionNo, Number);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized to answer a question, please login.');
        }

        GameQuestions.update({ gameCode: gameCode, currentQuestion: "Y", questionNo: questionNo}, {
            $addToSet: {
                playersAnswered: this.userId,
            }
        });
    }
});
