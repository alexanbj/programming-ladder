Meteor.publish('activitystream', function() {
    return ActivityStream.find({}, {limit: 15});
});

