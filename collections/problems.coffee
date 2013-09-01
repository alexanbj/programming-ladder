@Problems = new Meteor.Collection("problems")

Meteor.methods
  deleteProblem: (problemId) ->
    Problems.remove problemId
    # FIXME: we should decrement the users' scores!!

  addProblem: (problem) ->

    #TODO: Check if the user is authorized (admin)

    problem = _.extend problem,
      title: problem.title.trim()
      description: problem.description.trim()
      solution: problem.solution.trim()

    #TODO: Sanitize data. Make sure there are no nulls and that maxscore isnt lower than minscore

    Problems.insert problem,
      (err, id) ->
        if id then return id
