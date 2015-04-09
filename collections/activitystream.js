ActivityStream = new Meteor.Collection('activitystream');

ActivityStream.allow({
    insert: function() { return false; },
    update: function() { return false; },
    remove: isAdminById
});

if (Meteor.isServer) {

    Meteor.startup(function() { // Stupid load order...
        Problems.after.update(function (userId, problem, fieldNames, modifier, options) {

            if (_.contains(fieldNames, 'answers')) {
                var self = this;

                var diff = _.filter(problem.answers, function(obj){ return !_.findWhere(self.previous.answers, obj); });
                diff = _.first(diff);

                if (diff && diff.solved) {
                    insertProblemSolvedEvent(diff.userId, problem, diff.score);
                }
            }
        });

    });


    Meteor.users.after.insert(function (userId, user) {
        insertUserRegistrationEvent(user);
    });

    Meteor.startup(function() { // Load order, again...
        Comments.after.insert(function (userId, comment) {
            insertNewCommentEvent(comment);
        });
    });

    insertNewCommentEvent = function(comment) {
        var problem = Problems.findOne(comment.problemId);
        var user = Meteor.users.findOne(comment.userId);

        var newCommentEvent = {
            type: 'NewCommentEvent',
            created_at: comment.postedAt,
            actor: {
                id: user._id,
                name: user.username
            },
            payload: {
                problem: {
                    id: problem._id,
                    name: problem.title
                }
            }
        };

        ActivityStream.insert(newCommentEvent);
    };

    insertUserRegistrationEvent = function(user) {
        var userRegistrationEvent = {
            type: 'UserRegistrationEvent',
            created_at: new Date(),
            actor: {
                id: user._id,
                name: user.username
            }
        };

        ActivityStream.insert(userRegistrationEvent)
    };

    insertProblemSolvedEvent = function(userId, problem, points) {
        var user = Meteor.users.findOne(userId);

        var problemSolvedEvent = {
            type: 'ProblemSolvedEvent',
            created_at: new Date(),
            actor: {
                id: userId,
                name: user.username
            },
            payload: {
                points: points,
                total: user.score + points,
                problem: {
                    id: problem._id,
                    name: problem.title
                }
            }
        };

        ActivityStream.insert(problemSolvedEvent);
    };


    Meteor.methods({
        clearActivityStream: function() {
            return ActivityStream.remove({});
        }
    });
}
