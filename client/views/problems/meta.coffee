Template.meta.problemSolvers = ->
  problem = Problems.findOne(Session.get "selectedProblemId")

  if !problem.answers? then 0 else
    winners = problem.answers.filter (answer) -> answer.solved
    winners.length

Template.meta.problemAverageScore = ->
  problem = Problems.findOne(Session.get "selectedProblemId")
  
  if !problem.answers? then 0 else
    problem = Problems.findOne(Session.get "selectedProblemId")
    winners = problem.answers.filter (answer) -> answer.solved
    score = (winners.map (winner) -> winner.score).reduce (a,b) -> a + b
    if !score? then 0 else score
