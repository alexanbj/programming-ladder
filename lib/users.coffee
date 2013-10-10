@isAdmin = (user) ->
  user and user.isAdmin

@isAdminById = (userId) ->
  if not userId then return false
  user = Meteor.users.findOne(userId)
  isAdmin(user)
