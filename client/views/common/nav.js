Template.nav.helpers({
    activeIfTemplateIs: function(template) {
        var currentRoute = Router.current().route.getName();
        return currentRoute && template === currentRoute ? 'active' : '';
    }
});

Template.nav.events({
    'click #signOut': function() {
        Meteor.logout();
    }
});