Template.problems.problems = ->
  Problems.find({}, {sort: {created : -1}})

Template.problems.events 
  'submit form': (event, template) ->
    event.preventDefault() # don't reload the page on submit
    unsolvedProblems = Problems.find({$or : [{answers : null}, {"answers.answered" : false}]}).fetch()
    randomIndex = Math.floor(Math.random() * unsolvedProblems.length)   
    Router.go "showProblem", _id: unsolvedProblems[randomIndex]._id

Template.problems.selected = ->
  if Session.equals "selectedProblemId", this._id then "active" else ""

Template.showProblem.wrongAnswer = ->  
  Session.get(Session.get('selectedProblemId'))  

Template.showProblem.events 
  'submit form': (event, template) ->
    event.preventDefault() # don't reload the page on submit
    answer = template.find("#answer").value.trim()
    if answer
      Meteor.call 'checkAnswer', answer, Session.get('selectedProblemId'), #use template.data._id instead of session object her
      (err, res) ->  
        # Is it the 'meteor way' to use jquery here or should session variables be used?
        #if res is true
        if not res
          Session.set(Session.get('selectedProblemId'), true)
        else
          Session.set(Session.get('selectedProblemId'), null)       
        
        console.log(err)
        console.log(res)

  'click a#revealAnswer': (event) ->
    event.preventDefault()
    Meteor.call 'revealAnswer', Session.get('selectedProblemId'),
      (err, res) ->  
        if res
          $('a#revealAnswer').popover({placement:'right', content: res, trigger: "manual"})
          $('a#revealAnswer').popover('toggle')
          $('a#revealAnswer').addClass('disabled')

Template.newProblem.events
  'submit form': (event, template) ->
    event.preventDefault()

    properties =
      title: template.find("#title").value
      description: template.find("#description").value
      maxScore: parseInt template.find("#max-score").value
      minScore: parseInt template.find("#min-score").value
      solution: template.find("#solution").value
      created: new Date

    Meteor.call 'addProblem', properties,
      (err, problemId) ->
        if problemId then Router.go "showProblem", _id: problemId


Template.editProblem.problemAnswered = -> 
  Meteor.call 'isAnswered', Session.get('selectedProblemId'),
    (err, answered) -> Session.set("answered", answered)
  Session.get("answered")

Template.editProblem.events 
  'submit form': (event, template) ->
    event.preventDefault()

    properties =
      _id: Session.get("selectedProblemId")
      title: template.find("#title").value
      description: template.find("#description").value
      maxScore: parseInt template.find("#max-score").value
      minScore: parseInt template.find("#min-score").value
      solution: template.find("#solution").value
      created: new Date
      
    Meteor.call 'editProblem', properties,
      (err, problemId) ->
        if problemId then Router.go "showProblem", _id: problemId


