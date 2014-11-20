Template.leaderboard.helpers({
    users: function() {

        var selector = {};

        // If you are an admin, use this selector property to ensure your user isn't shown in the leaderboard.
        if (Meteor.user().isAdmin) {
            selector = {isAdmin: null};
        }

        return Meteor.users.find(selector, {sort: {score: -1}}).map(function (document, index) {
            document.rank = index + 1;
            return document;
        });
    }
});
