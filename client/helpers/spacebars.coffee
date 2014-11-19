UI.registerHelper 'currentIsAdmin', ->
  isAdmin Meteor.user()

UI.registerHelper 'activeClassByRoute', (route) ->
  currentRoute = Router.current()
  if (!currentRoute)
    return ''
  regex = new RegExp(route, "i")
  if regex.test(currentRoute.route.name)
    return 'active'

UI.registerHelper 'formatDate', (date) ->
  if (moment().isSame(date, 'day'))
    moment(date).format('HH:mm')
  else
    moment(date).format('MMM D')

UI.registerHelper 'percentage', (x, y) ->
  (x/y) * 100

UI.registerHelper 'dateFormat', (date, dateFormat) ->
  if date then moment(date).format(dateFormat)