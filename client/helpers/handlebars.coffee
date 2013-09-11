Handlebars.registerHelper 'isAdmin', ->
  isAdmin Meteor.user()
