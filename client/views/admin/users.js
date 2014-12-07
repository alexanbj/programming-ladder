Template.adminUsers.events = {
    'click .admin-toggle': function() {
        //Do not allow un admin yourself
        if (this._id !== Meteor.user()._id) {
            Meteor.users.update(this._id, {$set: { isAdmin: !this.isAdmin }});
        }
    },
    'click .delete': function() {
        if (confirm('Are you sure you want to delete the user ' + this.username + '?')) {
            Meteor.users.remove(this._id);
        }
    }
};
