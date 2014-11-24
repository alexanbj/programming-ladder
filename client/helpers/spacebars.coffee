UI.registerHelper 'currentIsAdmin', ->
  isAdmin Meteor.user()

UI.registerHelper 'formatDate', (date) ->
  if (moment().isSame(date, 'day'))
    moment(date).format('HH:mm')
  else
    moment(date).format('MMM D')

UI.registerHelper 'dateFormat', (date, dateFormat) ->
  if date then moment(date).format(dateFormat)

UI.registerHelper 'isDateBeforeNow', (date) ->
  return date > Date.now()

UI.registerHelper 'isDateAfterNow', (date) ->
  return date < Date.now()
