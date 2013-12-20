Meteor.startup ->
  @Spawn = Npm.require('child_process').spawn
  @Future = Npm.require('fibers/future')
  @FS = Npm.require('fs')  

Meteor.methods
  checkAnswer: (answer, problemId) ->
    if not Meteor.userId()
      throw new Meteor.Error 601, "You need to be logged in to do that"

    serverCheckAnswer answer, problemId, Meteor.userId()

  revealAnswer: (problemId) ->
    userId = Meteor.userId()
    problem = Problems.findOne problemId
    return problem.solution

  compileFile: (fileId) ->
    if not Meteor.userId()
      throw new Meteor.Error 601, "You need to be logged in to do that"

    fileRecord = CodeFiles.findOne({_id: fileId})
    blob = CodeFiles.retrieveBuffer(fileId)
    problemId = fileRecord.metadata["problemId"]

    if Meteor.userId() != fileRecord.owner
      throw new Meteor.Error 500, "Somethingh weird happend .. "

    if fileRecord.contentType == "text/x-java"             
      path = "/tmp/" + fileRecord.owner

      if not FS.existsSync(path)
        FS.mkdir path
      output = ""

      fsFuture = new Future

      FS.writeFile path + "/" + fileRecord.filename, blob , (err) ->
        if err? console.log err
        else 
          fsFuture.return("")

      fsFuture.wait()
      if compileJava(problemId, path, fileRecord.filename) == 0
        output = runJava problemId, path, fileRecord.filename
        console.log output           
        return serverCheckAnswer output, problemId, fileRecord.owner

    return false 

# Removes all whitespace and lowercases it. Perhaps we should remove special chars as well?
@sanitize = (string) ->
  string.replace(/\s+|\s+$/g, "").toLowerCase()

@serverCheckAnswer = (answer, problemId, userId) ->
  problem = Problems.findOne problemId # TODO: Do some error handling if no problem is found? 

  # If the user has tried and failed to solve this before. Get the current score value for this problem for this user
  previousAnswer = problem.answers?.filter (x) -> x.userId is userId
  if previousAnswer
    if previousAnswer[0]?.solved then return # Don't trust the client
    score = previousAnswer[0]?.score

  # Check if user submitted the correct answer and take appropriate action
  if sanitize(answer) is sanitize(problem.solution)
    if score # Hooray, we answered correctly. Set boolean to true
      Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$set: {'answers.$.solved': true}})
    else # Insert new answer array, with max points!
      Problems.update problemId, {$push: {answers: {userId: userId, score: problem.maxScore, solved: true}}}
    # Increment the score for the user accordingly
    score = if score then score else problem.maxScore
    Meteor.users.update userId, {$inc: {score: score, solved: 1}}
    return true
  else 
    if not score # Insert new answer array, decrement maximum score
      Problems.update problemId, {$push: {answers: {userId: userId, score: problem.maxScore - 1, solved:false}}}
    else if score > problem.minScore # Decrement possible score for this problem
      Problems.update({_id: problemId, answers: {$elemMatch: {userId: userId}}}, {$inc: {'answers.$.score': -1}})
    return false 

@compileJava = (problemId, path, file) -> 
  prc = Spawn('javac', [path + "/" + file], {stdio:'pipe'})
  prc.stdout.setEncoding('utf8') 

  console.log ("Running: javac " + path + "/" + file)
  prc.stdout.on 'data', (data) ->        
    console.log("Compilelog:\n" + data)    
  
  future = new Future

  prc.on 'close', (code) -> 
    console.log("Compile exitcode: " + code)
    future.return(code)
   
  prc.stdin.end()
  future.wait()
  return future.get() 

@runJava = (problemId, path, name) ->
  prc = Spawn('java', ["-cp", path, name.replace(/.java/, "")], {stdio:'pipe'})
  prc.stdout.setEncoding('utf8')    

  console.log ("Running: java -cp " +  path + " " + name.replace(/.java/, ""))

  future = new Future

  prc.stdout.on 'data', (data) -> 
    future.return data      

  prc.stderr.on 'data', (data) ->        
    console.log("Error:\n" + data)

  prc.on 'close', (code) -> 
    console.log("Run exitcode: " + code)

  prc.stdin.end() 
  
  future.wait()
  return future.get()
