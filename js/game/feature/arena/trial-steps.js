ig.module("game.feature.arena.trial-steps").requires("game.feature.arena.arena-steps").defines(function() {
    ig.EVENT_STEP.SHOW_TRIAL_TIME_REMAINING_GUI = ig.EventStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                count: {
                    _type: "Number",
                    _info: "Number of seconds to display on gui"
                },
                wait: {
                    _type: "Boolean",
                    _info: "If true, wait until the gui has finished animating."
                }
            }
        }),
        init: function(b) {
            this.wait = b.wait || false
            this.count = b.count || 999;
        },
        start: function(b) {
            var a = new sc.TrialTimeRemainingHud(this.count);
            ig.gui.addGuiElement(a);
            if (this.wait) b._gui = a
        },
        run: function(b) {
            return this.wait ? b._gui.done : true
        }
    });
});