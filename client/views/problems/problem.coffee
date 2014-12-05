Template.showProblem.events
  'submit form': (event, template) ->
    $('#success-message').hide()
    $('#fail-message').hide()
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
          $('button').prop('disabled', true)
          Meteor.setInterval( ->
            $('button').prop('disabled', false)
          , 15000)


  'click #revealAnswer': ->
    Meteor.call 'retrieveAnswer', Session.get('selectedProblemId'),
      (err, res) ->  
        if res
          $('#revealAnswer').hide();
          $('#answer').text('Løsning: ' + res);
        else
          $('#revealAnswer').hide();
          $('#answer').text('Du får ikke lov til å se løsningen til denne luken.');
