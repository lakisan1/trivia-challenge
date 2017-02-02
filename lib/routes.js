// these are the routes for specific parts of the application using FlowRouter

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'createOrJoin'});
    }
});

FlowRouter.route('/joinAGame', {
    name: 'joinAGame',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'joinAGame'});
    }
});

FlowRouter.route('/createAGame', {
    name: 'createAGame',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'createAGame'});
    }
});

FlowRouter.route('/addCategories', {
    name: 'addCategories',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'addCategories'});
    }
});

FlowRouter.route('/addQuestions', {
    name: 'addQuestions',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'addQuestions'});
    }
});
