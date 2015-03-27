'use strict';

Template.activitystream.helpers({
    activities: function() {
        return ActivityStream.find({}, {sort: {created_at: -1}});
    }
});

Template.activitystream.events = {
    'click .delete-activity-item': function() {
        if (confirm('Are you sure you want to delete this item from the activity stream?')) {
            ActivityStream.remove(this._id);
        }
    }
};

Template.activitystream.onCreated(function () {
    var self = this;

    self.subscribe('activitystream');
});
