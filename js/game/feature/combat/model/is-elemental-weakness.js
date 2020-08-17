ig.module("game.feature.combat.model.is-elemental-weakness").requires("game.feature.combat.model.combat-condition").defines(function() {
	sc.COMBAT_CONDITION.ELEMENT_WEAKNESS = ig.Class.extend({
        init: function(a) {},
        check: function(a, b, d) {
        	if (d) {
        		a = a.getCombatantRoot();
        		return d.attackInfo.element && a.params.baseParams.elemFactor[d.attackInfo.element-1] > 1;
        	} 
        	return false;
        }
    });
});