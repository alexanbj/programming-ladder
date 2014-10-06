'use strict';

Template.activitystream.activities = function() {
    return ActivityStream.find({}, {sort: {created_at: -1}});
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


Template.activitystream.title = function() {
    if (this.type === 'UserRegistrationEvent') {
        return this.actor.name + ' has registered';
    } else if (this.type === 'ProblemSolvedEvent') {
        return this.actor.name + ' gained ' + this.payload.points  + ' points!';
    }
}

Template.activitystream.content = function() {
    if (this.type === 'UserRegistrationEvent') {
        return ''
    } else if (this.type === 'ProblemSolvedEvent') {
        return 'Solved <a href="' + Router.url('showProblem', {_id: this.payload.problem.id}) + '">' + this.payload.problem.name + '</a>'
    }
}
