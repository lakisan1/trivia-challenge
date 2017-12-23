// these are the routes for specific parts of the application using FlowRouter

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'quickJoin'});
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

FlowRouter.route('/editQuestion', {
    name: 'editQuestion',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'editQuestion'});
    }
});

FlowRouter.route('/questionsList', {
    name: 'questionsList',
    action: function() {
        BlazeLayout.render('MainLayout', {main: 'questionsList'});
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

FlowRouter.route('/gameMaster', {
    name: 'gameMaster',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'gameMaster' });
    }
});

FlowRouter.route('/gamePlay', {
    name: 'gamePlay',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'gamePlay' });
    }
});

FlowRouter.route('/creatingGame', {
    name: 'creatingGame',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'creatingGameView' });
    }
});

FlowRouter.route('/noOfQuestions', {
    name: 'noOfQuestions',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'noOfQuestions' });
    }
});

FlowRouter.route('/displayQuestions', {
    name: 'displayQuestions',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'displayQuestions' });
    }
});

FlowRouter.route('/finalScoreCard', {
    name: 'finalScoreCard',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'finalScoreCard' });
    }
});

FlowRouter.route('/printGameCards', {
    name: 'printGameCards',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'printQuestions' });
    }
});
