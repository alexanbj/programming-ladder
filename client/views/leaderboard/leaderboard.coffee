Template.leaderboard.users = ->
  Meteor.users.find({}, {sort: {score: -1}})

Template.leaderboard.events
  'submit form': (event, template) ->
    event.preventDefault()
    if isAdmin Meteor.user()
      Meteor.users.update this._id, { $set: { isAdmin: !this.isAdmin }}
