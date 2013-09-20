Router.map ->
  @route "home", path: "/"
  @route "leaderboard"
  @route "problems"
  @route "showProblem",
    path: "/problems/:_id"
    data: -> problem: Problems.findOne @params._id #make this work with notFoundTemplate
  @route "newProblem"
  @route "editProblem",
    path: "/problems/edit/:_id"
    data: -> problem: Problems.findOne @params._id
  @route "rules"
  @route "notFound", path: "*"


Router.configure
  layout: "layout"
  notFoundTemplate: "notFound"


# Custom controller. Enables us to hightlight current problem in sidebar
class @ShowProblemController extends RouteController
  onBeforeRun: ->
    Session.set("selectedProblemId", @params._id)

class @EditProblemController extends RouteController
  onBeforeRun: ->
    Session.set("selectedProblemId", @params._id)
