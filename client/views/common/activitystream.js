'use strict';

Template.activitystream.helpers({
    activities: function() {
        return ActivityStream.find({}, {sort: {created_at: -1}});
    },
    urlify: function() {
        switch (entity.objectType) {
            case "problem":
                return Router.routes['showProblem'].path({_id: entity.id});
        }
    },
    title: function() {
        if (this.type === 'UserRegistrationEvent') {
            return this.actor.name + ' har registrert seg';
        } else if (this.type === 'ProblemSolvedEvent') {
            var luker = 'luker';
            if (this.payload.points == 1) {
                luker = 'luke';
            }
            return this.actor.name + ' har løst ' + this.payload.points  + ' ' + luker + '!';
        }
    },
    content: function() {
        if (this.type === 'UserRegistrationEvent') {
            return ''
        } else if (this.type === 'ProblemSolvedEvent') {
            return 'Løste <a href="' + Router.url('showProblem', {_id: this.payload.problem.id}) + '"> luke ' + this.payload.problem.name + '</a>'
        }
    }

});

Template.activitystream.events = {
    'click .delete-activity-item': function() {
        if (confirm('Are you sure you want to delete this item from the activity stream?')) {
            ActivityStream.remove(this._id);
        }
    }
};
