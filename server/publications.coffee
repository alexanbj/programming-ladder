# Users
Meteor.publish 'userIsAdmin', ->
  if isAdminById @userId
    Meteor.users.find {_id: @userId}, fields:
      isAdmin: true

Meteor.publish 'activityStream', ->
  ActivityStream.find {}, {sort: {published: 1}, limit: 10}

Meteor.publish 'settings', ->
  if isAdminById @userId
    Settings.find {}, {}

Meteor.publish 'leaderboard', ->
  Meteor.users.find {}, fields:
    username: true
    score: true
    solved: true
    isAdmin: true

Meteor.publish 'user', (userId) ->
  Meteor.users.find {_id: userId}, fields:
    username: true
    score: true
    solved: true

Meteor.publish 'currentUser', ->
  if @userId
    Meteor.users.find {_id: @userId}

Meteor.publish 'problems', ->
  if @userId
    Problems.find {}, fields:
      title: true
      created: true
      answers: {$elemMatch: {userId: @userId}}

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
