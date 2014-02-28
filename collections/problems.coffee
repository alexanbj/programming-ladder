
@Problems = new Meteor.Collection("problems")
@CodeFiles = new CollectionFS("problems", { autopublish: false });

CodeFiles.allow
  insert: -> true
  update: -> true
  remove: -> true

CodeFiles.filter
  allow: -> true

CodeFiles.fileHandlers
  default: (options) -> 
    fileRecord = options.fileRecord
    blob = options.blob     
    {blob: options.blob, fileRecord: options.fileRecord}

Problems.allow
  insert: -> isAdminById Meteor.userId()
  update: -> isAdminById Meteor.userId()
  remove: -> isAdminById Meteor.userId()

Meteor.methods
  addProblem: (problem) ->
    if not isAdminById @userId
      throw new Meteor.Error 602, "You need to be an admin to do that"

    problem = _.extend problem,
      title: problem.title.trim()
      description: problem.description.trim()
      solution: problem.solution.trim()

    #TODO: Sanitize data: Make sure there are no nulls and that maxscore isnt lower than minscore

    Problems.insert problem,
      (err, id) ->
        if id then return id

  isAnswered: (problemId) ->
    problem = Problems.findOne _id: problemId

    return (problem?.answers? and problem?.answers?.length > 0) 
    
  editProblem: (problem) ->
    if not isAdminById @userId
      throw new Meteor.Error 602, "You need to be an admin to do that"

    problemToUpdate = Problems.findOne _id: problem._id

    if problem?.answers? and problem?.answers?.length > 0  
      Problems.update _id: problem._id, 
        {$set: 
          title: problem.title.trim()
          description: problem.description.trim()
          solution: problem.solution.trim()}
    else
      Problems.update _id: problem._id, 
        {$set: 
          title: problem.title.trim()
          description: problem.description.trim()
          solution: problem.solution.trim()
          maxScore: problem.maxScore
          minScore: problem.minScore}
    return problem._id

# When a problem is deleted, decrement the users' scores accordingly
if Meteor.isServer
  Problems.after.remove (userId, problem) ->
    Meteor.users.update answer.userId, { $inc: { score: -answer.score, solved: -1}} for answer in problem.answers? when answer.solved is true

