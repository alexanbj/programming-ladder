Handlebars.registerHelper 'currentIsAdmin', ->
  isAdmin Meteor.user()

Handlebars.registerHelper 'activeClassByRoute', (route) ->
  currentRoute = Router.current()
  if (!currentRoute)
    return ''
  if currentRoute.route.name == route
    return 'active'
