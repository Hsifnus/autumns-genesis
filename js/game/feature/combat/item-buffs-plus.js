ig.module("game.feature.combat.item-buffs-plus").requires("game.feature.combat.stat-change", "game.feature.combat.combat-action-steps").defines(function() {
    var d = {
        SELF: function(a) {
            return a
        },
        PROXY_OWNER: function(a) {
            return a.getCombatantRoot()
        },
        PROXY_SRC: function(a) {
            return a.sourceEntity
        },
        TARGET: function(a) {
            return a.getTarget()
        },
        TRUE_TARGET: function(a) {
            return a.getTarget(true);
        }
    };
    sc.ItemBuffPlus = sc.StatChange.extend({
        timer: 0,
        time: 0,
        itemID: -1,
        name: null,
        init: function(a, b, e, f) {
            this.parent(a);
            this.timer = this.time = b || 0;
            this.itemID = e || -1
            this.name = f;
        },
        update: function() {
            if (this.timer > 0) {
                this.timer = this.timer - ig.system.actualTick;
                if (this.timer <= 0) {
                    this.timer = 0;
                    return true
                }
            }
            return false
        },
        clear: function() {
            this.timer = 0
        },
        reset: function(a) {
            this.timer = this.time = a + this.timer
        },
        hasTimer: true,
        getTimeFactor: function() {
            return this.time <=
                0 ? 0 : this.timer / this.time
        }
    });
    sc.STAT_CHANGE_SETTINGS["ATTACK-3"] = {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.ATTACK,
        value: 1.2,
        icon: "stat-attack",
        grade: "stat-rank-3"
    };
    sc.STAT_CHANGE_SETTINGS["NONE"] = {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.ATTACK,
        value: 1,
        icon: "stat-attack",
        grade: "stat-rank-1"
    };
    for (var i = 1; i <= 10; i++) {
        sc.STAT_CHANGE_SETTINGS[`WHALE-DEFENSE-${i}`] = {
            change: sc.STAT_CHANGE_TYPE.STATS,
            type: sc.STAT_PARAM_TYPE.DEFENSE,
            value: 1 + 0.05 * i,
            icon: "stat-defense",
            grade: "stat-rank-3"
        };
    }
    ig.ACTION_STEP.ADD_ITEM_BUFF_PLUS = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                target: {
                    _type: "String",
                    _info: "What entity will get the buff",
                    _select: d
                },
                stats: {
                    _type: "Array",
                    _info: "Stats to be applied.",
                    _sub: {
                        _type: "String",
                        _select: sc.STAT_CHANGE_SETTINGS
                    }
                },
                name: {
                    _type: "String",
                    _info: "Name that can be used to find/modify buff",
                    _optional: true
                },
                time: {
                    _type: "Number",
                    _info: "How long the item buff will last",
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.target = d[a.target] || d.SELF;
            this.stats = a.stats;
            this.name = a.name || null;
        },
        start: function(a) {
            var b = this.target(a);
            if (b && b.params) {
                var c = new sc.ItemBuffPlus(this.stats, this.time, -1, this.name);
                var d = b.params.buffs.filter(e => e.name === this.name);
                if (d.length > 0) {
                    b.params.modifyBuff(d[0], "attack", c.params.attack);
                    b.params.modifyBuff(d[0], "defense", c.params.defense);
                    b.params.modifyBuff(d[0], "elemFactor", c.params.elemFactor);
                    b.params.modifyBuff(d[0], "focus", c.params.focus);
                    b.params.modifyBuff(d[0], "hp", c.params.hp);
                } else {
                    b.params.addBuff(c);
                }
            }
        }
    });
});