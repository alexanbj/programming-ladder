Meteor.methods
  checkAnswer: (answer, problemId) ->
    if not Meteor.userId()
      throw new Meteor.Error 601, "You need to be logged in to do that"

    userId = Meteor.userId()

    problem = Problems.findOne problemId # TODO: Do some error handling if no problem is found? 

    # If the user has tried and failed to solve this before. Get the current score value for this problem for this user
    previousAnswer = problem.answers?.filter (x) -> x.userId is userId
    if previousAnswer
      if previousAnswer[0]?.answered then return # Don't trust the client
      score = previousAnswer[0]?.score

    #problem.answer should be a string, or the comparison will always fail.
    # TODO: strip all whitespace and lowercase before compare
    if answer is problem.solution
      if score # Hooray, we answered correctly. Set boolean to true
        Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$set: {'answers.$.answered': true}})
      else # Insert new answer array, with max points!
        Problems.update problemId,  {$push: {answers: {userId: userId, score: problem.maxScore, answered: true}}}
      # Increment the score for the user accordingly
      score = if score then score else problem.maxScore
      Meteor.users.update userId, {$inc: {score: score}}
      return true
    else 
      if not score # Insert new answer array, decrement maximum score
        Problems.update problemId, {$push: {answers: {userId: userId, score: problem.maxScore - 1, answered:false}}}
      else if score > problem.minScore # Decrement possible score for this problem
        Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$inc: {'answers.$.score': -1}})
      return false

  revealAnswer: (problemId) ->
    userId = Meteor.userId()
    problem = Problems.findOne problemId
    return problem.solution
