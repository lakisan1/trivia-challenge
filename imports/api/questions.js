import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Categories } from './categories.js';

export const Questions = new Mongo.Collection('questions');

Questions.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'newQuestionTF.insert'(qCat, qDiff, qType, private, question, tOrF, trueAnswer, nextSeqNo) {
        // check that values sent are of expected type
        check(qCat, String);
        check(qDiff, String);
        check(qType, String);
        check(private, String);
        check(question, String);
        check(tOrF, String);
        check(trueAnswer, String);
        check(nextSeqNo, Number);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized.');
        }

        if (private == 'private') {
            owner = Meteor.users.findOne(this.userId).username;
        } else {
            owner = "all";
        }

        return Questions.insert({
            category: qCat,
            difficulty: qDiff,
            type: qType,
            owner: owner,
            question: question,
            correctAnswer: tOrF,
            trueAnswer: trueAnswer,
            seqNo: nextSeqNo,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
            timesUsedInAGame: 0,
        });
    },
    'Question.update' (questionId) {
        Questions.update({ _id: questionId }, { $inc: { timesUsedInAGame: 1 }});
    },
    'newQuestionMC.insert'(qCat, qDiff, qType, private, question, correct, incorrect1, incorrect2, incorrect3, nextSeqNo) {
        // check that values sent are of expected type
        check(qCat, String);
        check(qDiff, String);
        check(qType, String);
        check(private, String);
        check(question, String);
        check(correct, String);
        check(incorrect1, String);
        check(incorrect2, String);
        check(incorrect3, String);
        check(nextSeqNo, Number);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized.');
        }

        if (private == 'private') {
            owner = Meteor.users.findOne(this.userId).username;
        } else {
            owner = "all";
        }

        return Questions.insert({
            category: qCat,
            difficulty: qDiff,
            type: qType,
            owner: owner,
            question: question,
            correctAnswer: correct,
            inCorrectAnswers: [
                incorrect1,
                incorrect2,
                incorrect3,
            ],
            seqNo: nextSeqNo,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
            timesUsedInAGame: 0,
        });
    },
    'update.QuestionsToUncat' (catName) {
        check(catName, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized.');
        }

        console.log("Got to uncat update.");

        Questions.update({ category: catName }, {
            $set: {
                category: 'Uncategorized',
            }
        }, { multi: true });
    },
    'question.remove' (questionId) {
        check(questionId, String);

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized.');
        }

        return Questions.remove({ _id: questionId });
    },
    'importQuestions' (apiResult) {

        if(!this.userId) {
            throw new Meteor.Error('User is not authorized.');
        }

        let numberResults = apiResult.data.results.length;
        // console.log("Number of API Results: " + numberResults);

        let nextSeqNoread = Questions.findOne({}, { sort: { seqNo: -1 }, limit: 1 });
        console.log("Next Seq No = " + nextSeqNoread.seqNo);
        let nextSeqNo = nextSeqNoread.seqNo;
        if (numberResults > 0) {
            // console.dir(apiResult.data.results);
            for (k = 0; k < numberResults; k++) {
                nextSeqNo = nextSeqNo + 1;

                // check to see if the category imported already exists
                // and if not, create it.
                let catExists = Categories.findOne({ category: apiResult.data.results[k].category });
                if (typeof catExists != 'undefined') {
                    if (catExists.category != null && catExists.category != "") {
                        console.log("Category exists!");
                    } else {
                        console.log("Category doesn't exist.");
                    }
                } else {
                    console.log("Category doesn't exist!");
                    Categories.insert({
                        category: apiResult.data.results[k].category,
                        description: apiResult.data.results[k].category,
                        addedOn: new Date(),
                        addedBy: Meteor.users.findOne(this.userId).username,
                        addedFrom: "import",
                    });
                }

                // import the trivia question and answers
                if (apiResult.data.results[k].type == "multiple") {
                    Questions.insert({
                        category: apiResult.data.results[k].category,
                        difficulty: apiResult.data.results[k].difficulty,
                        type: apiResult.data.results[k].type,
                        owner: "all",
                        question: apiResult.data.results[k].question,
                        correctAnswer: apiResult.data.results[k].correct_answer,
                        inCorrectAnswers: [
                            apiResult.data.results[k].incorrect_answers[0],
                            apiResult.data.results[k].incorrect_answers[1],
                            apiResult.data.results[k].incorrect_answers[2],
                        ],
                        seqNo: nextSeqNo,
                        addedOn: new Date(),
                        addedBy: Meteor.users.findOne(this.userId).username,
                        timesUsedInAGame: 0,
                    });
                } else {
                    if (apiResult.data.results[k].correct_answer == 'True') {
                        var tfAnswer = true;
                    } else {
                        var tfAnswer = false;
                    }

                    Questions.insert({
                        category: apiResult.data.results[k].category,
                        difficulty: apiResult.data.results[k].difficulty,
                        type: apiResult.data.results[k].type,
                        owner: "all",
                        question: apiResult.data.results[k].question,
                        correctAnswer: tfAnswer,
                        trueAnswer: "",
                        seqNo: nextSeqNo,
                        addedOn: new Date(),
                        addedBy: Meteor.users.findOne(this.userId).username,
                        timesUsedInAGame: 0,
                    });
                }
            }
        }
    },
});
