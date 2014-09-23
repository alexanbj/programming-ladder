Template.settings.events = {
    'click #clear-activity-stream': function () {
        if (confirm('Are you sure you want to clear the activity stream?')) {
            Meteor.call('clearActivityStream');
        }
    }
};
