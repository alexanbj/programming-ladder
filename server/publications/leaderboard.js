Meteor.publish('leaderboard', function() {
    var fields = {
        username: true,
        score: true,
        solved: true,
        lastSolved: true
    };

    return Meteor.users.find({isAdmin: false}, {fields: fields});
});
