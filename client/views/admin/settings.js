Template.settings.events = {
    'click #clear-activity-stream': function () {
        Meteor.call('clearActivityStream');
    }
};
