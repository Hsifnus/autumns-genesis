ig.module("game.feature.combat.set-attrib-closest-entity-fix").requires("game.feature.combat.combat-action-steps").defines(function() {
    ig.ACTION_STEP.SET_ATTRIB_CLOSEST_ENTITY.inject({
        start: function(a) {
            !a.getTarget() && (this.selectBy = 2);
            this.parent(a);
        }
    });
});