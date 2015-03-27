countSolved = function(answers) {
    return _.size(_.where(answers, {solved: true}));
};

calculateMaxScore = function(answers) {
    var max = _.max(_.where(answers, {solved: true}), function(answer){ return answer.score; });
    if (max.score) {
        return max.score;
    }
    return -max;
};

calculateMinScore = function(answers) {
    var min = _.min(_.where(answers, {solved: true}), function(answer){ return answer.score; });

    if (min.score) {
        return min.score;
    }
    return -min;
};

calculateAverageScore = function(answers) {

    var solved = _.where(answers, {solved: true});
    var sum = _.reduce(solved, function(memo, num){ return memo + num.score; }, 0);

    if (sum === 0) {
        return 0;
    }

    return (sum / _.size(solved)).toFixed(2);
};
