Template.leaderboard.users = function() {
    return Meteor.users.find({isAdmin: false}, {sort: {score: -1}}).map(function(document, index) {
        document.rank = index + 1;
        return document;
    });
};

Template.leaderboard.helpers({
    totalScore: function() {
        var score = 0;
        Meteor.users.find({isAdmin: false}).map(function (doc) {
            score += doc.score;
        });
        return score;
    },
    abakusScore: function() {
        var score = 0;
        Meteor.users.find({isAdmin: false, linje: 1}).map(function (doc) {
            score += doc.score;
        });
        return score;
    },
    onlineScore: function() {
        var score = 0;
        Meteor.users.find({isAdmin: false, linje: 0}).map(function (doc) {
            score += doc.score;
        });
        return score;
    }
});
