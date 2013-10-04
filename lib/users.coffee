@isAdmin = (user) ->
  user and user.isAdmin

@isAdminById = (userId) ->
  user = Meteor.users.findOne(userId)
  isAdmin(user)
