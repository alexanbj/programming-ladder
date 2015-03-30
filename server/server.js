Meteor.methods({
    retrieveAnswer: function(problemId) {

        // You should only be able to retrieve the answer if you are logged in, has answered the problem or if the problem no longer is active
        var userId = Meteor.userId();
        var problem = Problems.findOne({_id: problemId, draft: false});
        if (problem.activeTo < new Date() || _.findWhere(problem.answers, {userId: userId, solved: true})) {
            return problem.solution;
        }
    },

    checkAnswer: function(answer, problemId) {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error('logged-out', 'You must be logged in to submit answers.');
        }

        if (getSetting('disableAnswering', false)) {
            throw new Meteor.Error('answering-disabled', 'Submitting answers is currently disabled.');
        }

        var problem = Problems.findOne(problemId);

        if (problem.activeTo && (problem.activeTo < Date.now())) {
            throw new Meteor.Error('too-late', 'Too late! It is no longer possible to submit answers to this problem.');
        }

        // Check if the user already solved this
        if (_.findWhere(problem.answers, {userId: userId, solved: true})) {
            return false;
        }

        var prev = _.findWhere(problem.answers, {userId: userId});

        if (sanitize(answer) === sanitize(problem.solution)) {
            if (prev) {
                Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$set: {'answers.$.solved': true}});
            } else {
                Problems.update(problemId, {$push: {answers: {userId: userId, score: problem.maxScore, solved: true}}});
            }

            var score = prev ? prev.score : problem.maxScore;
            Meteor.users.update(userId, {$inc: {score: score, solved: 1}, $set: {'lastSolved': new Date()}});

            return true;

        } else {
            if (!prev) {
                Problems.update(problemId, {$push: {answers: {userId: userId, score: problem.maxScore - 1, solved: false}}});
            } else if (prev.score > problem.minScore) {
                Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$inc: {'answers.$.score': -1}});
            }

            return false;
        }
    }
});


//Removes all whitespace and lowercase the string
sanitize = function (string) {
    return string.replace(/\s+|\s+$/g, "").toLowerCase();
};
