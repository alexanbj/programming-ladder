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

  'click #revealAnswer': ->
    Meteor.call 'retrieveAnswer', Session.get('selectedProblemId'),
      (err, res) ->  
        if res
          $('#revealAnswer').hide();
          $('#answer').text('Answer: ' + res);
        else
          $('#revealAnswer').hide();
          $('#answer').text('You are not allowed to see the answer to this problem.');

Template.showProblem.helpers
  solvedOrNoLongerActive: ->
    if this.activeTo < Date.now() then return true
    if this.answers and this.answers[0] and this.answers[0].solved then return true
    return false
  panelClass: ->
    if this.answers and this.answers[0].solved then return "panel-success"

    if this.activeTo < Date.now() then return "panel-warning"

    return "panel-default"
  solved: ->
    this.answers and this.answers[0]?.solved
  score: ->
    #If the user has attempted to solve this problem, we retrieve 'that' score, else we get the attainable points for this problem
    if this.answers and this.answers[0] then return this.answers[0].score else this.maxScore
  stats: ->
    ProblemStats.findOne();


