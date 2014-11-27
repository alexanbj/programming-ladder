Meteor.subscribe 'userIsAdmin'

# hack to set the language attribute on the html tag, since Meteor doesn't seem to allow me to define the html tag
Meteor.startup ->
  $('html').attr('lang', 'no')
