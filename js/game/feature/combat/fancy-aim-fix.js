ig.module("game.feature.combat.fancy-aim-fix").requires(
    "game.feature.combat.combat-action-steps"
).defines(function() {
    var r = Vec2.create(),
        j = Vec3.create(),
        m = {};
    ig.ACTION_STEP.FANCY_AIM.inject({
        trueTarget: false,
        init: function(a) {
            this.parent(a);
            this.trueTarget = !!a.trueTarget;
        },
        start: function(a) {
            if (a.getTarget(this.trueTarget)) {
                var b = a.getTarget(this.trueTarget),
                    c = ig.CollTools.getDistVec2(a.coll, b.coll, r),
                    b = Vec2.createC(0, 0);
                Math.abs(c.y) > Math.abs(c.x) * 2 ? b.x = 1 : b.y = 1;
                Math.random() < 0.5 && Vec2.flip(b);
                var c = a.getAlignedPos(ig.ENTITY_ALIGN.CENTER, j),
                    d = ig.game.physics.initTraceResult(m);
                ig.game.trace(d, c.x - this.size /
                    2, c.y - this.size / 2, c.z, b.x * 256, b.y * 256, this.size, this.size, this.size, ig.COLLTYPE.PROJECTILE, a, void 0, false);
                a.stepData.sidePos = [];
                a.stepData.sidePos[0] = (b.x ? c.x : c.y) + (b.y || b.x) * Math.round(d.dist * 256);
                d = ig.game.physics.initTraceResult(m);
                ig.game.trace(d, c.x - this.size / 2, c.y - this.size / 2, c.z, -b.x * 256, -b.y * 256, this.size, this.size, this.size, ig.COLLTYPE.PROJECTILE, a, void 0, false);
                a.stepData.sidePos[1] = (b.x ? c.x : c.y) - (b.y || b.x) * Math.round(d.dist * 256);
                a.stepData.throwDir = b;
                a.stepTimer = a.stepTimer + this.time
            }
        },
        run: function(a) {
            var b = a.stepData.throwDir,
                c = a.stepData.sidePos,
                d = a.getTarget(this.trueTarget);
            if (!d) {
                return false;
            } else {
                var e = d.getCenter(r);
                Vec2.addMulF(e, d.coll.vel, 0.05);
                var d = a.getAlignedPos(ig.ENTITY_ALIGN.CENTER, j),
                    f = (this.bounces - 1) * Math.abs(c[0] - c[1]),
                    g = this.bounces % 2 ? c[0] : c[1];
                if (b.y) {
                    f = f + (Math.abs(c[0] - d.y) + Math.abs(g - e.y));
                    a.face.y = c[0] - d.y;
                    a.face.x = (e.x - d.x) * Math.abs(a.face.y / f)
                } else {
                    f = f + (Math.abs(c[0] - d.x) + Math.abs(g - e.x));
                    a.face.x = c[0] - d.x;
                    a.face.y = (e.y - d.y) * Math.abs(a.face.x / f)
                }
                return a.stepTimer <= 0
            }
        }
    });
    ig.ACTION_STEP.STICKY_CIRCLE_AROUND.inject({
        init: function(a) {
            this.parent(a);
            this.rotateTime = ig.Event.getExpressionValue(a.rotateTime);
        }
    });
    ig.ACTION_STEP.SET_POS.inject({
        start: function(a) {
            (!sc.arena.runtime || !sc.arena.runtime.cup || (!!this.newPos && !!a.getAttribVec3(this.newPos.actorAttrib))) && this.parent(a);
        }
    })
});