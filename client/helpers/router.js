//Global subscriptions. Not router specific, but since all the other subscriptions are here, whatever..
Meteor.subscribe('currentUser');
Meteor.subscribe('activityStream');
// client side specific location. Probably shouldn't be here either
ProblemStats = new Mongo.Collection('problemStats');

Router.map(function() {
    this.route('home', {
        path: '/',
        waitOn: function() {
            return Meteor.subscribe('leaderboard');
        },
        data: function() {

            var toMedalOrder = function(users){
              if (users && users.length > 2){
                var tmp = users[0];
                users[0] = users[1];
                users[1] = tmp;
                return users;
              } else {
                return users;
              }

            };
            return {
                users: toMedalOrder(Meteor.users.find({isAdmin:false}, {sort: {score: -1}, limit: 3}).fetch())
            }
        }
    });

    this.route('leaderboard', {
        waitOn: function() {
            return Meteor.subscribe('leaderboard');
        }
    });

    this.route('problems', {
        path: '/problems',
        waitOn: function() {
            return Meteor.subscribe('problems');
        },
        onBeforeAction: function() {
            var id;
            if (Session.get('selectedProblemId')) {
                id = Session.get('selectedProblemId');
            } else if (this.ready()) {
                id = Problems.findOne({}, {sort: {created: -1}})._id
            }
            if (id) {
                Router.go('showProblem', {_id: id});
            }
        }
    });

    this.route('showProblem', {
        path: '/problems/:_id',
        waitOn: function() {
            return [Meteor.subscribe('problems'), Meteor.subscribe('problem', this.params._id), Meteor.subscribe('problemStats', this.params._id)];
        },
        data: function() {
            return Problems.findOne({_id: this.params._id});
        },
        onBeforeAction: function() {
            Session.set('selectedProblemId', this.params._id);
            this.next();
        }
    });

    this.route('profile', {
        path: '/users/profile',
        data: function() {
            return Meteor.user()
        }
    });


    this.route('rules');


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
                active: Problems.find({draft: false}, {sort: {published: -1}}),
                drafts: Problems.find({draft: true}, {sort: {createdAt: -1}})
            }
        }
    });

    this.route('adminUsers', {
        path: '/admin/users',
        waitOn: function() {
            return Meteor.subscribe('adminUsers');
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
            return Meteor.subscribe('problem', this.params._id);
        },
        data: function() {
            return Problems.findOne({_id: this.params._id});
        }
    });

    this.route('newProblem', {
        path: '/admin/problems/edit',
        template: 'editProblem'
    });

});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});


Router._filters = {
    isAdmin: function() {
        if(!Meteor.user() || !Meteor.user().isAdmin) {
            Router.go('home');
        } else {
            this.next();
        }
    }
}

var filters = Router._filters;

Router.onBeforeAction(filters.isAdmin, {only: ['settings', 'adminUsers', 'adminProblems', 'editProblem', 'newProblem']});
Router.onBeforeAction('dataNotFound');
