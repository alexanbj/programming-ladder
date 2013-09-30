Template.sidebar.selected = ->
  if Session.equals "selectedProblemId", this._id then "active" else ""

Template.sidebar.problems = ->
  Problems.find({}, {sort: {created : 1}})

Template.sidebar.events
  'click a#randomProblem': (event) ->
    event.preventDefault() # don't reload the page on submit
    unsolvedProblems = Problems.find({$or : [{answers : null}, {"answers.solved" : false}]}).fetch()
    randomIndex = Math.floor(Math.random() * unsolvedProblems.length)
    Router.go "showProblem", _id: unsolvedProblems[randomIndex]._id
