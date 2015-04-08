CommentSchema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    parentCommentId: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    postedAt: { // for now, comments are always created and posted at the same time
        type: Date,
        optional: true
    },
    body: {
        type: String
    },
    htmlBody: {
        type: String,
        optional: true
    },
    author: {
        type: String,
        optional: true
    },
    inactive: {
        type: Boolean,
        optional: true
    },
    problemId: {
        type: String, // XXX
        optional: true
    },
    userId: {
        type: String, // XXX
        optional: true
    },
    isDeleted: {
        type: Boolean,
        optional: true
    }
});

Comments = new Meteor.Collection("comments");
Comments.attachSchema(CommentSchema);

Comments.deny({
    update: function(userId, post, fieldNames) {
        if(isAdminById(userId))
            return false;
        // deny the update if it contains something other than the following fields
        return (_.without(fieldNames, 'body').length > 0);
    }
});

Comments.allow({
    update: canEditById,
    remove: canEditById
});

Comments.before.insert(function (userId, doc) {
    if (Meteor.isServer) {
        doc.htmlBody = marked(doc.body);
        console.log(marked(doc.body));
    }
});

Comments.before.update(function (userId, doc, fieldNames, modifier, options) {
    // if body is being modified, update htmlBody too
    if (Meteor.isServer && modifier.$set && modifier.$set.body) {
        modifier.$set = modifier.$set || {};
        modifier.$set.htmlBody = marked(modifier.$set.body);
    }
});

Comments.after.remove(function (userId, doc) {
    if (Meteor.isServer) {
        Problems.update(doc.problemId, {
            $inc:   {commentCount: -1}/*,
             $pull:  {commenters: comment.userId}*/
        });
    }
});

Meteor.methods({
    comment: function(problemId, parentCommentId, text){
        var user = Meteor.user(),
            problem = Problems.findOne(problemId);
            //postUser = Meteor.users.findOne(post.userId),
            //timeSinceLastComment = timeSinceLast(user, Comments),
            //commentInterval = Math.abs(parseInt(getSetting('commentInterval',15))),
            now = new Date();

        // check that user can comment
        if (!user)
            throw new Meteor.Error(i18n.t('you_need_to_login_or_be_invited_to_post_new_comments'));

        if (getSetting('disableComments', false)) {
            throw new Meteor.Error('commenting-disabled', 'Commenting is currently disabled.');
        }

        // Don't allow empty comments
        if (!text)
            throw new Meteor.Error(704,i18n.t('your_comment_is_empty'));

        var comment = {
            problemId: problemId,
            body: text,
            userId: user._id,
            createdAt: now,
            postedAt: now,
            author: user.username
        };

        if(parentCommentId)
            comment.parentCommentId = parentCommentId;

        comment._id = Comments.insert(comment);

        // increment comment count
        /*Meteor.users.update({_id: user._id}, {
            $inc:       {'commentCount': 1}
        });*/

        Problems.update(problemId, {
            $inc:       {commentCount: 1}
            //$set:       {lastCommentedAt: now},
            //$addToSet:  {commenters: user._id}
        });

        //Meteor.call('upvoteComment', comment);

        return comment;
    }
});