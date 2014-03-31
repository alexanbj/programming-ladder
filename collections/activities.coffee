@Activities = new Meteor.Collection("activities")

Activities.deny
  insert: -> true
  update: -> true
  remove: -> true

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
        displayName: "todo"