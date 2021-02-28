ig.module("impact.feature.influencer.pressure-status").requires("impact.feature.influencer.influencer-steps", "game.feature.combat.combat-action-steps").defines(function() {
    sc.PressureStatus = ig.Class.extend({
        init: function() {
            this.level = 0;
            this.category = 0;
            this.holdCategory = 0;
            this.enabled = false;
            this.influenceEntry = new ig.InfluenceEntry;
            this.influenceEntry.timeScale = 1;
            this.influenceEntry.logicTimeScale = 1;
            this.influenceEntry.moveXYScale = 1;
            this.effects = {
                sheet: new ig.EffectSheet("enemies.whale-boss-ex")
            };
            this.stallAction = new ig.Action("stallAction", [{
                type: "WAIT_UNTIL",
                condition: "0",
                maxTime: this.duration
            }]);
            this.stallAction.hint = "battle";
            this.attackInfo = null;
            this.attackInfo2 = null;
            this.timer = 0;
            this.murderTimer = 0;
            this.fxHandle = null;
            this.fxHandle2 = null;
            this.fxHandle3 = null;
            this.attackFactors = [1, 1.25, 1.6, 1.6];
            this.spFactors = [0.5, 0.8, 1.2];
            this.holdCategoryOnSpecial = false;
        },
        getAttackFactor: function() {
            var c = this.enabled && this.holdCategoryOnSpecial ? Math.max(this.category, this.holdCategory) : this.category;
            return this.attackFactors[c];
        },
        getSpFactor: function() {
            return this.spFactors[this.category];
        },
        doHoldCategory: function() {
            if (this.enabled) {
                this.holdCategory = this.category;
            }
        },
        resetHoldCategory: function() {
            this.holdCategory = 0;
        },
        reset: function() {
            this.level = 0;
            if (this.enabled) {
                this.holdCategory = 0;
                this.holdCategoryOnSpecial = false;
                this.enabled = false;
                this.influenceEntry.moveXYScale = 1;
                this.category = 0;
                var a = ig.game.playerEntity,
                    b;
                a.clearActionAttached(e => e instanceof ig.InfluenceConnection);
                a.clearActionAttached(e => e instanceof ig.ENTITY.Effect &&
                    ("pressure" == e.attachGroup));
                a.clearActionAttached(e => e instanceof ig.ENTITY.Effect &&
                    ("pressureLevel" == e.attachGroup))
            }
        },
        set: function(level) {
            if (this.level >= 60 && level >= 60) {
                return;
            }!this.attackInfo && ig.game.playerEntity.params &&
                (this.attackInfo = new sc.AttackInfo(ig.game.playerEntity.params, {
                    type: "BREAK",
                    fly: "LIGHT",
                    stunSteps: [{
                        type: "BLOCK_XY"
                    }],
                    element: "WAVE",
                    damageFactor: 2,
                    guardable: "NEVER",
                    hitInvincible: true,
                    noIronStance: true,
                    spFactor: 0,
                    hints: ["CHARGED"],
                    noHack: true
                }));
            !this.attackInfo2 && ig.game.playerEntity.params &&
                (this.attackInfo2 = new sc.AttackInfo(ig.game.playerEntity.params, {
                    type: "BREAK",
                    visualType: "NONE",
                    fly: "LIGHT",
                    stunSteps: [{
                        type: "START_LOCK"
                    }, {
                        type: "BLOCK_XY"
                    }],
                    element: "WAVE",
                    damageFactor: 1,
                    guardable: "NEVER",
                    hitInvincible: true,
                    noIronStance: true,
                    spFactor: 0,
                    hints: ["CHARGED"],
                    limiter: "NO_DAMAGE",
                    noHack: true
                }));
            if (this.enabled) {
                this.level = Math.min(Math.max(0, level), 60);
                var a = ig.game.playerEntity,
                    b, c;
                this.fxHandle && this.fxHandle.stop();
                this.fxHandle = this.effects.sheet.spawnOnTarget(`pressure${this.level}`, a, {
                    align: "CENTER",
                    group: "pressure",
                    duration: -1
                });
                a.clearActionAttached(e => e instanceof ig.InfluenceConnection);
                if (this.level < 20) {
                    this.influenceEntry.moveXYScale = 1;
                    c = 0;
                } else if (this.level < 40) {
                    this.influenceEntry.moveXYScale = 0.75;
                    c = 1;
                } else if (this.level < 60) {
                    this.influenceEntry.moveXYScale = 0.5;
                    c = 2;
                } else if (this.level == 60) {
                    this.influenceEntry.moveXYScale = 0;
                    c = 3;
                }
                b = new ig.InfluenceConnection(a.influencer, this.influenceEntry);
                a.addActionAttached(b);
                if (this.category != c) {
                    this.category = c;
                    this.fxHandle2 && this.fxHandle2.stop();
                    c && (this.fxHandle2 = this.effects.sheet.spawnOnTarget(`pressureLevel${this.category}`, a, {
                        align: "BOTTOM",
                        group: "pressureLevel",
                        duration: -1
                    }));
                }
                if (c == 3) {
                    this.fxHandle3 && this.fxHandle3.stop();
                    this.fxHandle3 = this.effects.sheet.spawnOnTarget(`pressureBoom`, a, {
                        align: "BOTTOM",
                        group: "pressureLevel",
                        duration: -1
                    });
                    a.setAction(this.stallAction);
                    a.params.startLock(a);
                    this.timer = 1;
                }
            }
        },
        setEnabled: function(enabled) {
            this.enabled = enabled;
            !this.enabled && this.reset();
            this.enabled && this.set(0);
        },
        setHoldCategoryOnSpecial: function(enabled) {
            this.holdCategoryOnSpecial = enabled;
        },
        update: function() {
            var a = ig.game.playerEntity;
            if (!a) {
                return;
            }
            if (a.params.currentHp <= 0) {
                a.params.endLock(a);
                this.murderTimer = 0;
                this.reset();
            }
            if (this.timer > 0) {
                this.timer -= ig.system.tick;
                a.onDamage(a, this.attackInfo2);
                this.timer < 0 && (this.murderTimer = 0.01);
            }
            if (this.murderTimer > 0) {
                this.murderTimer -= ig.system.tick;
                if (this.murderTimer < 0) {
                    this.murderTimer = 0.25;
                    a.onDamage(a, this.attackInfo);
                }
            }
            if (this.timer > 0 || this.murderTimer > 0) {
                if (!a.currentAction && a.actionAttached.indexOf(a.params) == -1 && a.params.currentHp > 0) {
                    a.setAction(this.stallAction);
                    a.params.startLock(a);
                }
            }
            if (this.category > 0) {
                var b = new ig.InfluenceConnection(a.influencer, this.influenceEntry);
                a.addActionAttached(b);
            }
        }
    });
    ig.pressureStatus = new sc.PressureStatus();
    ig.ACTION_STEP.SET_PLAYER_PRESSURE_ENABLED = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                value: {
                    _type: "Boolean",
                    _info: "Whether to enable pressure on player or not"
                }
            }
        }),
        init: function(b) {
            this.value = b.value;
        },
        start: function() {
            ig.game.playerEntity && ig.pressureStatus.setEnabled(this.value);
        }
    });
    ig.ACTION_STEP.SET_PLAYER_PRESSURE_HOLD_CATEGORY_ON_SPECIAL = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                value: {
                    _type: "Boolean",
                    _info: "Whether to hold player pressure category on combat art or not"
                }
            }
        }),
        init: function(b) {
            this.value = b.value;
        },
        start: function() {
            ig.game.playerEntity && ig.pressureStatus.setHoldCategoryOnSpecial(this.value);
        }
    });
    ig.ACTION_STEP.RESET_PLAYER_PRESSURE_HOLD_CATEGORY = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {}
        }),
        init: function(b) {},
        start: function() {
            ig.game.playerEntity && ig.pressureStatus.resetHoldCategory();
        }
    });
    ig.ACTION_STEP.ADD_PLAYER_PRESSURE = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                value: {
                    _type: "Number",
                    _info: "How much additional pressure to apply on player"
                }
            }
        }),
        init: function(b) {
            this.value = b.value;
        },
        start: function() {
            ig.game.playerEntity && ig.pressureStatus.set(ig.pressureStatus.level + this.value);
        }
    });
    sc.COMBAT_CONDITION.PRESSURE_STATUS_HOLDING = ig.Class.extend({
        _wm: new ig.Config({
            attributes: {}
        }),
        init: function(a) {},
        check: function(a) {
            return ig.pressureStatus.holdCategory > 0;
        }
    });
    ig.Game.inject({
        update: function() {
            this.parent();
            !this.paused && ig.pressureStatus.update();
        }
    });
    sc.CombatParams.inject({
        getDamage: function(e, g, h, i, j) {
            var f = {
                ...e
            };
            h.getCombatantRoot().isPlayer && (f.damageFactor = f.damageFactor * ig.pressureStatus.getAttackFactor());
            return this.parent(f, g, h, i, j);
        }
    });
    sc.MapModel.inject({
        onLevelLoaded: function() {
            this.parent();
            ig.pressureStatus.reset();
        }
    });
    ig.ENTITY.Player.inject({
        onTargetHit: function(a, b, c) {
            if (ig.pressureStatus.enabled && b.spFactor) {
                b.spFactor *= ig.pressureStatus.getSpFactor();
            }
            this.parent(a, b, c);
        },
        handleStateStart: function(a, b) {
            if (a.startState === 5) {
                ig.pressureStatus.doHoldCategory();
            }
            this.parent(a, b);
        }
    })
});