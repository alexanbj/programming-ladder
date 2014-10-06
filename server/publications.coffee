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
    answers: true
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
