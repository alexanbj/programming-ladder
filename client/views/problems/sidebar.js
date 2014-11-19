Template.sidebar.selected = function () {
    if (Session.equals('selectedProblemId', this._id)) {
        return 'active';
    } else {
        return '';
    }
};

Template.sidebar.problems = function () {
    return Problems.find({}, {sort: {activeFrom : 1}});
};
