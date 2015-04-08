Meteor.publish('problemComments', function (problemId) {
    if (!getSetting('disableComments', false)) {
        return Comments.find({problemId: problemId});
    } else {
        return [];
    }
});
