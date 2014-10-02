ActivityStream = new Meteor.Collection('activitystream');

ActivityStream.allow({
    insert: function() { return false; },
    update: function() { return false; },
    remove: isAdminById
});

if (Meteor.isServer) {
    Problems.after.insert(function (userId, problem) {
        ActivityStream.insert(createActivityForProblemAdded(userId, problem));
    });



    createActivityForProblemAdded = function(userId, problem) {
        var activityProperties = {
            verb: 'added',
            published: new Date(),
            actor: {
                objectType: 'user',
                id: userId,
                displayName: Meteor.users.findOne(userId).username
            },
            object: {
                objectType: 'problem',
                id: problem._id,
                displayName: problem.title
            }
        };

        return activityProperties;

    };

    insertActivityForProblemSolved = function(userId, problem, points) {
        var activityProperties = {
            verb: 'solved',
            published: new Date(),
            actor: {
                objectType: 'user',
                id: userId,
                displayName: Meteor.users.findOne(userId).username
            },
            object: {
                objectType: 'problem',
                id: problem._id,
                displayName: problem.title
            }
        };

        ActivityStream.insert(activityProperties);
    }


    Meteor.methods({
        clearActivityStream: function() {
            return ActivityStream.remove({});
        }
    });
}
/*
if Meteor.isServer
    #Problems.after.insert (userId, problem) ->
#  Activities.insert createActivityForProblem(userId, problem)




createActivityForProblem = (userId, problem) ->
    properties =
    verb: "added"
published: new Date
actor:
    objectType: "user"
id: userId
displayName: Meteor.users.findOne(userId).username
object:
    objectType: "problem"
id: problem._id
displayName: problem.title
target:
    objectType: "todo"
id: "todo"
displayName: "todo"*/
