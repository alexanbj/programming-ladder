# Users
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
    score: true
    solved: true
  }

  if isAdminById @userId
    fields = _.extend fields,
      isAdmin: true

  Meteor.users.find {}, fields: fields

Meteor.publish 'user', (userId) ->
  Meteor.users.find {_id: userId}, fields:
    username: true
    score: true
    solved: true

Meteor.publish 'currentUser', ->
  if @userId
    Meteor.users.find {_id: @userId}
  else
    []

Meteor.publish 'problems', ->
  if @userId
    Problems.find {}, fields:
      title: true
      created: true
      answers: {$elemMatch: {userId: @userId}}
  else
    []

Meteor.publish 'problem', (problemId) ->

  fields = {
    answers: {$elemMatch: {userId: @userId}}
    title: true
    maxScore: true
    minScore: true
    created: true
    description: true
  }

  if isAdminById @userId
    fields = _.extend fields,
      solution: true

  if @userId
    Problems.find({_id: problemId}, fields: fields)
  else
    []

Meteor.publish 'problemStats', (problemId) ->
  self = this
  average = 0
  solved = 0
  max = 0
  min = 0

  #TODO: This is calculated for every client viewing the same problem.... Seems unnecessary?
  handle = Problems.find({_id: problemId}, fields: {answers: true}).observeChanges(
    changed: (id, doc) ->
        if doc.answers
          newSolved = countSolved(doc.answers)
          if newSolved != solved # The calculations will change only if there is a new person who has solved it
            solved = newSolved
            min = calculateMinScore(doc.answers)
            max = calculateMaxScore(doc.answers)
            average = calculateAverageScore(doc.answers)
            self.changed('problemStats', problemId, {averageScore: average, solveCount: solved, maxScore: max, minScore: min})
    added: (id, doc) ->
      if doc.answers
        min = calculateMinScore(doc.answers)
        max = calculateMaxScore(doc.answers)
        solved = countSolved(doc.answers)
        average = calculateAverageScore(doc.answers)
  )

  self.added('problemStats', problemId, {averageScore: average, solveCount: solved, maxScore: max, minScore: min})
  self.ready()

  self.onStop ->
    handle.stop()
