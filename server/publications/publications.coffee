Meteor.publish 'activityStream', ->
  ActivityStream.find {}, {sort: {created_at: -1}, limit: 15}

Meteor.publish 'leaderboard', ->
  fields = {
    username: true
    score: true
    solved: true
    lastSolved: true
  }
  Meteor.users.find {isAdmin: false}, fields: fields

Meteor.publish 'currentUser', ->
  if @userId
    Meteor.users.find {_id: @userId}
  else
    []

Meteor.publish 'problems', ->
  Problems.find {draft: false}, fields:
    title: true
    activeFrom: true
    activeTo: true
    answers: {$elemMatch: {userId: @userId}}

Meteor.publish 'problem', (problemId) ->

  fields = {
    answers: {$elemMatch: {userId: @userId}}
    title: true
    activeFrom: true
    activeTo: true
    description: true
    maxScore: true
    minScore: true
    htmlDescription: true
  }

  Problems.find({_id: problemId, draft: false, activeFrom: {$lte: new Date()}}, fields: fields)

Meteor.publish 'problemComments', (problemId) ->
  Comments.find({problemId: problemId})

Meteor.publish 'problemStats', (problemId) ->
  self = this
  solved = 0
  average = 0
  highest = 0
  lowest = 0

  #TODO: This is calculated for every client viewing the same problem.... Seems unnecessary?
  handle = Problems.find({_id: problemId}, fields: {answers: true}).observeChanges(
    changed: (id, doc) ->
        if doc.answers
          solved = countSolved(doc.answers)
          lowest = calculateMinScore(doc.answers)
          highest = calculateMaxScore(doc.answers)
          average = calculateAverageScore(doc.answers)
          self.changed('problemStats', problemId, {average: average, highest: highest, lowest: lowest, solved: solved})
    added: (id, doc) ->
      if doc.answers
        solved = countSolved(doc.answers)
        lowest = calculateMinScore(doc.answers)
        highest = calculateMaxScore(doc.answers)
        average = calculateAverageScore(doc.answers)
  )

  self.added('problemStats', problemId, {average: average, highest: highest, lowest: lowest, solved: solved})
  self.ready()

  self.onStop ->
    handle.stop()
