# Users
Meteor.publish 'allUsers', ->
    if isAdminById @userId
      Meteor.users.find() # Change this to have admins only see the fields they need...
    else
      Meteor.users.find {}, fields:
        username: true
        score: true


# Problems
Meteor.publish 'problems', ->
  if @userId
    Problems.find {}, fields:
      answers: {$elemMatch: {userId: @userId}} #Only get the answer object for the logged in user
      maxScore: true
      title: true
      description: true
      solution: true
  else 
    Problems.find {}, fields:
      title: true
      description: true
