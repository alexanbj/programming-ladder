Template.nav.rendered = function () {
    this.$(".dropdown-button").dropdown({hover: false});
    this.$(".button-collapse").sideNav();
};


Template.nav.events({
    'click .signOut': function() {
        Meteor.logout();
    }
});
