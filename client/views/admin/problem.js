Template.editProblem.created = function() {
    var description = Template.instance().data.problem.description;
    this.markdownPreview = new ReactiveVar(marked(description));
};
Template.editProblem.events({
    'click .preview': function (e, instance) {
        var description = instance.find("textarea[name='description']").value;
        instance.markdownPreview.set(marked(description));
    }
});

Template.editProblem.helpers({
    preview: function() {
        return Template.instance().markdownPreview.get();
    }
});