ig.module("impact.feature.weather.wind-aim").requires(
	"impact.feature.weather.wind",
	"game.feature.combat.entities.ball"
	).defines(function() {
    ig.ENTITY.Ball.inject({
        update: function() {
            if (this.grab) {
                this.grab.timer.tick();
                var a = this.grab.timer.get();
                Vec3.lerp(this.grab.oldPos, this.grab.pos, a, d);
                this.coll.setPos(d.x, d.y, d.z);
                if (this.grab.timer.done()) {
                    Vec3.assign(this.coll.vel, this.grab.oldVel);
                    this.grab = null
                }
            } else if (this.behaviors)
                for (a = this.behaviors.length; a--;) this.behaviors[a].onUpdate(this);
            if (sc.WindData.victims.includes(this.combatant)) {
            	var e = Vec2.lengthVec(this.coll.vel);
                Vec2.length(this.coll.vel, 4000);
                this.coll.vel.x += sc.WindData.currentSpeed;
                Vec2.length(this.coll.vel, e);
            }
            if (this.timer > 0) {
                this.timer = this.timer - ig.system.tick;
                if (this.timer <= 0) {
                    this.onProjectileKill(ig.PROJECTILE_KILL_TYPE.AIR);
                    this.kill()
                }
            }
            this.totalTimer = this.totalTimer + ig.system.tick;
            this.parent()
        }
    });
});