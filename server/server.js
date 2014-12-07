Meteor.methods({
    retrieveAnswer: function(problemId) {

        // You should only be able to retrieve the answer if you are logged in, has answered the problem or if the problem no longer is active
        var userId = Meteor.userId();
        var problem = Problems.findOne({_id: problemId, draft: false});
        if (problem.activeTo < new Date() || _.findWhere(problem.answers, {userId: userId, solved: true})) {
            return problem.solution;
        }
    }
});