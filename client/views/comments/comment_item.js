Template[getTemplate('comment_item')].events({
    'click .delete': function(){
        Comments.remove(this._id);
    }
});

Template[getTemplate('comment_item')].helpers({
    is_own_comment: function () {
        return this.userId == Meteor.userId();
    }
});