Template.sidebar.selected = ->
  if Session.equals "selectedProblemId", this._id then "active" else ""

Template.sidebar.problems = ->
  Problems.find({}, {sort: {created : 1}})
