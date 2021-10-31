ig.module("game.feature.combat.wait-until-player-item-consume").requires(
    "game.feature.combat.combat-action-steps"
).defines(function() {
    ig.ACTION_STEP.WAIT_UNTIL_PLAYER_ITEM_CONSUME =
    ig.ActionStepBase.extend({
        init: function(a) {
            this.attrib = a.attrib || null;
            this.maxTime = a.maxTime || 0;
            this.itemConsumed = false;
            sc.Model.addObserver(sc.model.player, this);
        },
        start: function(a) {
            this.attrib && a.setAttribute(this.attrib, null);
            this.itemConsumed = false;
            a.stepTimer = a.stepTimer + this.maxTime
        },
        run: function(a) {
            if (this.itemConsumed) {
                this.attrib && a.setAttribute(this.attrib, b);
                return true
            }
            return this.maxTime && a.stepTimer <= 0
        },
        modelChanged: function(a, b, c) {
            if (b == sc.PLAYER_MSG.ITEM_CONSUME_START) {
                this.itemConsumed = true;
            }
        },
    });
});