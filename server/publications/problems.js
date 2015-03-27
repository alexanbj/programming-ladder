Meteor.publish('problems', function() {
    var fields = {
        title: true,
        activeFrom: true,
        activeTo: true,
        answers: {$elemMatch: {userId: this.userId}}
    };

    return Problems.find({draft: false}, {fields: fields});
});

Meteor.publish('problem', function (problemId) {
    var fields = {
        answers: {$elemMatch: {userId: this.userId}},
        title: true,
        activeFrom: true,
        activeTo: true,
        description: true,
        maxScore: true,
        minScore: true,
        htmlDescription: true
    };

    return Problems.find({_id: problemId, draft: false, activeFrom: {$lte: new Date()}}, {fields: fields});
});

Meteor.publish('problemStats', function (problemId) {
    var self = this;
    var solved = 0;
    var average = 0;
    var highest = 0;
    var lowest = 0;

    //TODO: This is calculated for every client viewing the same problem.... Seems unnecessary?
    var handle = Problems.find({_id: problemId}, {fields: {answers: true}}).observeChanges({
        changed: function(id, doc) {
            if (doc.answers) {
                solved = countSolved(doc.answers);
                lowest = calculateMinScore(doc.answers);
                highest = calculateMaxScore(doc.answers);
                average = calculateAverageScore(doc.answers);
                self.changed('problemStats', problemId, {average: average, highest: highest, lowest: lowest, solved: solved});
            }
        },
        added: function (id, doc) {
            if (doc.answers) {
                solved = countSolved(doc.answers);
                lowest = calculateMinScore(doc.answers);
                highest = calculateMaxScore(doc.answers);
                average = calculateAverageScore(doc.answers);
            }
        }
    });

    self.added('problemStats', problemId, {average: average, highest: highest, lowest: lowest, solved: solved});
    self.ready();

    self.onStop(function() {
        handle.stop();
    });
});

Meteor.publish('adminProblem', function(problemId) {
    if (isAdminById(this.userId)) {
        return Problems.find({_id: problemId}, {fields: {
            title: true,
            activeFrom: true,
            activeTo: true,
            description: true,
            draft: true,
            maxScore: true,
            minScore: true,
            solution: true
        }});
    } else {
        return [];
    }
});

Meteor.publish('adminProblems', function () {
    if (isAdminById(this.userId)) {
        return Problems.find({}, {});
    } else {
        return [];
    }
});
