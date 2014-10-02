Template.activitystream.activities = function() {
    return ActivityStream.find();
}

Template.activitystream.urlify = function() {
    switch (entity.objectType) {
        case "problem":
            return Router.routes['showProblem'].path({_id: entity.id});
    }
}

Template.activitystream.events = {
    'click .delete-activity-item': function() {
        if (confirm('Are you sure you want to delete this item from the activity stream?')) {
            ActivityStream.remove(this._id);
        }
    }
};

