@Users = Meteor.users

Users.allow
  insert: -> false
  update: ->
    isAdmin Meteor.user()
  remove: ->
    isAdmin Meteor.user()


if Meteor.isServer
  Accounts.onCreateUser (options, user) ->
    user.score = 0
    user.solved = 0
    user.isAdmin = false
    user

  # When a user is deleted, clean up the problems where user has answered
  Users.after.remove (userId, user) ->
    Problems.update({}, {$pull: {answers: {userId: user._id}}}, {multi: true})
