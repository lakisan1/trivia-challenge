Template.quickJoin.events({
    'click #joinGame' (event) {
        event.preventDefault();
        FlowRouter.go('/joinAGame');
    },
});
