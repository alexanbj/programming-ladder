ActivityStream = new Meteor.Collection('activitystream');

ActivityStream.allow({
    insert: function() { return false; },
    update: function() { return false; },
    remove: isAdminById
});

if (Meteor.isServer) {
    /* For simplicity. This is is handled in checkAnswer on the server for now. But should be here for proper decoupling
    Problems.after.update(function (userId, problem, fieldNames, modifier, options) {
       insertProblemSolvedEvent(userId, problem, score)
    });*/


    Meteor.users.after.insert(function (userId, user) {
        insertUserRegistrationEvent(user);
    });

    insertUserRegistrationEvent = function(user) {
        var userRegistrationEvent = {
            type: 'UserRegistrationEvent',
            created_at: new Date(),
            actor: {
                id: user._id,
                name: user.username
            }
        }

        ActivityStream.insert(userRegistrationEvent)
    }

    insertProblemSolvedEvent = function(userId, problem, points) {
        var problemSolvedEvent = {
            type: 'ProblemSolvedEvent',
            created_at: new Date(),
            actor: {
                id: userId,
                name: Meteor.users.findOne(userId).username
            },
            payload: {
                points: points,
                problem: {
                    id: problem._id,
                    name: problem.title
                }
            }
        };

        ActivityStream.insert(problemSolvedEvent);
    }


    Meteor.methods({
        clearActivityStream: function() {
            return ActivityStream.remove({});
        }
    });
}
