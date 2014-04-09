# Users
Meteor.publish 'userIsAdmin', ->
  if isAdminById @userId
    Meteor.users.find {_id: @userId}, fields:
      isAdmin: true

Meteor.publish 'leaderboard', ->
  Meteor.users.find {}, fields:
    username: true
    score: true
    solved: true

Meteor.publish 'user', (userId) ->
  Meteor.users.find {_id: userId}, fields:
    username: true
    score: true
    solved: true

# Problems
#Meteor.publish 'problems', ->
#  if isAdminById @userId
#    Problems.find {}, fields:
#      answers: {$elemMatch: {userId: @userId}} #Only get the answer object for the logged in user
#      maxScore: true
#      minScore: true
#      title: true
#      description: true
#      created: true
#      solution: true

Meteor.publish 'problems', ->
  if @userId
    Problems.find {}, fields:
      title: true
      created: true

Meteor.publish 'problem', (problemId) ->
  if @userId
    Problems.find {_id: problemId}, fields:
      answers: {$elemMatch: {userId: @userId}} #Only get the answer object for the logged in user
      title: true
      maxScore: true
      minScore: true
      created: true
      description: true

Meteor.publish 'uploadedFiles', -> 
  if @userId 
    CodeFiles.find {owner: @userId}
