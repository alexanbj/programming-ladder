Handlebars.registerHelper 'isAdmin', ->
  isAdmin Meteor.user()

Handlebars.registerHelper 'activeClassByRoute', (route) ->
  currentRoute = Router.current()
  if (!currentRoute)
    return ''
  regex = new RegExp(route, "i")
  if regex.test(currentRoute.route.name)
    return 'active'
