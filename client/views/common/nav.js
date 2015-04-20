Template.nav.onRendered (function () {
    var self = this;

    this.autorun(function() { // Reactively update on the admin property
        if (isAdmin(Meteor.user())) {
            Meteor.defer(function() { // Defer execution until the browser has had the chance to render dropdown
                self.$(".dropdown-button").dropdown({hover: false});
                self.$('.collapsible').collapsible();
            });
        }
    });

    this.$(".button-collapse").sideNav();
});


Template.nav.events({
    'click .signOut': function() {
        Meteor.logout();
    }
});
