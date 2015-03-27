//Global subscriptions. Not route specific
Meteor.subscribe('currentUser');
Meteor.subscribe('settings');
// client side specific location. Probably shouldn't be here
ProblemStats = new Mongo.Collection('problemStats');

Router.map(function() {
    this.route('home', {
        path: '/'
    });

    this.route('leaderboard', {
        path: '/leaderboard',
        waitOn: function() {
            return Meteor.subscribe('leaderboard');
        }
    });

    this.route('problems', {
        path: '/problems',
        waitOn: function() {
            return Meteor.subscribe('problems');
        }
    });

    this.route('showProblem', {
        path: '/problems/:_id',
        waitOn: function() {
            return Meteor.subscribe('problem', this.params._id);
        },
        subscriptions: function() {
            return Meteor.subscribe('problemStats', this.params._id);
        },
        data: function() {
            return Problems.findOne({_id: this.params._id});
        }
    });


    // Admin stuff be here!

    this.route('settings', {
        path: '/admin/settings',
        waitOn: function() {
            return Meteor.subscribe('settings');
        },
        data: function () {
            // we only have one set of settings for now
            return {
                hasSettings: !!Settings.find().count(),
                settings: Settings.findOne()
            }
        }
    });

    this.route('adminProblems', {
        path: '/admin/problems',
        waitOn: function() {
            return Meteor.subscribe('adminProblems');
        },
        data: function() {
            return {
                active: Problems.find({draft: false}, {sort: {activeFrom: 1}}),
                drafts: Problems.find({draft: true}, {sort: {createdAt: 1}})
            }
        }
    });

    this.route('adminUsers', {
        path: '/admin/users',
        waitOn: function() {
            return Meteor.subscribe('allUsersAdmin');
        },
        data: function() {
            return {
                users: Meteor.users.find({}, {sort: {username: 1}})
            }
        }
    });

    this.route('editProblem', {
        path: '/admin/problems/edit/:_id',
        waitOn: function() {
            return Meteor.subscribe('adminProblem', this.params._id);
        },
        data: function() {
            return {
                problem: Problems.findOne({_id: this.params._id}),
                autoFormType: 'update'
            }
        }
    });

    this.route('newProblem', {
        path: '/admin/problems/edit',
        template: 'editProblem',
        data: function() {
            return {
                problem: null,
                autoFormType: 'insert'
            }
        }
    });

});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'not_found',
    loadingTemplate: 'loading',
    progressSpinner: false
});


Router._filters = {
    isAdmin: function () {
        if(!this.ready()) return;
        if(!isAdmin()){
            this.render(getTemplate('no_rights'));
        } else {
            this.next();
        }
    }
};

var filters = Router._filters;

Router.onBeforeAction(filters.isAdmin, {only: ['settings', 'adminUsers', 'adminProblems', 'editProblem', 'newProblem']});
Router.plugin('ensureSignedIn', {only: ['problems', 'showProblem']});
Router.onBeforeAction('dataNotFound');
