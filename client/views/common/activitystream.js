Template.activitystream.activities = function() {
    return ActivityStream.find();
}

Template.activitystream.urlify = function() {
    switch (entity.objectType) {
        case "problem":
            return Router.routes['showProblem'].path({_id:entity.id});
    }

}
