Template.leaderboard.events = {
    'click .admin-toggle': function() {
        //Do not allow to unset yourself as admin
        if (this._id !== Meteor.user()._id) {
            Meteor.users.update(this._id, {$set: { isAdmin: !this.isAdmin }});
        }
    },

    'click .delete-user': function() {
        if (confirm('Are you sure you want to delete the user ' + this.username + '?')) {
            Meteor.users.remove(this._id);
        }
    }
};

Template.leaderboard.users = function() {
    return Meteor.users.find({}, {sort: {score: -1}}).map(function(document, index) {
        document.rank = index + 1;
        return document;
    });
};

Template.leaderboard.helpers({
    totalScore: function() {

    },
    abakusScore: function() {

    },
    onlineScore: function() {
        var score = 0;
        Meteor.users.find({linje: 0}).map(function (doc) {
            score += doc.score;
        });
        return score;
    }
});
