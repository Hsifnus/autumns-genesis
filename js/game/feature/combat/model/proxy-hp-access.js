ig.module("game.feature.combat.model.proxy-hp-access").requires("game.feature.combat.entities.combat-proxy").defines(function() {
    sc.CombatProxyEntity.inject({
        onVarAccess: function(b, d) {
            return d[1] == "hpFactor" ? (this.hp / (this.maxHp || 1)) : this.parent(b, d);
        }
    });
});