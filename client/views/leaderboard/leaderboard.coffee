Template.leaderboard.users = ->
  Meteor.users.find({}, {sort: {score: -1}})