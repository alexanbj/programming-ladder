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
    },
    comment_form: function() {
        return getTemplate('comment_form');
    },
    comment_list: function() {
        return getTemplate('comment_list');
    }
});

Template.showProblem.events = {
    'submit .answer-form': function(event, template) {
        $('#success-message').hide();
        $('#fail-message').hide();
        event.preventDefault(); //don't reload the page on submit
        var answer = template.find("#solution").value.trim();
        if (answer) {
            Meteor.call('checkAnswer', answer, template.data._id, function (err, res) {
                Deps.flush(); //Force dom update before we jquery it!
                if (res) {
                    $('#success-message').show();
                } else {
                    $('#fail-message').show();
                    $('button').prop('disabled', true);
                    Meteor.setInterval(function () {
                        $('button').prop('disabled', false);
                    }, 1500);
                }
            });
        }
    },
    'click #revealAnswer': function(event, template) {
        Meteor.call('retrieveAnswer', template.data._id, function (err, res) {
            if (res) {
                $('#revealAnswer').hide();
                $('#answer').text('Solution: ' + res);
            } else {
                $('#revealAnswer').hide();
                $('#answer').text('You are not allowed to see the solution to this problem.');
            }
        });
    }
};
