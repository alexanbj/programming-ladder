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
};

var tickingSecond = new Date();
secondTick = new Tracker.Dependency;

Meteor.setInterval(function () {
    setTickingSecond(new Date());
}, 1000);

var getTickingSecond = function() {
    secondTick.depend();
    return tickingSecond;
};

var setTickingSecond = function() {
    tickingSecond = new Date();
    secondTick.changed();
};

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
    solved: function() {
        return this.answers && this.answers[0].solved;
    },
    scoreOrMax: function() {
        return this.answers && this.answers[0] ? this.answers[0].score : this.maxScore;
    },
    stats: function() {
        return ProblemStats.findOne();
    },
    problemEnds: function() {
        var diff = this.activeTo - getTickingSecond();
        var duration = moment.duration(diff, 'milliseconds');
        return duration.hours() + ' timer, ' + duration.minutes() + ', minutter og ' + duration.seconds() + ' sekunder';
    }
});
