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
    ig.FX_FIRST_TARGET_OPTION.TRUE_TARGET = function(a) {
        return a.getTarget(true)
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
            },
            TRUE_PLAYER: function(a) {
                return ig.game.playerEntity;
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
    ig.ACTION_STEP.WAIT_UNTIL_PLAYER_ACTION = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                actions: {
                    _type: "Array",
                    _info: "List of player actions to react to",
                    _sub: {
                        _type: "String",
                        _select: sc.PLAYER_ACTION
                    }
                },
                attrib: {
                    _type: "String",
                    _info: "Attrib name to store action value to if successfully found",
                    _optional: true
                },
                target: {
                    _type: "String",
                    _info: "Where is player found?",
                    _select: h,
                    _optional: true
                },
                maxTime: {
                    _type: "Number",
                    _info: "Maximum time to wait",
                    _optional: true
                },
                inverse: {
                    _type: "Boolean",
                    _info: "Whether to invert wait condition or not",
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.actions = a.actions || [];
            this.attrib = a.attrib || null;
            this.target = h[a.target] || h.SELF;
            this.maxTime = a.maxTime || 0
            this.inverse = a.inverse || false;
        },
        start: function(a) {
            this.attrib &&
                a.setAttribute(this.attrib, null);
            a.stepTimer = a.stepTimer + this.maxTime
        },
        run: function(a) {
            var b = this.target(a);
            var d = ((b = (b = b && b.getCombatantRoot()) && b.playerTrack && b.playerTrack.startedAction) && this.actions.indexOf(b) != -1) === !this.inverse;
            if (d && (!this.inverse || !b.currentAction)) {
                this.attrib && a.setAttribute(this.attrib, b);
                return true
            }
            return this.maxTime && a.stepTimer <= 0
        }
    });
    ig.ACTION_STEP.SET_PART_COLL_TYPE = ig.ActionStepBase.extend({
        value: null,
        partName: null,
        _wm: new ig.Config({
            attributes: {
                partName: {
                    _type: "String",
                    _info: "Name of part to change collision type of"
                },
                value: {
                    _type: "String",
                    _info: "Collision type of the part",
                    _select: ig.COLLTYPE
                }
            }
        }),
        init: function(a) {
            this.partName = a.partName;
            this.value = ig.COLLTYPE[a.value];
        },
        start: function(a) {
            for (var b = null, a = a.coll.subColls, c = a.length; c--;) {
                if (a[c].entity.partName == this.partName) {
                    b = a[c].entity;
                    break;
                }
            }
            if (b) {
                b.coll.type = this.value;
            }
        }
    });

    function navHelper(a, b, c) {
        if (!c) return true;
        if (a.maxTime && b.stepTimer <= 0 && !b.jumping) {
            c.interrupt();
            return true
        }
        return c.moveEntity() && !a.forceTime
    }
    var navigateToTargets = {
        ENEMY: function(a, b, c, d) {
            if (b = b.getTarget()) {
                a.toEntity(b, c, void 0, d);
                return true
            }
        },
        TRUE_ENEMY: function(a, b, c, d) {
            if (b = b.getTarget(true)) {
                a.toEntity(b, c, void 0, d);
                return true
            }
        },
        PROXY_OWNER: function(a, b, c, d) {
            if (b.combatant) {
                a.toEntity(b.combatant, c, void 0, d);
                return true
            }
        },
        PROXY_SRC: function(a, b, c, d) {
            if (b.sourceEntity) {
                a.toEntity(b.sourceEntity, c, void 0, d);
                return true
            }
        },
        COLLAB_ENTITY: function(a, b, c, d) {
            if (b.collabAttribs && b.collabAttribs.entity) {
                a.toEntity(b.collabAttribs.entity, c, void 0, d);
                return true
            }
        },
        COLLAB_POINT: function(a, b, c, d) {
            if (b.collabAttribs && b.collabAttribs.point) {
                a.toPoint(b.collabAttribs.point, c, d);
                return true
            }
        }
    };
    ig.ACTION_STEP.NAVIGATE_TO_TARGET = ig.ActionStepBase.extend({
        maxTime: 0,
        forceTime: false,
        distance: 0,
        planOnly: false,
        targetType: 0,
        _wm: new ig.Config({
            attributes: {
                maxTime: {
                    _type: "Number",
                    _info: "Maximum time spent on navigation"
                },
                forceTime: {
                    _type: "Boolean",
                    _info: "Keep moving, never stop until maxTime has been reached"
                },
                distance: {
                    _type: "Number",
                    _info: "The maximum amount of distance to the target"
                },
                planOnly: {
                    _type: "Boolean",
                    _info: "If true, only plan navigation, but don't execute it"
                },
                targetType: {
                    _type: "String",
                    _info: "Type of target",
                    _select: navigateToTargets
                },
                precise: {
                    _type: "Boolean",
                    _info: "Reach the target precisely, slowing down accordingly"
                }
            }
        }),
        init: function(a) {
            this.maxTime = a.maxTime || 0;
            this.distance =
                a.distance || 0;
            this.forceTime = a.forceTime || false;
            this.planOnly = a.planOnly || false;
            this.targetType = navigateToTargets[a.targetType] || navigateToTargets.ENEMY;
            this.precise = a.precise || false
        },
        start: function(a) {
            a.stepData.path = null;
            var b = a.nav ? a.nav.path : ig.navigation.getNavPath(a);
            if (this.targetType(b, a, this.distance, this.precise)) {
                a.stepTimer = a.stepTimer + this.maxTime;
                a.stepData.path = b
            }
        },
        run: function(a) {
            return this.planOnly ? true : navHelper(this, a, a.stepData.path)
        }
    });
    sc.COMBAT_CONDITION.TARGET_IS_ENTITY = ig.Class.extend({
        value: 0,
        _wm: new ig.Config({
            attributes: {
                entity: {
                    _type: "Entity",
                    _info: "Entity to search for."
                }
            }
        }),
        init: function(a) {
            assertContent(a, "entity");
            this.entity = a.entity
        },
        check: function(a) {
            var target = a.getTarget();
            var comparee = ig.Event.getEntity(this.entity);
            return target && comparee && target === comparee;
        }
    });
    ig.ACTION_STEP.ADD_TARGET_STUN_LOCK.inject({
        run: function(a) {
            var b = a.getTarget();
            b && (b.params && b.hasStun && b.hasStun()) && b.params.startLock(a);
            return true
        }
    });
    ig.ACTION_STEP.FACE_TO_TRUE_TARGET = ig.ActionStepBase.extend({
        value: false,
        immediately: false,
        _wm: new ig.Config({
            attributes: {
                value: {
                    _type: "Boolean",
                    _info: "True if enemy should always look at the target."
                },
                immediately: {
                    _type: "Boolean",
                    _info: "True if enemy should always look at the target IMMEDIATLY.",
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.value = a.value;
            this.immediately = a.immediately || false
        },
        run: function(a) {
            a.faceToTarget.active = this.value;
            a.forceFaceDirFixed = this.value;
            var b = a.getTarget(true);
            if (this.immediately && b) {
                b = Vec2.sub(b.getCenter(), a.getCenter());
                Vec2.isZero(b) && Vec2.assignC(b, 0, 1);
                a.faceToTarget.offset && Vec2.rotate(b, a.faceToTarget.offset * 2 * Math.PI);
                Vec2.assign(a.face, b)
            }
            return true
        }
    });
    ig.ACTION_STEP.MOVE_TO_TRUE_DISTANCE = ig.ActionStepBase.extend({
        min: 0,
        max: 0,
        maxTime: 0,
        offset: null,
        forceTime: false,
        _wm: new ig.Config({
            attributes: {
                min: {
                    _type: "Number",
                    _info: "Minimum distance to move to"
                },
                max: {
                    _type: "Number",
                    _info: "Maximum distance to move to"
                },
                maxTime: {
                    _type: "Number",
                    _info: "Maximum time to move"
                },
                offset: {
                    _type: "Vec2",
                    _info: "Offset to target.",
                    _optional: true
                },
                forceTime: {
                    _type: "Boolean",
                    _info: "Keep moving, never stop until maxTime has been reached"
                },
                rotateSpeed: {
                    _type: "Number",
                    _info: "Speed in which entity will rotate to target. In rotations per seconds.",
                    _default: 2,
                    _optional: true
                },
                missReactTime: {
                    _type: "Number",
                    _info: "Reaction time to stop tackle after target has been clearly missed",
                    _optional: true
                },
                collideCancel: {
                    _type: "Number",
                    _info: "If defined: if angle to collided wall is lower than this value, cancel step",
                    _optional: true
                },
                stopBeforeEdge: {
                    _type: "Boolean",
                    _info: "If true: Stop before falling down from edge when further moving forward"
                }
            }
        }),
        init: function(a) {
            this.min = a.min;
            this.max = a.max;
            this.maxTime = a.maxTime;
            this.offset = a.offset || null;
            this.forceTime =
                a.forceTime || false;
            this.rotateSpeed = a.rotateSpeed || 0;
            this.missReactTime = a.missReactTime;
            this.collideCancel = a.collideCancel;
            this.stopBeforeEdge = a.stopBeforeEdge
        },
        start: function(a) {
            a.stepTimer = a.stepTimer + this.maxTime;
            this.rotateSpeed && Vec2.assign(a.coll.accelDir, a.face)
        },
        run: function(a) {
            var b = a.getTarget(true);
            if (!b) return true;
            var c = Vec2.sub(b.getCenter(), a.getCenter());
            this.offset && Vec2.add(c, this.offset);
            var d = Vec2.length(c);
            d < this.min && Vec2.mulC(c, -1);
            if (this.rotateSpeed) {
                Vec2.rotateToward(a.face,
                    c, this.rotateSpeed * Math.PI * 2 * ig.system.tick);
                Vec2.assign(a.coll.accelDir, a.face)
            } else Vec2.assign(a.coll.accelDir, c);
            if (this.stopBeforeEdge && ig.CollTools.isPostMoveOverHole(a.coll, true)) {
                Vec2.assignC(a.coll.accelDir, 0, 0);
                Vec2.assignC(a.coll.vel, 0, 0);
                if (this.collideCancel) a.stepTimer = 0
            }
            if (this.collideCancel && ig.CollTools.hasWallCollide(a.coll, this.collideCancel)) a.stepTimer = 0;
            if (this.missReactTime != void 0 && this.missReactTime != null && a.stepTimer > this.missReactTime) {
                ig.CollTools.getDistVec2(a.coll, b.coll,
                    r);
                if (Vec2.angle(r, a.face) > Math.PI / 2) a.stepTimer = this.missReactTime
            }
            if (this.min <= d && d <= this.max) {
                if (!this.forceTime) return true;
                Vec2.assignC(a.coll.accelDir, 0, 0)
            }
            return a.stepTimer <= 0
        }
    });
});