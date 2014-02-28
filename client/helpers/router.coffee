Router.map ->
  @route "home", path: "/"
  @route "leaderboard",
    data: ->
      problems: Problems.find().count()
      users: Users.find({}, {sort: {score: -1}})
  @route "problems",
    template: "sidebar"
  @route "showProblem",
    path: "/problems/:_id"
    data: -> problem: Problems.findOne @params._id #make this work with notFoundTemplate
  @route "newProblem"
  @route "editProblem",
    path: "/problems/edit/:_id"
    data: -> problem: Problems.findOne @params._id
  @route "user",
    path: "/users/:_id"
    data: ->
      user: Meteor.users.findOne(@params._id)
      problemCount: Problems.find().count()
  @route "rules"
  @route "notFound", path: "*"


Router.configure
  layoutTemplate: "layout"
  notFoundTemplate: "notFound"


# Custom controller. Enables us to hightlight current problem in sidebar
class @ShowProblemController extends RouteController
  before: ->
    Session.set("selectedProblemId", @params._id)
    Session.set("uploadedFile", null)
    Session.set("uploadStarted", null)

# Go to the last shown problem or last added problem
class @ProblemsController extends RouteController
  before: ->
    if Session.get "selectedProblemId"
      id = Session.get "selectedProblemId"
    else
      problem = Problems.findOne {}, {sort: {created: -1}}
      id = problem._id
    Router.go "showProblem", _id: id
