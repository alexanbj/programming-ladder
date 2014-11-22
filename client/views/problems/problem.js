var tickingDate = new Date();

minuteTick = new Tracker.Dependency;

Meteor.setInterval(function () {
    setTickingDate(new Date());
}, 60000);

var getTickingDate = function() {
    minuteTick.depend();
    return tickingDate;
};

var setTickingDate = function() {
    tickingDate = new Date();
    minuteTick.changed();
}

Template.showProblem.helpers({
    solvedOrNoLongerActive: function() {
        if (this.answers && this.answers[0].solved) {
            return true;
        } else if (this.activeTo && this.activeTo < getTickingDate()) {
            return true;
        } else {
            return false;
        }
    },
    panelClass: function() {
        if (this.answers && this.answers[0].solved) {
            return "panel-success";
        } else if (this.activeTo && this.activeTo < getTickingDate()) {
            return "panel-warning";
        } else {
            return "panel-default";
        }
    },
    solved: function() {
        return this.answers && this.answers[0].solved;
    },
    score: function() {
        //If the user has attempted to solve this problem, we retrieve 'that' score, else we get the attainable points for this problem
        if (this.answers && this.answers[0]) {
            return this.answers[0].score;
        } else {
            return this.maxScore;
        }
    },
    stats: function() {
        return ProblemStats.findOne();
    }
});
