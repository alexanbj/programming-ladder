@Users = Meteor.users

Users.allow
  insert: -> false
  update: ->
    isAdmin Meteor.user()
  remove: ->
    isAdmin Meteor.user()


if Meteor.isServer
  # When a user is deleted, clean up the problems where user has answered
  Users.after.remove (userId, user) ->
    Problems.update({}, {$pull: {answers: {userId: user._id}}}, {multi: true})
