UI.registerHelper 'currentIsAdmin', ->
  isAdmin Meteor.user()

UI.registerHelper 'activeClassByRoute', (route) ->
  currentRoute = Router.current()
  if (!currentRoute)
    return ''
  regex = new RegExp(route, "i")
  if regex.test(currentRoute.route.name)
    return 'active'

#UI.registerHelper 'addIndex', (collection) ->
#  collection.map (val, index) -> {index: index, value: val}
#

UI.registerHelper 'percentage', (x, y) ->
  (x/y) * 100
