Template.showProblem.events
  'submit form': (event, template) ->
    event.preventDefault() # don't reload the page on submit
    answer = template.find("#answer").value.trim()
    if answer
      Meteor.call 'checkAnswer', answer, Session.get('selectedProblemId'), #use template.data._id instead of session object here
      (err, res) ->  
        Deps.flush() #Force dom update before we jquery it!
        if res
          $('#success-message').show()
        else
          $('#fail-message').show()

  'click a#revealAnswer': (event) ->
    event.preventDefault()
    Meteor.call 'revealAnswer', Session.get('selectedProblemId'),
      (err, res) ->  
        if res
          $('a#revealAnswer').popover({placement:'right', content: res, trigger: "manual"})
          $('a#revealAnswer').popover('toggle')
          $('a#revealAnswer').addClass('disabled')

  'click #delete-problem': ->
    if confirm("Are you sure?")
      Problems.remove this._id
      Session.set('selectedProblemId', null)
      Router.go "problems"

  'click #edit-problem': ->
     Router.go "editProblem", _id: Session.get('selectedProblemId')

Template.showProblem.solveCount = ->
  if not this.answers then return 0

  count = 0
  count += 1 for answer in this.answers when answer.solved is true
  return count

Template.showProblem.avgScore = ->
  if not this.answers then return 0

  avg = 0
  i = 0
  (avg += answer.score) and (i=i+1) for answer in this.answers when answer.solved is true

  if avg == 0 then return 0

  return avg / i

Template.showProblem.highestScore = ->
  if not this.answers then return

  _.max(answer.score for answer in this.answers when answer.solved is true)

Template.showProblem.lowestScore = ->
  if not this.answers then return

  _.min(answer.score for answer in this.answers when answer.solved is true)



Template.showProblem.solved = ->
  if not this.answers then return false

  for answer in this.answers
    if answer.userId == Meteor.userId() then return answer.solved

  return false


#If the user has attempted to solve this problem, we retrieve 'that' score, else we get the attainable points for this problem
Template.showProblem.score = ->
  if not this.answers then return this.maxScore

  for answer in this.answers
    if answer.userId == Meteor.userId() then return answer.score

  return this.maxScore



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

Template.newProblem.rendered = ->
  $('#description').wysihtml5();

Template.editProblem.rendered = ->
  $('#description').wysihtml5();

Template.editProblem.problemAnswered = ->
  this.answers && this.answers.length > 0

Template.editProblem.events 
  'submit form': (event, template) ->
    event.preventDefault()

    properties =
      _id: this._id
      title: template.find("#title").value
      description: template.find('#description').value
      maxScore: parseInt template.find("#max-score").value
      minScore: parseInt template.find("#min-score").value
      solution: template.find("#solution").value
      created: new Date
    
    Meteor.call 'editProblem', properties,
      (err, problemId) ->
        if problemId then Router.go "showProblem", _id: problemId
