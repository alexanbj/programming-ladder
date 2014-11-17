Template.adminProblems.events = {
    'click .publish': function() {
        Problems.update(this._id, {$set: { draft: false }});
    },
    'click .draft': function() {
        Problems.update(this._id, {$set: { draft: true }});
    },
    'click .delete': function() {
        if (confirm('Are you sure you want to delete the user ' + this.username + '?')) {
            Problems.remove(this._id);
        }
    }
};