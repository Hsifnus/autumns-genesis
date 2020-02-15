ig.module("game.feature.combat.manual-combatant-kill-dead").requires("game.feature.combat.combat-event-steps").defines(function() {
    ig.EVENT_STEP.MANUAL_COMBATANT_KILL_DEAD =
        ig.EventStepBase.extend({
            entity: null,
            _wm: new ig.Config({
                attributes: {
                    entity: {
                        _type: "Entity",
                        _info: "Combatant to manually kill"
                    }
                }
            }),
            init: function(a) {
                this.entity = a.entity
            },
            start: function(a, b) {
                var d = ig.Event.getEntity(this.entity, b);
                d && d.isCombatant && d._killed && d.doManualKill()
            }
        });
});