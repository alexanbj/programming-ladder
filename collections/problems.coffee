@Problems = new Meteor.Collection("problems")

Problems.allow
  insert: -> isAdminById @userId
  update: -> isAdminById @userId
  remove: -> isAdminById @userId

Meteor.methods
  deleteProblem: (problemId) ->
    if not isAdminById @userId
      throw new Meteor.Error 602, "You need to be an admin to do that"
    Problems.remove problemId

  addProblem: (problem) ->
    if not isAdminById @userId
      throw new Meteor.Error 602, "You need to be an admin to do that"

    problem = _.extend problem,
      title: problem.title.trim()
      description: problem.description.trim()
      solution: problem.solution.trim()
      created: problem.created

    #TODO: Sanitize data. Make sure there are no nulls and that maxscore isnt lower than minscore

    Problems.insert problem,
      (err, id) ->
        if id then return id

# When a problem is deleted, decrement the users' scores accordingly
if Meteor.isServer
  Problems.after.remove (userId, problem) ->
    Meteor.users.update answer.userId, { $inc: { score: -answer.score}} for answer in problem.answers when answer.answered is true
