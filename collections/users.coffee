@Users = Meteor.users

Users.allow
  insert: -> true
  update: ->
    isAdmin Meteor.user()
  remove: ->
    isAdmin Meteor.user()


if Meteor.isServer
  Accounts.onCreateUser (options, user) ->
    user.score = 0
    user.isAdmin = false
    user