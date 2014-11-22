Template.sidebar.helpers({
    selected: function() {
        if (Session.equals('selectedProblemId', this._id)) {
            return 'active';
        } else {
            return '';
        }
    },
    problems: function() {
        return Problems.find({}, {sort: {activeFrom : 1}});
    }
});
