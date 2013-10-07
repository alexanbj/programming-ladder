Template.leaderboard.events
  'click .admin-toggle': ->
    # Do not allow to unadmin of yourself
    Meteor.users.update this._id, { $set: { isAdmin: !this.isAdmin }} unless this._id == Meteor.user()._id

  'click .delete-user': (event, template) ->
    if confirm("Are you sure you want to delete the user #{this.username}?")
      Meteor.users.remove this._id
