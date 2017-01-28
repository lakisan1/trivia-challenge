// these are the routes for specific parts of the application using FlowRouter

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'home'});
    }
});
