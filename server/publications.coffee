Meteor.publish 'userIsAdmin', ->
  if isAdminById @userId
    Meteor.users.find {_id: @userId}, fields:
      isAdmin: true
  else
    []

Meteor.publish 'activityStream', ->
  ActivityStream.find {}, {sort: {created_at: -1}, limit: 10}

Meteor.publish 'settings', ->
  if isAdminById @userId
    Settings.find {}, {}
  else
    []

Meteor.publish 'leaderboard', ->
  fields = {
    username: true
    solved: true,
    lastSolved: true
  }
  Meteor.users.find {isAdmin: false}, fields: fields

Meteor.publish 'currentUser', ->
  if @userId
    Meteor.users.find {_id: @userId}
  else
    []

Meteor.publish 'problems', ->
  Problems.find {draft: false}, fields:
    title: true
    activeFrom: true
    activeTo: true
    answers: {$elemMatch: {userId: @userId}}

Meteor.publish 'problem', (problemId) ->

  fields = {
    answers: {$elemMatch: {userId: @userId}}
    title: true
    activeFrom: true
    activeTo: true
    description: true
  }

  Problems.find({_id: problemId, draft: false, activeFrom: {$lte: new Date()}}, fields: fields)

Meteor.publish 'problemStats', (problemId) ->
  self = this
  solved = 0
  solveAttempts = 0

  #TODO: This is calculated for every client viewing the same problem.... Seems unnecessary?
  handle = Problems.find({_id: problemId}, fields: {answers: true}).observeChanges(
    changed: (id, doc) ->
        if doc.answers
          solved = countSolved(doc.answers)
          solveAttempts = doc.answers.length - solved
          self.changed('problemStats', problemId, {solveCount: solved, solveAttempts: solveAttempts})
    added: (id, doc) ->
      if doc.answers
        solved = countSolved(doc.answers)
        solveAttempts = doc.answers.length - solved
  )

  self.added('problemStats', problemId, {solveCount: solved, solveAttempts: solveAttempts})
  self.ready()

  self.onStop ->
    handle.stop()
