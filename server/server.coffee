Meteor.methods
  checkAnswer: (answer, problemId) ->
    user = Meteor.user()
    if not user
      throw new Meteor.Error 'logged-out', 'You must be logged in to submit answers.'

    if not getSetting('answerSubmission', true)
      throw new Meteor.Error 'answering-disabled', 'Submitting answers is currently disabled.'

    problem = Problems.findOne problemId

    if problem.activeTo and (problem.activeTo < Date.now())
      throw new Meteor.Error 'too-late', 'Too late! It is no longer possible to submit answers to this problem.'

    # If the user has tried and failed to solve this before. Get the current score value for this problem for this user
    previousAnswer = problem.answers?.filter (x) -> x.userId is user._id
    if previousAnswer
      if previousAnswer[0]?.solved then return # Don't trust the client

    # Check if user submitted the correct answer and take appropriate action
    if sanitize(answer) is sanitize(problem.solution)
      if previousAnswer[0] # Hooray, we answered correctly. Set boolean to true
        Problems.update({_id: problemId, answers: {$elemMatch: {userId: user._id}}}, {$set: {'answers.$.solved': true}})
      else # Insert new answer array, with max points!
        Problems.update problemId, {$push: {answers: {userId: user._id, solved: true}}}
      # Increment the solved count for the user accordingly
      Meteor.users.update(user._id, {$inc: {solved: 1}, $set: {'lastSolved': new Date()}})
      insertProblemSolvedEvent(user._id, problem, user.solved + 1);
      return true
    else
      if not previousAnswer[0] # Insert new answer array
        Problems.update problemId, {$push: {answers: {userId: user._id, solved:false}}}
      return false

# Removes all whitespace and lowercases it. Perhaps we should remove special chars as well?
@sanitize = (string) ->
  string.replace(/\s+|\s+$/g, "").toLowerCase()
