ig.module("game.feature.combat.entities.combat-proxy-move-rotate").requires("game.feature.combat.entities.combat-proxy").defines(function() {
    sc.CombatProxyEntity.inject({
        moveRotate: false,
        init: function(a, b, d, g) {
            this.parent(a, b, d, g);
            this.moveRotate = g.data.moveRotate || false;
        },
        update: function() {
            this.animState.angle = this.moveRotate ? Vec3.clockangle(this.face) : 0;
            this.parent();
        }
    });
});