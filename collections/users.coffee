if Meteor.isServer
  Accounts.onCreateUser (options, user) ->
    user.score = 0
    user.isAdmin = false
    user