Template.showProblem.wrongAnswer = ->  
  Session.get(Session.get('selectedProblemId'))  

Template.showProblem.events
  'submit form': (event, template) ->
    event.preventDefault() # don't reload the page on submit
    answer = template.find("#answer").value.trim()
    if answer
      Meteor.call 'checkAnswer', answer, Session.get('selectedProblemId'), #use template.data._id instead of session object her
      (err, res) ->  
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

  'click .delete-link': (event, template) ->
    if confirm("Are you sure?")
      Problems.remove template.data.problem._id
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
  #<textarea id="description" class="form-control hidden" name="description" placeholder="Description">&lt;span style="color: rgb(51, 51, 51);"&gt;Description&lt;/span&gt;</textarea>

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
