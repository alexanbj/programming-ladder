Meteor.publish('currentUser', function() {
    var user = Meteor.users.find({_id: this.userId});
    return user;
});

Meteor.publish('allUsersAdmin', function() {
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
