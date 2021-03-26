ig.module("game.feature.combat.model.status-punisher").requires(
        "game.feature.combat.model.combat-status",
        "game.feature.combat.model.modifier-apply")
    .defines(function() {
        sc.DAMAGE_MODIFIER_FUNCS.STATUS_PUNISHER = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
            var n = attackInfo.attackerParams.getModifier("STATUS_PUNISHER"),
                applyDamageCallback,
                attackInfo = {
                    ...attackInfo
                };
            var idx = attackInfo.element > 0 ? attackInfo.element - 1 : 4;
            if (params.statusStates[idx].active) {
                damageFactor = damageFactor + damageFactor * n
            }
            return {
                attackInfo,
                damageFactor,
                applyDamageCallback
            };
        };
    });