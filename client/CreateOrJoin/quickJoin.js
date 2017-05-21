Template.quickJoin.events({
    'click #joinGame' (event) {
        event.preventDefault();
        FlowRouter.go('/joinAGame');
    },
    'click #createGame' (event) {
        event.preventDefault();
        FlowRouter.go('/createAGame');
    },
});
