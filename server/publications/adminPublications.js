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
            solved: true
        });
    } else {
        return [];
    }
});

Meteor.publish('adminProblem', function(problemId) {
    if (isAdminById(this.userId)) {
        return Problems.find({_id: problemId}, {fields: {
            title: true,
            activeFrom: true,
            activeTo: true,
            description: true,
            draft: true,
            solution: true
        }});
    } else {
        return [];
    }
});