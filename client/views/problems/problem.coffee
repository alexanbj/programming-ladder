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
    Meteor.call 'retrieveAnswer', Session.get('selectedProblemId'),
      (err, res) ->  
        if res
          $('a#revealAnswer').popover({placement:'right', content: res, trigger: "manual"})
          $('a#revealAnswer').popover('toggle')
          $('a#revealAnswer').addClass('disabled')

  'click #edit-problem': ->
     Router.go "editProblem", _id: Session.get('selectedProblemId')

Template.showProblem.stats = ->
  ProblemStats.findOne();

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
