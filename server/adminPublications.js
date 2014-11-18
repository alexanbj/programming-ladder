Meteor.publish('adminProblems', function () {
    if (isAdminById(this.userId)) {
        return Problems.find({}, {});
    } else {
        return [];
    }
});

Meteor.publish('adminUsers', function() {
    if (isAdminById(this.userId)) {
        return Meteor.users.find({}, {
            name: true,
            isAdmin: true,
            score: true
        });
    } else {
        return [];
    }
});

Meteor.publish('adminProblem', function(problemId) {
    if (isAdminById(this.userId)) {
        return Problems.find({_id: problemId}, {fields: {
            title: true,
            maxScore: true,
            minScore: true,
            published: true,
            description: true,
            draft: true,
            solution: true
        }});
    } else {
        return [];
    }
});