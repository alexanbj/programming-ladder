Router.map ->
  @route "home",
    path: "/"
    yieldTemplates:
      "jumbotron": to: "jumbotron"
    waitOn: -> Meteor.subscribe 'leaderboard'
    data: ->
      users: Users.find({}, {sort: {score: -1}, limit: 3})

  @route "leaderboard",
    waitOn: -> Meteor.subscribe 'leaderboard'
    data: ->
      users: Users.find({}, {sort: {score: -1}})
      #problems: Problems.find().count()

  @route "showProblem",
    path: "/problems/:_id"
    waitOn: -> Meteor.subscribe 'problem', @params._id
    data: -> Problems.findOne @params._id

  @route "problems",
    path: "/problems"

  @route "newProblem"
  @route "editProblem",
    path: "/problems/edit/:_id"
    data: -> problem: Problems.findOne @params._id

  @route "user",
    path: "/users/:_id"
    waitOn: -> Meteor.subscribe 'user', @params._id
    data: ->
      user: Meteor.users.findOne(@params._id)
      problemCount: Problems.find().count()

  @route "rules",
    progress:
      enabled: false

  @route "notFound",
    path: "*"


Router.configure
  layoutTemplate: "layout"
  notFoundTemplate: "notFound"

IronRouterProgress.configure
  spinner: false


# Custom controller. Enables us to hightlight current problem in sidebar
class @ShowProblemController extends RouteController
  onBeforeAction: ->
    Session.set("selectedProblemId", @params._id)

# Go to the last shown problem or last added problem
class @ProblemsController extends RouteController
  waitOn: -> Meteor.subscribe 'problems'
  onBeforeAction: ->
    if Session.get "selectedProblemId"
      id = Session.get "selectedProblemId"
    else if @ready()
      problem = Problems.findOne {}, {sort: {created: -1}}
      id = problem._id
    if id
      Router.go "showProblem", _id: id
