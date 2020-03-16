ig.module("impact.feature.weather.wind").requires(
    "impact.feature.weather.weather-steps",
    "game.feature.combat.combat-force",
    "impact.feature.map-sounds.map-sounds-steps",
    "impact.base.game").defines(function() {
    sc.WIND_STRENGTH = {
        RIGHT_MEDIUM: 130,
        RIGHT_WEAK: 80,
        NONE: 0,
        LEFT_WEAK: -80,
        LEFT_MEDIUM: -130
    };
    sc.WIND_PARTICLE_COUNT = {
        RIGHT_MEDIUM: 32,
        RIGHT_WEAK: 20,
        NONE: 2,
        LEFT_WEAK: 20,
        LEFT_MEDIUM: 32
    };
    sc.WIND_PARTICLE_DIR = {
        RIGHT_MEDIUM: {
            x: 250,
            y: 45
        },
        RIGHT_WEAK: {
            x: 200,
            y: 100
        },
        NONE: {
            x: 0,
            y: 1
        },
        LEFT_WEAK: {
            x: -200,
            y: 100
        },
        LEFT_MEDIUM: {
            x: -250,
            y: 45
        }
    }
    const weakWindEntry = new ig.MapSoundEntry("BERGEN_TRAIL_WIND_SUBTLE");
    const mediumWindEntry = new ig.MapSoundEntry("BERGEN_TRAIL_WIND");
    sc.WindData = {
        protoVictims: [],
        victims: [],
        currentSpeed: 0,
        strength: "NONE"
    };
    ig.EVENT_STEP.SET_WIND_ON_ENTITIES = ig.EventStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                entities: {
                    _type: "Entities",
                    _info: "Entities to spawn wind force on"
                },
                strength: {
                    _type: "String",
                    _info: "Strength of wind",
                    _select: ["NONE", "LEFT_WEAK", "LEFT_MEDIUM", "RIGHT_WEAK", "RIGHT_MEDIUM"]
                },
                immediately: {
                    _type: "Boolean",
                    _info: "If true, change weather immediately with no transition"
                }
            }
        }),
        init: function(b) {
            this.strength = b.strength;
            this.immediately = b.immediately;
            this.entities = b.entities || [];
        },
        clearCached: function() {
            this.weather.decreaseRef()
        },
        start: function(a, b) {
            var weather = {
                ...ig.weather.currentWeather,
                config: {
                    ...ig.weather.currentWeather.config,
                    rain: ig.RAIN_STRENGTH[this.strength === "NONE" ? "NONE" : "WIND_" + this.strength]
                }
            };
            weather.particleSpawners.forEach(spawner => {
                if (this.strength === "NONE") {
                    spawner.config = ig.ENV_PARTICLES[spawner.name];
                    spawner._initLevels();
                } else {
                    spawner.config = {
                        ...spawner.config,
                        dir: sc.WIND_PARTICLE_DIR[this.strength],
                        speed: Math.abs(sc.WIND_STRENGTH[this.strength])
                    }
                    spawner.setQuantity(sc.WIND_PARTICLE_COUNT[this.strength]);
                }
            });
            ig.weather.setWeather(weather, this.immediately);
            sc.WindData.protoVictims = [...this.entities.map(e => ({
                ...e
            }))];
            sc.WindData.strength = this.strength;
            this.entities = this.entities.map(e => ig.Event.getEntity(e, b)).filter(e => !!e);
            if (this.strength === "NONE") {
                ig.mapSounds.setEntry(ig.mapSounds.mapEntry);
            } else if (this.strength === "LEFT_WEAK" || this.strength === "RIGHT_WEAK") {
                ig.mapSounds.setEntry(weakWindEntry);
            } else {
                ig.mapSounds.setEntry(mediumWindEntry);
            }
            sc.WindData.victims = this.strength === "NONE" ? [] : this.entities;
            sc.WindData.currentSpeed = sc.WIND_STRENGTH[this.strength];
            this.entities.forEach(a => {
                for (var e = a.actionAttached, b = e.length; b--;) {
                    var c = e[b];
                    if (c instanceof sc.WindForce && c.isRepeating()) c.stopWindForce();
                }
                var d = new sc.WindForce(a, this.strength, -1);
                sc.combat.addCombatForce(d);
                a.addActionAttached(d);
            });
        }
    });
    var b = Vec3.create();
    sc.WindForce = ig.Class.extend({
        radius: 0,
        fadeRadius: 0,
        zHeight: 0,
        timer: 0,
        pullAll: false,
        combatant: null,
        combatantRoot: null,
        dead: false,
        onActionEndDetach: function() {},
        stopWindForce: function() {
            this.combatantRoot && this.combatantRoot.removeActionAttached(this);
            this.combatantRoot = null;
            this.onEnd();
        },
        getCombatant: function() {
            return this.combatant
        },
        getCombatantRoot: function() {
            return this.combatantRoot
        },
        init: function(a, b, c) {
            this.combatant = a;
            this.combatantRoot = a.getCombatantRoot && a.getCombatantRoot() || a;
            this.radius = 512;
            this.minRadius = 0;
            this.fadeRadius = 10;
            this.strength = sc.WIND_STRENGTH[b] || sc.WIND_STRENGTH.NONE;
            this.influence = new ig.InfluenceEntry;
            this.influence.setPushType(sc.INFLUENCE_PUSH.PUSH, this.minRadius, this.fadeRadius, this.strength);
            this.zHeight = 32;
            this.timer = c;
            this.party = this.combatant.party;
            this.align = ig.ENTITY_ALIGN.BOTTOM;
        },
        update: function() {
            if (this.dead) {
                stopWindForce();
                return;
            }
            if (!this.combatant.respawn.timer &&
                !(this.combatant.currentAction &&
                    this.combatant.currentAction.name.includes("SPECIAL") &&
                    this.combatant.coll.pos.z != this.combatant.coll.baseZPos) &&
                !sc.model.isCutscene() &&
                !this.combatant.interactObject &&
                !(this.combatant === ig.game.playerEntity &&
                    this.combatant.stepData.path &&
                    this.combatant.stepData.path.moveEntity()) &&
                !(this.combatant.currentActionStep &&
                    this.combatant.currentActionStep.target &&
                    this.combatant.currentActionStep.target.x !== undefined &&
                    this.combatant.currentActionStep.target.y !== undefined)) {
                this.combatant.actionAttached.indexOf(this) === -1 && this.combatant.addActionAttached(this);
                var c = this.combatant.getAlignedPos(this.align, b);
                var d = Vec2.create();
                d.x = -10;
                Vec2.add(c, d);
                this.influence.setPushCenter(c);
                this.combatant.influencer.addInfluence(this.influence);
            } else {
                this.combatant.influencer.removeInfluence(this.influence);
                this.influence.updateInfluencer = this.combatant.influencer;
            }
            if (this.timer > 0) {
                this.timer = this.timer - ig.system.tick;
                if (this.timer <= 0) this.timer = 0
            }
            this.dead = this.dead || this.timer == 0
            return this.timer == 0
        },
        onEnd: function() {
            this.dead = true;
            this.combatant.influencer.removeInfluence(this.influence);
            this.combatant.removeActionAttached(this);
            sc.combat.forces.indexOf(this) >= 0 && sc.combat.forces.splice(sc.combat.forces.indexOf(this), 1);
        },
        isRepeating: function() {
            return this.timer < 0
        }
    });
    ig.ENTITY.Combatant.inject({
        show: function(a) {
            this.parent(a);
            if (sc.WindData.strength !== "NONE" && this instanceof ig.ENTITY.Combatant) {
                if (this instanceof sc.PartyMemberEntity &&
                    sc.party.currentParty.includes(this.model.name) &&
                    !sc.party.partyEntities[this.model.name]) {
                    sc.party.partyEntities[this.model.name] = this;
                }
                var currentVictims = sc.WindData.protoVictims.map(e => ig.Event.getEntity(e, this)).filter(e => !!e);
                if (currentVictims.includes(this)) {
                    var e = new sc.WindForce(this, sc.WindData.strength, -1);
                    sc.combat.addCombatForce(e);
                    this.addActionAttached(e);
                    sc.WindData.victims.push(this);
                }
            }
        }
    });
});