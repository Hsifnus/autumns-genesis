ig.module("impact.feature.weather.wind-aim").requires(
    "impact.feature.weather.wind",
    "game.feature.combat.entities.ball"
).defines(function() {
    var b = Vec2.create(),
        a = Vec3.create(),
        d = Vec3.create();
    ig.ENTITY.Ball.inject({
        update: function() {
            if (sc.WindData.victims.includes(this.combatant)) {
                var e = Vec2.lengthVec(this.coll.vel);
                Vec2.length(this.coll.vel, 4000);
                this.coll.vel.x += sc.WindData.currentSpeed;
                Vec2.length(this.coll.vel, e);
            }
            this.parent();
        }
    });
});