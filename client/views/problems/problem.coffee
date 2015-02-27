Template.showProblem.events
  'submit .answer-form': (event, template) ->
    $('#success-message').hide()
    $('#fail-message').hide()
    event.preventDefault() # don't reload the page on submit
    answer = template.find("#solution").value.trim()
    if answer
      Meteor.call 'checkAnswer', answer, template.data._id,
      (err, res) ->
        Deps.flush() #Force dom update before we jquery it!
        if res
          $('#success-message').show()
        else
          $('#fail-message').show()
          $('button').prop('disabled', true)
          Meteor.setInterval( ->
            $('button').prop('disabled', false)
          , 15000)


  'click #revealAnswer': (event, template) ->
    Meteor.call 'retrieveAnswer', template.data._id,
      (err, res) ->  
        if res
          $('#revealAnswer').hide();
          $('#answer').text('Solution: ' + res);
        else
          $('#revealAnswer').hide();
          $('#answer').text('You are not allowed to see the solution to this problem.');

  Template.showProblem.helpers
    comment_form: ->
      return getTemplate('comment_form');
    comment_list: ->
      return getTemplate('comment_list');
