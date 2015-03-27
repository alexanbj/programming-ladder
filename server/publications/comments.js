Meteor.publish('problemComments', function (problemId) {
    return Comments.find({problemId: problemId});
});
