@isAdmin = (user) ->
  if user and user.isAdmin then true else false

@isAdminById = (userId) ->
  user = Meteor.users.findOne(userId)
  user and isAdmin(user)