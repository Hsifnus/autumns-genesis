ig.module("game.feature.combat.true-target").requires(
    "game.feature.combat.combat-action-steps",
    "game.feature.combat.entities.combat-proxy"
).defines(function() {
    var n = {
        STUN_LOCKED: 1,
        PREVIOUSLY_HIT: 2,
        TARGET: 3,
        TRUE_TARGET: 4
    };
    ig.ACTION_STEP.DIRECT_HIT = ig.ActionStepBase.extend({
        directHitSettings: null,
        effect: null,
        _wm: new ig.Config({
            attributes: {
                selectType: {
                    _type: "String",
                    _info: "What entities to hit",
                    _select: n
                },
                attack: {
                    _type: "AttackInfo",
                    _info: "Attack Info of circle attack"
                },
                effect: {
                    _type: "Effect",
                    _info: "Effect to play on each burst",
                    _optional: true
                },
                hitDir: {
                    _type: "String",
                    _info: "Direct Hit direction",
                    _select: sc.DIRECT_HIT_DIR
                },
                align: {
                    _type: "String",
                    _info: "Alignment of force relative to entity",
                    _select: ig.ENTITY_ALIGN
                },
                hitCount: {
                    _type: "Number",
                    _info: "Number of hits",
                    _default: 1
                },
                hitDelay: {
                    _type: "Number",
                    _info: "Delay in seconds between hits",
                    _defualt: 0.1
                }
            }
        }),
        init: function(a) {
            this.selectType = n[a.selectType] || n.STUN_LOCKED;
            this.directHitSettings =
                a;
            if (a.effect) this.effect = new ig.EffectHandle(a.effect)
        },
        clearCached: function() {
            this.effect && this.effect.clearCached()
        },
        start: function(a) {
            if (this.selectType == n.TARGET) {
                var b = a.getTarget();
                if (b) {
                    var c = new sc.DirectHitForce(a, b, this.directHitSettings, this.effect);
                    sc.combat.addCombatForce(c);
                    this.directHitSettings.hitCount > 1 && a.addActionAttached(c)
                }
            } else if (this.selectType == n.TRUE_TARGET) {
                var b = a.getTarget(true);
                if (b) {
                    var c = new sc.DirectHitForce(a, b, this.directHitSettings, this.effect);
                    sc.combat.addCombatForce(c);
                    this.directHitSettings.hitCount > 1 && a.addActionAttached(c)
                }
            } else {
                for (var b = a.combo.hitCombatants, d = b.length; d--;) {
                    c = b[d];
                    if (!(this.selectType == n.STUN_LOCKED && (!c.params || !c.params.isLockedBy(a)))) {
                        c = new sc.DirectHitForce(a,
                            c, this.directHitSettings, this.effect);
                        sc.combat.addCombatForce(c);
                        this.directHitSettings.hitCount > 1 && a.addActionAttached(c)
                    }
                }
            }
        }
    });
    sc.PROXY_STICK_TYPE = {
        NONE: 0,
        OWNER: 1,
        TARGET: 2,
        TRUE_TARGET: 3
    };
    var b = Vec3.create(),
        a = {
            ACTION_END_DESTROYED: 1,
            HIT_DESTROYED: 2
        };
    sc.CombatProxyEntity.inject({
        update: function() {
            this.parent();
            if (this.stickToSource == sc.PROXY_STICK_TYPE.TRUE_TARGET) {
                var a = this.getTarget(true);
                if (a) {
                    var d = ig.CollTools.getCenterXYAlignedPos(b, this.coll, a.coll);
                    this.setPos(d.x, d.y, a.coll.pos.z);
                    this.stickFaceAlign && a.face && Vec2.assign(this.face, a.face)
                }
            }
        }
    });
    var h = {
            TARGET: function(a) {
                return a.getTarget()
            },
            PROXY_OWNER: function(a) {
                return a.getCombatantRoot()
            },
            PROXY_SRC: function(a) {
                return a.sourceEntity
            },
            COLLAB_ENTITY: function(a) {
                return a.collabAttribs && a.collabAttribs.entity
            },
            OWNER_ENEMY: function(a) {
                return a.ownerEnemy
            },
            TRUE_TARGET: function(a) {
                return a.getTarget(true);
            }
        },
        c = Vec3.create();
    ig.ACTION_STEP.STICK_TO_TARGET = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                target: {
                    _type: "String",
                    _info: "Type of target",
                    _select: h
                },
                align: {
                    _type: "String",
                    _info: "Alignment of to target",
                    _select: ig.ENTITY_ALIGN
                },
                offset: {
                    _type: "Offset",
                    _info: "Offset to target"
                },
                duration: {
                    _type: "Number",
                    _info: "Duration of sticking"
                },
                waitUntil: {
                    _type: "VarCondition",
                    _info: "If defined: continue spinning until condition evaluates to true. Duration is minimum wait",
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.target = h[a.target];
            this.align = ig.ENTITY_ALIGN[a.align] || ig.ENTITY_ALIGN.BOTTOM;
            this.duration = a.duration || 0;
            this.offset = a.offset;
            this.waitUntil = new ig.VarCondition(a.waitUntil)
        },
        start: function(a) {
            var b = this.target && this.target(a);
            if (b) {
                a.stepTimer = this.duration;
                a.stepData.target = b
            }
        },
        run: function(a) {
            var b = a.stepData.target;
            if (!b) return true;
            b = b.getAlignedPos(this.align, c);
            this.offset && Vec3.add(b, this.offset);
            Vec2.addMulF(b, a.coll.size, -0.5);
            a.setPos(b.x, b.y, b.z);
            return !this.waitUntil.evaluate() ? false : a.stepTimer <= 0
        }
    });
});