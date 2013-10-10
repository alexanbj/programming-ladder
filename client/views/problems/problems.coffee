Template.showProblem.events
  'submit form': (event, template) ->
    event.preventDefault() # don't reload the page on submit
    answer = template.find("#answer").value.trim()
    if answer
      Meteor.call 'checkAnswer', answer, Session.get('selectedProblemId'), #use template.data._id instead of session object her
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

  'click .delete-link': ->
    if confirm("Are you sure?")
      Problems.remove this._id
      Session.set('selectedProblemId', null)
      Router.go "problems"

  'click .edit-problem': (event, template) ->
     Router.go "editProblem", _id: Session.get('selectedProblemId')

Template.newProblem.events
  'submit form': (event, template) ->
    event.preventDefault()
    $('#description').val($('#description-editor').cleanHtml()) # Set text from wysiwyg editor to description textarea

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
  $('.editor').wysiwyg({
    hotKeys: { # Disable hotkeys
    }
  })

Template.editProblem.rendered = ->
  $('.editor').wysiwyg({
    hotKeys: { # Disable hotkeys
    }
  })

  content = $('#description').html().replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  $('#description-editor').html(content);

Template.editProblem.problemAnswered = -> 
  Meteor.call 'isAnswered', Session.get('selectedProblemId'),
    (err, answered) -> Session.set("answered", answered)
  Session.get("answered")

Template.editProblem.events 
  'submit form': (event, template) ->
    event.preventDefault()
    $('#description').val($('#description-editor').cleanHtml()) # Set text from wysiwyg editor to description textarea

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
