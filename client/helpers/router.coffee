Router.map ->
  @route "home", path: "/"
  @route "leaderboard"
  @route "problems"
  @route "showProblem",
    path: "/problems/:_id"
    data: -> problem: Problems.findOne @params._id #make this work with notFoundTemplate
  @route "newProblem"
  @route "rules"
  @route "notFound", path: "*"


Router.configure
  layout: "layout"
  notFoundTemplate: "notFound"


# Custom controller. Enables us to hightlight current problem in sidebar
class @ShowProblemController extends RouteController
  onBeforeRun: ->
    Session.set("selectedProblemId", @params._id)

# Go to the last shown problem or last added problem
class @ProblemsController extends RouteController
  onBeforeRun: ->
    if Session.get "selectedProblemId"
      id = Session.get "selectedProblemId"
    else
      problem = Problems.findOne {}, {sort: {created: -1}}
      id = problem._id
    Router.go "showProblem", _id: id
