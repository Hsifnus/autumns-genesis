ig.module("game.feature.puzzle.entities.wind-bubble").requires("impact.base.action",
    "impact.base.event", "impact.base.entity", "impact.feature.effect.effect-sheet").defines(function() {
    var b = Vec2.create();
    Vec3.create();
    new ig.EffectSheet("puzzle.gust");
    new ig.EffectSheet("puzzle.gust-heat");
    new ig.EffectSheet("puzzle.gust-cold");
    new ig.EffectSheet("puzzle.gust-shock");
    new ig.EffectSheet("puzzle.gust-wave");
    ig.ENTITY.WindBubblePanel = ig.AnimatedEntity.extend({
        respawnTimer: 0,
        currentBubble: null,
        active: false,
        _wm: new ig.Config({
            spawnable: true,
            attributes: {
                spawnCondition: {
                    _type: "VarCondition",
                    _info: "Condition for Enemy to spawn",
                    _popup: true
                }
            }
        }),
        effects: {
            sheet: new ig.EffectSheet("puzzle.wind-bubble")
        },
        init: function(a, b, c, e) {
            this.parent(a, b, c, e);
            this.coll.type = ig.COLLTYPE.NONE;
            this.coll.setSize(24, 24, 0);
            this.coll.zGravityFactor = 1E3;
            a = ig.mapStyle.get("windBubblePanel");
            this.initAnimations({
                sheet: {
                    src: a.sheet,
                    width: 24,
                    height: 24,
                    xCount: 2,
                    offX: 0,
                    offY: 0
                },
                SUB: [{
                    name: "on",
                    time: 1,
                    frames: [1],
                    repeat: false
                }, {
                    name: "off",
                    time: 1,
                    frames: [0],
                    repeat: false
                }, {
                    name: "blink",
                    time: 0.04,
                    frames: [0],
                    repeat: false
                }, {
                    name: "blink",
                    time: 0.02,
                    frames: [1, 1, 1,
                        1, 1, 1, 1, 1
                    ],
                    framesAlpha: [0, 0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2],
                    repeat: true
                }]
            });
            this.setCurrentAnim("on")
        },
        show: function(a) {
            this.parent(a);
            if (!a) {
                this.animState.alpha = 0;
                ig.game.effects.teleport.spawnOnTarget("showDefault", this, {})
            }
            this.coll.zGravityFactor = 1E3;
            this.active = true;
            this.spawnBubble(a)
        },
        onHideRequest: function() {
            this.active = false;
            this.coll.zGravityFactor = 0;
            this.coll.vel.z = 0;
            if (this.currentBubble) {
                this.currentBubble.panel = null;
                this.currentBubble.isIdle() && this.currentBubble.burst()
            }
            ig.game.effects.teleport.spawnOnTarget("hideDefault",
                this, {
                    callback: this
                })
        },
        onEffectEvent: function(a) {
            a.isDone() && this.hide()
        },
        update: function() {
            if (this.respawnTimer) {
                this.respawnTimer = this.respawnTimer - ig.system.tick;
                this.respawnTimer <= 0 && this.spawnBubble()
            }
            this.parent()
        },
        spawnBubble: function(a) {
            if (this.active) {
                this.respawnTimer = 0;
                this.setCurrentAnim("on");
                var d = this.getCenter(b),
                    d = ig.game.spawnEntity(sc.WindBubbleEntity, d.x, d.y, this.coll.pos.z + 8, {
                        panel: this,
                        hp: 3,
                        timer: 30,
                        element: "NEUTRAL"
                    });
                if (!a) {
                    this.effects.sheet.spawnOnTarget("appear", d, {});
                }
                this.currentBubble = d
            }
        },
        onBubbleStart: function() {
            this.setCurrentAnim("off")
        },
        onBubbleBurst: function() {
            this.currentBubble = null;
            this.setCurrentAnim("blink");
            this.respawnTimer = 1.5
        }
    });
    sc.WIND_BUBBLE_ANIMS = {
        NEUTRAL: {
            BASE: {
                shapeType: "Y_FLAT",
                offset: {
                    x: 0,
                    y: -3,
                    z: 0
                },
                sheet: {
                    src: "media/entity/effects/autumn-dng.png",
                    width: 24,
                    height: 24,
                    xCount: 3,
                    offX: 16,
                    offY: 72
                },
                SUB: [{
                    name: "idle",
                    time: 0.2,
                    frames: [0, 1, 2],
                    repeat: true
                }]
            },
            SHOT: {
                "name": "default",
                "sheet": {
                    "src": "media/entity/effects/autumn-dng.png",
                    "offX": 0,
                    "offY": 72,
                    "width": 16,
                    "height": 24
                },
                "time": 0.2,
                "repeat": true,
                "frames": [
                    0
                ]
            },
            AURA_KEY: "neutralAura",
            BURST_KEY: "neutralBurst",
            ATTACK_KEY: "neutralAttack"
        },
        HEAT: {
            BASE: {
                shapeType: "Y_FLAT",
                offset: {
                    x: 0,
                    y: -3,
                    z: 0
                },
                sheet: {
                    src: "media/entity/effects/autumn-dng.png",
                    width: 24,
                    height: 24,
                    xCount: 3,
                    offX: 16,
                    offY: 96
                },
                SUB: [{
                    name: "idle",
                    time: 0.2,
                    frames: [0, 1, 2],
                    repeat: true
                }]
            },
            SHOT: {
                "name": "default",
                "sheet": {
                    "src": "media/entity/effects/autumn-dng.png",
                    "offX": 0,
                    "offY": 96,
                    "width": 16,
                    "height": 24
                },
                "time": 0.2,
                "repeat": true,
                "frames": [
                    0
                ]
            },
            AURA_KEY: "heatAura",
            BURST_KEY: "heatBurst",
            ATTACK_KEY: "heatAttack"
        },
        COLD: {
            BASE: {
                shapeType: "Y_FLAT",
                offset: {
                    x: 0,
                    y: -3,
                    z: 0
                },
                sheet: {
                    src: "media/entity/effects/autumn-dng.png",
                    width: 24,
                    height: 24,
                    xCount: 3,
                    offX: 16,
                    offY: 120
                },
                SUB: [{
                    name: "idle",
                    time: 0.2,
                    frames: [0, 1, 2],
                    repeat: true
                }]
            },
            SHOT: {
                "name": "default",
                "sheet": {
                    "src": "media/entity/effects/autumn-dng.png",
                    "offX": 0,
                    "offY": 120,
                    "width": 16,
                    "height": 24
                },
                "time": 0.2,
                "repeat": true,
                "frames": [
                    0
                ]
            },
            AURA_KEY: "coldAura",
            BURST_KEY: "coldBurst",
            ATTACK_KEY: "coldAttack"
        },
        SHOCK: {
            BASE: {
                shapeType: "Y_FLAT",
                offset: {
                    x: 0,
                    y: -3,
                    z: 0
                },
                sheet: {
                    src: "media/entity/effects/autumn-dng.png",
                    width: 24,
                    height: 24,
                    xCount: 3,
                    offX: 16,
                    offY: 144
                },
                SUB: [{
                    name: "idle",
                    time: 0.2,
                    frames: [0, 1, 2],
                    repeat: true
                }]
            },
            SHOT: {
                "name": "default",
                "sheet": {
                    "src": "media/entity/effects/autumn-dng.png",
                    "offX": 0,
                    "offY": 144,
                    "width": 16,
                    "height": 24
                },
                "time": 0.2,
                "repeat": true,
                "frames": [
                    0
                ]
            },
            AURA_KEY: "shockAura",
            BURST_KEY: "shockBurst",
            ATTACK_KEY: "shockAttack"
        },
        WAVE: {
            BASE: {
                shapeType: "Y_FLAT",
                offset: {
                    x: 0,
                    y: -3,
                    z: 0
                },
                sheet: {
                    src: "media/entity/effects/autumn-dng.png",
                    width: 24,
                    height: 24,
                    xCount: 3,
                    offX: 16,
                    offY: 168
                },
                SUB: [{
                    name: "idle",
                    time: 0.2,
                    frames: [0, 1, 2],
                    repeat: true
                }]
            },
            SHOT: {
                "name": "default",
                "sheet": {
                    "src": "media/entity/effects/autumn-dng.png",
                    "offX": 0,
                    "offY": 168,
                    "width": 16,
                    "height": 24
                },
                "time": 0.2,
                "repeat": true,
                "frames": [
                    0
                ]
            },
            AURA_KEY: "waveAura",
            BURST_KEY: "waveBurst",
            ATTACK_KEY: "waveAttack"
        }
    };
    Vec2.create();
    sc.WindBubbleEntity = ig.AnimatedEntity.extend({
        sound: new ig.Sound("media/sound/battle/hit-block.ogg", 1),
        party: sc.COMBATANT_PARTY.ENEMY,
        panel: null,
        state: 1,
        element: "NEUTRAL",
        cooldown: false,
        timer: 0,
        startZ: 0,
        hp: 3,
        maxHp: 3,
        damageFactor: 0.5,
        status: 0,
        combatant: null,
        effects: {
            sheet: new ig.EffectSheet("puzzle.wind-bubble"),
            handle: null,
            hitHandle: null
        },
        cameraHandle: null,
        target: null,
        weakness: 0,
        statusGui: null,
        actionAttached: [],
        init: function(a, b, c, e) {
            this.parent(a, b, c, e);
            this.coll.type = ig.COLLTYPE.VIRTUAL;
            this.coll.zGravityFactor = 1;
            this.coll.zBounciness = 0.5;
            this.coll.bounciness = 0.5;
            this.coll.setSize(20, 20, 16);
            this.coll.friction.air = 0.2;
            this.coll.maxVel = e.speed == undefined ? 95 : e.speed;
            this.coll.float.height = 8;
            this.startZ = c;
            this.coll.float.variance = 2;
            this.coll.shadow.size = 16;
            this.coll.setPos(a - this.coll.size.x / 2, b - this.coll.size.y / 2, c);
            this.panel = e.panel || null;
            this.noBounce = e.noBounce || false;
            if (e.element) {
                this.element = e.element
                this.initAnimations(sc.WIND_BUBBLE_ANIMS[this.element].BASE);
            } else {
                this.initAnimations(sc.WIND_BUBBLE_ANIMS.NEUTRAL.BASE);
            }
            this.setCurrentAnim("idle");
            if (e.target) {
                if (e.damageFactor) {
                    this.damageFactor = e.damageFactor;
                }
                if (e.status) {
                    this.status = e.status;
                }
                this.coll.bounciness = 1;
                this.followTarget(e.target, e.targetTime);
            } else {
                e.timer > 0 && (this.timer = e.timer);
            }
            if (e.combatant) this.combatant = e.combatant;
            if (e.hp) {
                this.hp = e.hp;
                this.maxHp = e.hp;
            }
        },
        isIdle: function() {
            return this.state == 1
        },
        followTarget: function(a, b) {
            this.target = a;
            this.state = 2;
            this.timer = b;
            ig.CollTools.getDistVec2(this.coll, this.target.coll, this.coll.accelDir);
            Vec2.assign(this.coll.vel, this.coll.accelDir);
            Vec2.length(this.coll.vel, this.coll.maxVel);
            this.coll.setType(ig.COLLTYPE.IGNORE);
            this.addActionAttached(this.effects.sheet.spawnOnTarget(sc.WIND_BUBBLE_ANIMS[this.element].ATTACK_KEY, this, {
                duration: -1
            }));
            this.addActionAttached(this.effects.sheet.spawnOnTarget(sc.WIND_BUBBLE_ANIMS[this.element].ATTACK_KEY + "Sound", this, {
                duration: -1
            }));
            var b = this.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, Vec3.create());
            b.z = b.z - 8;
            this.panel && this.panel.onBubbleBurst();
            b = new sc.CircleHitForce(a, {
                attack: {
                    type: "HEAVY",
                    element: this.element,
                    damageFactor: this.damageFactor,
                    status: this.status,
                    spFactor: 0,
                    hints: [],
                    stunSteps: [{
                        "value": 100,
                        "type": "Z_VEL"
                    }],
                    noHack: true
                },
                pos: b,
                radius: 18,
                zHeight: 48,
                duration: 0.5,
                alwaysFull: true,
                party: "ENEMY",
                centralAngle: 1,
                repeat: true
            });
            sc.combat.addCombatForce(b);
            this.addActionAttached(b);
        },
        addActionAttached: function(a) {
            a && this.actionAttached.push(a)
        },
        removeActionAttached: function(a) {
            a = this.actionAttached.indexOf(a);
            if (a != -1) {
                this.actionAttached.splice(a, 1);
                return true
            }
            return false
        },
        clearActionAttached: function(a, b) {
            for (var d = this.actionAttached.length; d--;)
                if (!a || a(this.actionAttached[d], b)) {
                    this.actionAttached[d].onActionEndDetach(this);
                    a && this.actionAttached.splice(d, 1)
                }
            if (!a) this.actionAttached = []
        },
        bounce: function(a, b) {
            if (this.coll.baseZPos > this.startZ) this.startZ = this.coll.baseZPos + 8;
            Vec2.assign(this.coll.vel, a);
            Vec2.length(this.coll.vel, b || 180);
            if (!this.timer) {
                this.panel && this.panel.onBubbleStart()
            }
            if (this.effects.hitHandle) {
                this.effects.hitHandle.setCallback(null);
                this.effects.hitHandle.stop()
            }
        },
        instantKill: function() {
            if (!(this._killed || this.state == 5)) {
                this.state = 5;
                this.panel && this.panel.onBubbleBurst();
                this.kill()
            }
        },
        showBar: function(a) {
            if (!this.statusGui) {
                this.statusGui = new ig.GUI.StatusBar(this);
                this.statusGui.setStatusEntryStick("BREAK", true);
                ig.gui.addGuiElement(this.statusGui);
            }
        },
        hideBar: function() {
            this.statusGui && this.statusGui.remove() &&
                ig.gui.removeGuiElement(this.statusGui);
            this.statusGui = null;
        },
        kill: function() {
            this.clearActionAttached();
            this.hideBar();
            this.parent();
        },
        burst: function() {
            if (!(this._killed || this.state == 5)) {
                this.state = 5;
                if (this.effects.handle) {
                    this.effects.handle.stop();
                    this.effects.handle = null
                }
                this.effects.sheet.spawnOnTarget(sc.WIND_BUBBLE_ANIMS[this.element].BURST_KEY, this, {
                    callback: this,
                    align: "CENTER"
                });
                this.panel && this.panel.onBubbleBurst()
            }
        },
        almostBurst: function() {
            this.effects.sheet.spawnOnTarget("flash", this, {
                align: "CENTER"
            });
        },
        onEffectEvent: function(a) {
            if (!this._killed && a.state == ig.EFFECT_STATE.ENDED) a == this.effects.hitHandle ? this.effects.hitHandle = null : this.kill()
        },
        circularBurst: function(a) {
            if (!this._killed) {
                this.clearActionAttached();
                var b = this.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, Vec3.create());
                this.effects.sheet.spawnFixed(sc.WIND_BUBBLE_ANIMS[this.element].BURST_KEY, b.x, b.y, b.z, null, {});
                b.z = b.z - 8;
                this.panel && this.panel.onBubbleBurst();
                if (a = a || this.combatant) {
                    b = new sc.CircleHitForce(a, {
                        attack: {
                            type: "MASSIVE",
                            element: this.element,
                            damageFactor: 1,
                            spFactor: 0,
                            hints: ["CHARGED"],
                            noHack: true
                        },
                        pos: b,
                        radius: 8,
                        zHeight: 16,
                        duration: 0.2,
                        expandRadius: 32,
                        alwaysFull: true,
                        party: "OTHER",
                        centralAngle: 1
                    });
                    sc.combat.addCombatForce(b)
                }
                this.cameraHandle && ig.camera.removeTarget(this.cameraHandle, "SLOW", KEY_SPLINES.EASE_IN_OUT);
                this.kill()
            }
        },
        circularBurstAndShoot: function(a) {
            if (!this._killed) {
                var fx = "puzzle.gust";
                if (this.element == "HEAT") {
                    fx = "puzzle.gust-heat";
                } else if (this.element == "COLD") {
                    fx = "puzzle.gust-cold";
                } else if (this.element == "SHOCK") {
                    fx = "puzzle.gust-shock";
                } else if (this.element == "WAVE") {
                    fx = "puzzle.gust-wave";
                }
                var ball = new sc.BallInfo({
                    animation: sc.WIND_BUBBLE_ANIMS[this.element].SHOT,
                    effects: fx,
                    speed: 600,
                    maxBounce: 3,
                    timer: 1.5,
                    trail: true,
                    multiHit: false,
                    noLightGlow: false,
                    attack: {
                        type: "HEAVY",
                        element: this.element,
                        damageFactor: 1.3,
                        skillBonus: "RANGED_DMG",
                        hints: ["CHARGED", "GUST", "STEAM"]
                    }
                });
                var b = this.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, Vec3.create());
                this.effects.sheet.spawnFixed(sc.WIND_BUBBLE_ANIMS[this.element].BURST_KEY, b.x, b.y, b.z, null, {});
                b.z = b.z - 8;
                this.panel && this.panel.onBubbleBurst();
                if (a = a || this.combatant) {
                    b = new sc.CircleHitForce(a, {
                        attack: {
                            type: "MASSIVE",
                            element: this.element,
                            damageFactor: 1,
                            spFactor: 0,
                            hints: ["CHARGED"],
                            noHack: true
                        },
                        pos: b,
                        radius: 8,
                        zHeight: 16,
                        duration: 0.2,
                        expandRadius: 32,
                        alwaysFull: true,
                        party: "OTHER",
                        centralAngle: 1
                    });
                    sc.combat.addCombatForce(b)
                }
                ball.spawn(this.coll.pos.x + 12, this.coll.pos.y + 12, this.coll.pos.z + 4, ig.game.playerEntity, ig.game.playerEntity.face)
                this.cameraHandle && ig.camera.removeTarget(this.cameraHandle, "SLOW", KEY_SPLINES.EASE_IN_OUT);
                this.kill()
            }
        },
        update: function() {
            if (this.target && this.state == 2) {
                ig.CollTools.getDistVec2(this.coll, this.target.coll, b);
                Vec2.rotateToward(this.coll.accelDir, b, Math.PI * 0.5 * ig.system.tick);
                this.coll.float.height = Math.max(8, this.target.coll.pos.z + 12 - this.coll.baseZPos);
            } else if (this.state != 1) this.coll.float.height = Math.max(8, this.startZ - this.coll.baseZPos);
            else if (this.panel) this.startZ =
                this.panel.coll.pos.z + 8;
            if (this.state == 3 && ig.game.playerEntity.playerTrack &&
                (ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED" ||
                    ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED_REV") &&
                !this.cooldown) {
                this.circularBurstAndShoot();
            }
            if (this.cooldown && ig.game.playerEntity.playerTrack.startedAction == null) {
                this.cooldown = false;
            }
            if (this.timer > 0 && this.state != 1) {
                var prevTime = this.timer;
                this.timer = this.timer - ig.system.tick;
                this.timer < 5 && (prevTime % 1 < this.timer % 1) && this.almostBurst();
                if (this.state == 2) {
                    this.timer <= 0 && this.target && this.circularBurst();
                } else {
                    this.timer <= 0 && this.burst();
                }
            }
            for (var actions = this.actionAttached, idx = actions.length; idx--;) {
                var action = actions[idx];
                if (action.duration && action.duration > 0) action.pos = this.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, Vec3.create());
            }
            this.parent()
        },
        hasHint: function(a) {
            return a.attackInfo.hasHint("CHARGED") ||
                a.attackInfo.hasHint("COMPRESSED") ||
                a.attackInfo.hasHint("BOMB") ||
                a.attackInfo.hasHint("STEAM") ||
                a.attackInfo.hasHint("ICE_DISK");
        },
        ballHit: function(a) {
            if (a.party == sc.COMBATANT_PARTY.ENEMY) return;
            var d = a.getElement();
            var c = a.getHitCenter(this),
                e = a.getHitVel(this, b);
            this.timer = 30;
            if ((this.state == 1 || this.state == 4) && this.hasHint(a)) {
                if (this.element == "NEUTRAL") {
                    if (d == sc.ELEMENT.HEAT) {
                        this.element = "HEAT";
                    } else if (d == sc.ELEMENT.COLD) {
                        this.element = "COLD";
                    } else if (d == sc.ELEMENT.SHOCK) {
                        this.element = "SHOCK";
                    } else if (d == sc.ELEMENT.WAVE) {
                        this.element = "WAVE";
                    }
                }
                this.state = 3;
                this.initAnimations(sc.WIND_BUBBLE_ANIMS[this.element].BASE);
                !this._killed && this.addActionAttached(this.effects.sheet.spawnOnTarget(sc.WIND_BUBBLE_ANIMS[this.element].AURA_KEY, this, {
                    duration: -1
                }));
                if (ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED" ||
                    ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED_REV") {
                    this.cooldown = true;
                }
            } else if (this.state == 2 && this.hasHint(a)) {
                if (d == sc.ELEMENT.HEAT && this.element == "HEAT") {
                    this.hp--;
                } else if (d == sc.ELEMENT.COLD && this.element == "COLD") {
                    this.hp--;
                } else if (d == sc.ELEMENT.SHOCK && this.element == "SHOCK") {
                    this.hp--;
                } else if (d == sc.ELEMENT.WAVE && this.element == "WAVE") {
                    this.hp--;
                } else if (d == sc.ELEMENT.NEUTRAL && this.element == "NEUTRAL") {
                    this.hp--;
                }
                if (this.hp <= 0) {
                    this.weakness = 0;
                    this.hideBar();
                    this.state = 3;
                    for (var actions = this.actionAttached, idx = actions.length; idx--;) {
                        var action = actions[idx];
                        if (action.repeat) action.onActionEndDetach()
                    }
                    this.clearActionAttached();
                    !this._killed && this.addActionAttached(this.effects.sheet.spawnOnTarget(sc.WIND_BUBBLE_ANIMS[this.element].AURA_KEY, this, {
                        duration: -1
                    }));
                    this.target = null;
                    this.timer = 30;
                    this.coll.accelDir = Vec2.create();
                    if (ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED" ||
                        ig.game.playerEntity.playerTrack.startedAction == "THROW_CHARGED_REV") {
                        this.cooldown = true;
                    }
                } else {
                    this.showBar();
                    this.weakness = 1 - (this.hp / this.maxHp);
                    this.statusGui && (this.statusGui.timer = this.statusGui.largeTimer = 2) && this.statusGui.setStatusEntry("BREAK", this.weakness);
                    this.sound.play();
                }
            } else if (this.state == 1) {
                this.state = 4;
            }

            !this.noBounce && this.bounce(e, this.coll.maxVel - 5);
            d = sc.ATTACK_TYPE.LIGHT;
            if (!a.isBall || this.hasHint(a)) d = sc.ATTACK_TYPE.MEDIUM;
            sc.combat.showHitEffect(this, c, d, a.getElement(), false, false, true);
            return true
        },
        isBallAdjust: function() {
            return true
        },
        doBallAdjust: function(a, b, c) {
            this.getCenter(a);
            Vec3.assign(c, this.coll.size);
            return 0
        },
        isBallDestroyer: function() {
            return false
        }
    });

    ig.ACTION_STEP.SHOOT_WIND_BUBBLE = ig.ActionStepBase.extend({
        gfx: null,
        offset: null,
        align: null,
        speed: null,
        zVel: null,
        timeAdvance: null,
        _wm: new ig.Config({
            attributes: {
                offset: {
                    _type: "Offset",
                    _info: "Offset relative to entity ground center from which to shoot"
                },
                align: {
                    _type: "String",
                    _info: "Alignment relative to entity from which to shoot",
                    _select: ig.ENTITY_ALIGN
                },
                duration: {
                    _type: "Number",
                    _info: "Time in seconds until bubble explodes",
                    _default: 30
                },
                hp: {
                    _type: "Number",
                    _info: "Number of charged hits before bubble is pacified",
                    _default: 3
                },
                speed: {
                    _type: "Number",
                    _info: "Max velocity of bubble",
                    _default: 95
                },
                damageFactor: {
                    _type: "Number",
                    _info: "How hard the bubble hits per tick (0.5s)",
                    _default: 0.5
                },
                status: {
                    _type: "Number",
                    _info: "Status potency of bubble attack",
                    _default: 0
                },
                element: {
                    _type: "String",
                    _info: "Element of bubble",
                    _select: ["HEAT", "COLD", "SHOCK", "WAVE", "NEUTRAL"],
                    _default: "NEUTRAL"
                },
                noBounce: {
                    _type: "Boolean",
                    _info: "Whether ball should bounce when shot at",
                    _default: false
                }
            }
        }),
        init: function(a) {
            this.offset = a.offset;
            this.align = ig.ENTITY_ALIGN[a.align] || ig.ENTITY_ALIGN.BOTTOM;
            this.gfx = new ig.Image("media/entity/effects/autumn-dng.png");
            this.duration = a.duration || 30;
            this.hp = a.hp || 3;
            this.speed = a.speed;
            this.damageFactor = a.damageFactor;
            this.status = a.status;
            this.element = a.element;
            this.noBounce = a.noBounce || false;
            this.effects = {
                sheet: new ig.EffectSheet("puzzle.wind-bubble")
            }
        },
        clearCached: function() {
            this.gfx.decreaseRef()
        },
        start: function(a) {
            var c = a.getAlignedPos(this.align, b);
            this.offset && Vec3.add(c, this.offset);
            var d = ig.game.spawnEntity(sc.WindBubbleEntity, c.x, c.y, c.z, {
                combatant: a.getCombatantRoot(),
                target: a.getTarget(),
                targetTime: this.duration,
                hp: this.hp,
                speed: this.speed,
                damageFactor: this.damageFactor,
                status: this.status,
                element: this.element,
                noBounce: this.noBounce
            });
            this.effects.sheet.spawnOnTarget("appear", d, {});
        }
    });
});