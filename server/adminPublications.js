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