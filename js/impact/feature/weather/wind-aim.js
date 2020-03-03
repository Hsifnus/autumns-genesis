ig.module("impact.feature.weather.wind-aim").requires(
	"impact.feature.weather.wind",
	"game.feature.combat.entities.ball",
	"game.feature.player.entities.crosshair"
	).defines(function() {
    ig.ENTITY.Ball.inject({
        init: function(a, b, c, d) {
            if (sc.WindData.victims.includes(d.combatant)) {
                Vec2.length(d.dir, 400);
                d.dir.x += sc.WindData.currentSpeed;
            }
            this.parent(a, b, c, d);
            this.party = d.party;
            this.params = d.params;
            this.setBallInfo(d.ballInfo);
            this.remainingHits = this.maxHits;
            this.timer = this.maxTime;
            this.totalTimer = 0
        }
    });
    var b = Vec2.create();
    Vec2.create();
    var a = Vec3.create(),
        d = Vec2.create(),
        c = Vec2.create(),
        e = Vec2.create(),
        f = Vec2.create(),
        g = Vec2.create(),
        h = Vec3.create(),
        i = Vec3.create(),
        j = {},
        k = {};
    ig.ENTITY.Crosshair.inject({
        deferredUpdate: function() {
            this.controller.updatePos(this);
            var a = Vec2.flip(Vec2.sub(this._getThrowerPos(e), this.coll.pos));
            if (Vec2.isZero(a)) a.y = 1;
            var b = Vec2.angle(a, this._lastDir),
                c = this.maxAngleMove;
            if (!this.special && b > 2 * c) {
                c = this.thrower.params ?
                    this.thrower.params.getModifier("AIM_STABILITY") : 0;
                this.rangeCurrent = this.rangeCurrent + b / 2 * Math.max(0, 1 - c);
                if (this.rangeCurrent > this.rangeStart) this.rangeCurrent = this.rangeStart;
                this.doBlink = this.doBlink || this.rangeCurrent > this.rangeStart / 2 * this.speedFactor * this.baseSpeedFactor
            }
            Vec2.assign(this._lastDir, a);
            Vec2.assign(this._aimDir, a);
            if (sc.WindData.victims.includes(ig.game.playerEntity)) {
            	Vec2.length(a, 400);
            	a.x += sc.WindData.currentSpeed;
            	Vec2.length(a, 1);
            }
            if (this.circleGlow > 0) this.circleGlow = this.circleGlow - ig.system.actualTick;
            if (!this.active) this.currentCharge = this.aimTime;
            if (!this.active || ig.system.timeFactor <= 0 && !sc.autoControl.isActive())
                for (a =
                    0; a < this._dots.length; ++a) {
                    this._dots[a].setCurrentAnim("normal", true);
                    this._dots[a].setPos(-1E3, -1E3)
                } else {
                    if (this.special) this.currentCharge = this.aimTime;
                    this.currentCharge = this.currentCharge + ig.system.tick;
                    if (this.rangeCurrent > 0) {
                        if (this.special) this.rangeCurrent = this.rangeCurrent - ig.system.actualTick / this.aimTime * this.rangeStart * 2;
                        else {
                            c = this.speedFactor * this.baseSpeedFactor;
                            this.rangeCurrent = this.rangeCurrent - ig.system.tick / this.aimTime * this.rangeStart * c
                        }
                        if (this.rangeCurrent < 0) {
                            this.rangeCurrent =
                                0;
                            if (this.currentCharge > this.aimTime) this.currentCharge = this.aimTime
                        }
                    }
                    this.isThrowCharged();
                    b = this.controller.gamepadMode ? Vec2.assign(f, a) : Vec2.assignC(f, this.coll.pos.x - ig.game.screen.x - ig.system.width / 2, this.coll.pos.y - ig.game.screen.y - ig.system.height / 2);
                    c = this.controller.getAimingDistance(a, b);
                    if (this.controller.isAiming(this) && this.thrower.cameraHandle) {
                        c = ((c - 104) / 40).limit(0, 1);
                        c = c * c;
                        this.thrower.cameraTargets.length > 0 && (c = c * 0.5);
                        if (c > 0) {
                            Vec2.length(b, 72 * c);
                            Vec2.distance(b, this.thrower.cameraHandle.offset) >
                                2 && this.thrower.cameraHandle.setOffset(b.x, b.y, 0, this._aimDir.x, this._aimDir.y)
                        } else this.thrower.cameraHandle.setOffset(0, 0, 0, this._aimDir.x, this._aimDir.y)
                    }
                    b = this.rangeCurrent / 2;
                    if (this.isThrowCharged()) {
                        if (this.soundTimer <= 0) this.soundTimer = 0.1;
                        this.soundTimer = this.soundTimer - ig.system.tick
                    } else this.soundTimer = 0;
                    c = Vec2.assign(h, this.thrower.coll.pos);
                    c.x = c.x + (this.thrower.coll.size.x / 2 - Constants.BALL_SIZE / 2);
                    c.y = c.y + (this.thrower.coll.size.y / 2 - Constants.BALL_SIZE / 2);
                    c.z = this.thrower.coll.pos.z;
                    if (this.thrower.maxJumpHeight !== void 0 && this.thrower.maxJumpHeight >= 0) c.z = Math.min(this.thrower.coll.pos.z, this.thrower.maxJumpHeight);
                    c.z = c.z + Constants.BALL_HEIGHT;
                    var d;
                    if (!b && this.isThrowCharged()) {
                        d = this.doBlink ? "chargedBlink" : "charged";
                        if (this.doBlink) {
                            this.doBlink = false;
                            this.sounds.charged.play()
                        }
                    } else d = "normal";
                    var g = this.special || this.controller.isAiming(this) ? 1 : 0.4,
                        k = this.rangeCurrent || !this.chargeActive ? 0 : Math.floor((this.currentCharge - 2 * this.aimTime) / 0.05).limit(0, 10),
                        j = b ? 6 : 12;
                    this._currentDot =
                        0;
                    Vec2.rotate(a, b);
                    var q = Vec3.assignC(i, Constants.BALL_SIZE, Constants.BALL_SIZE, Constants.BALL_Z_HEIGHT);
                    this._updateCrossHair(c, a, q, g, d, k, j, 3);
                    if (b) {
                        Vec2.rotate(a, -2 * b);
                        this._updateCrossHair(c, a, q, g, d, k, j, 3)
                    }
                    for (; this._currentDot < this._dots.length; ++this._currentDot) {
                        this._dots[this._currentDot].setCurrentAnim("normal", true);
                        this._dots[this._currentDot].setPos(-1E3, -1E3)
                    }
                }
        }
    });
});