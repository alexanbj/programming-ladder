Template.leaderboard.users = function() {

    var selector = {};

    // If you are an admin, use this selector property to ensure your user isn't shown in the leaderboard.
    if (Meteor.user().isAdmin) {
        selector = {isAdmin: null};
    }

    return Meteor.users.find(selector, {sort: {score: -1}}).map(function(document, index) {
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
