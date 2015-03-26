Template[getTemplate('comment_list')].helpers({
    comment_item: function () {
        return getTemplate('comment_item');
    },
    child_comments: function(){
        var post = this;
        var comments = Comments.find({problemId: post._id, parentCommentId: null}, {sort: {postedAt: 1}});
        return comments;
    }
});

Template[getTemplate('comment_list')].onCreated(function () {
    var self = this;

    self.autorun(function () {
        self.subscribe('problemComments', Template.currentData()._id);
    });
});
