ig.module("game.feature.skills.master-skills").requires(
	"game.feature.menu.gui.status.status-view-combat-arts",
    "game.feature.player.entities.player",
    "game.feature.player.player-config",
    "game.feature.player.player-model",
    "game.feature.skills.skills",
    "game.feature.menu.gui.circuit.circuit-detail-elements")
.defines(function() {
    sc.MasterSkills = [
        {
            element: sc.ELEMENT.HEAT,
            actionCheckKeys: ["DASH_SPECIAL3", "DASH_SPECIAL3_A", sc.PLAYER_ACTION.DASH_SPECIAL3],
            modifierKey: "DASH_SPECIAL3_MASTER",
            modifier: "MOTH_SPECIAL"
        },
        {
            element: sc.ELEMENT.WAVE,
            actionCheckKeys: ["GUARD_SPECIAL3", "GUARD_SPECIAL3_A", sc.PLAYER_ACTION.GUARD_SPECIAL3],
            modifierKey: "GUARD_SPECIAL3_MASTER",
            modifier: "BLOB_SPECIAL"
        },
        {
            element: sc.ELEMENT.SHOCK,
            actionCheckKeys: ["ATTACK_SPECIAL3", "ATTACK_SPECIAL3_A", sc.PLAYER_ACTION.ATTACK_SPECIAL3],
            modifierKey: "ATTACK_SPECIAL3_MASTER",
            modifier: "PHANTOM_SPECIAL"
        },
        {
            element: sc.ELEMENT.COLD,
            actionCheckKeys: ["THROW_SPECIAL3", "THROW_SPECIAL3_A", sc.PLAYER_ACTION.THROW_SPECIAL3],
            modifierKey: "THROW_SPECIAL3_MASTER",
            modifier: "DRILLER_SPECIAL"
        }
    ];
    const checkMasterSkill = (a, b, params) => {
        for (var i = 0; i < sc.MasterSkills.length; i++) {
            var skill = sc.MasterSkills[i];
            if (a == skill.element
                && skill.actionCheckKeys.some(key => key == b)
                && params.getModifier(skill.modifier)) {
                return skill.modifierKey;
            }
        }
        return "";
    }
    var actionIdx = Math.max(...Object.values(sc.PLAYER_ACTION)) + 1;
    sc.MasterSkills.forEach(skill => {
        if (!sc.PLAYER_ACTION[skill.modifierKey]) {
            (sc.PLAYER_ACTION[skill.modifierKey] = actionIdx);
            actionIdx++;
        }
    });
    ig.ENTITY.Player.inject({
        getChargeAction: function(a, b) {
            for (var c = a.actionKey; b && !this.model.getAction(sc.PLAYER_ACTION[c + b]);) b--;
            if (!b) return 0;
            var d = sc.PLAYER_SP_COST[b - 1];
            sc.newgame.get("infinite-sp") || this.model.params.consumeSp(d);
            var actionKey = checkMasterSkill(this.model.currentElementMode, c + b, this.model.params);
            if (actionKey && this.model.getAction(actionKey)) return actionKey;
            return c + b;
        }
    });
    sc.PlayerModel.inject({
        getCombatArt: function(a, b, c) {
            if (!c) {
                var actionKey, customPlayerAction;
                if ((actionKey = checkMasterSkill(a, b, this.params))
                    && (customPlayerAction = this.elementConfigs[a].getPlayerAction(actionKey))) {
                    return customPlayerAction
                }
            }
            return this.elementConfigs[a].getPlayerAction(b)
        },
        getCombatArtName: function(a) {
            var actionKey, customPlayerAction;
            if ((actionKey = checkMasterSkill(this.currentElementMode, a, this.params))
                && (customPlayerAction = this.elementConfigs[this.currentElementMode].getPlayerAction(actionKey))) {
                return customPlayerAction.name;
            }
            return this.elementConfigs[this.currentElementMode].getActiveCombatArtName(a)
        },
        getActiveCombatArt: function(a, b) {
            var actionKey, customPlayerAction;
            if ((actionKey = checkMasterSkill(a, b, this.params))
                && (customPlayerAction = this.elementConfigs[a].getPlayerAction(actionKey))) {
                return customPlayerAction.action;
            }
            return this.elementConfigs[a].getAction(b)
        },
        getAction: function(a) {
            var actionKey, customPlayerAction;
            if ((actionKey = checkMasterSkill(this.currentElementMode, a, this.params))
                && (customPlayerAction = this.elementConfigs[this.currentElementMode].getPlayerAction(actionKey))) {
                return customPlayerAction.action;
            }
            return this.elementConfigs[this.currentElementMode].getAction(a) || this.baseConfig.getAction(a)
        },
        getActionByElement: function(a, b) {
            var actionKey, customPlayerAction;
            if ((actionKey = checkMasterSkill(a, b, this.params))
                && (customPlayerAction = this.elementConfigs[a].getPlayerAction(actionKey))) {
                return customPlayerAction.action;
            }
            return this.elementConfigs[a].getAction(b) || this.baseConfig.getAction(b)
        }
    });
    function a(a, b, c, d) {
        b = g[b];
        if (!b) return null;
        b = b[a];
        if (!b) return null;
        b = b[c - 1];
        return !b ? null : b[d] || null
    }
    var g = {};
    g[sc.ELEMENT.NEUTRAL] = {
        THROW: [{
            A: {
                icon: 40
            },
            B: {
                icon: 41
            }
        }, {
            A: {
                icon: 42
            },
            B: {
                icon: 43
            }
        }],
        ATTACK: [{
            A: {
                icon: 44
            },
            B: {
                icon: 45
            }
        }, {
            A: {
                icon: 46
            },
            B: {
                icon: 47
            }
        }],
        DASH: [{
            A: {
                icon: 48
            },
            B: {
                icon: 49
            }
        }, {
            A: {
                icon: 50
            },
            B: {
                icon: 51
            }
        }],
        GUARD: [{
            A: {
                icon: 52
            },
            B: {
                icon: 53
            }
        }, {
            A: {
                icon: 54
            },
            B: {
                icon: 55
            }
        }]
    };
    g[sc.ELEMENT.HEAT] = {
        THROW: [{
            A: {
                icon: 60
            }
        }, {
            A: {
                icon: 61
            }
        }],
        ATTACK: [{
            A: {
                icon: 62
            },
            B: {
                icon: 63
            }
        }, {
            A: {
                icon: 64
            },
            B: {
                icon: 65
            }
        }, {
            A: {
                icon: 66
            },
            B: {
                icon: 67
            }
        }],
        DASH: [{
            A: {
                icon: 68
            },
            B: {
                icon: 69
            }
        }, {
            A: {
                icon: 70
            },
            B: {
                icon: 71
            }
        }, {
            A: {
                icon: 72
            },
            MASTER: {
                icon: -1,
                altSheet: "media/gui/master-arts.png",
                altIcon: 0
            }
        }],
        GUARD: [{
            A: {
                icon: 73
            },
            B: {
                icon: 74
            }
        }, {
            A: {
                icon: 75
            },
            B: {
                icon: 76
            }
        }, {
            A: {
                icon: 77
            },
            B: {
                icon: 78
            }
        }]
    };
    g[sc.ELEMENT.COLD] = {
        THROW: [{
            A: {
                icon: 80
            },
            B: {
                icon: 81
            }
        }, {
            A: {
                icon: 82
            },
            B: {
                icon: 83
            }
        }, {
            A: {
                icon: 84
            },
            MASTER: {
                icon: -1,
                altSheet: "media/gui/master-arts.png",
                altIcon: 3
            }
        }],
        ATTACK: [{
            A: {
                icon: 85
            },
            B: {
                icon: 86
            }
        }, {
            A: {
                icon: 87
            },
            B: {
                icon: 88
            }
        }, {
            A: {
                icon: 89
            },
            B: {
                icon: 90
            }
        }],
        DASH: [{
            A: {
                icon: 91
            }
        }, {
            A: {
                icon: 92
            }
        }],
        GUARD: [{
            A: {
                icon: 93
            },
            B: {
                icon: 94
            }
        }, {
            A: {
                icon: 95
            },
            B: {
                icon: 96
            }
        }, {
            A: {
                icon: 97
            },
            B: {
                icon: 98
            }
        }]
    };
    g[sc.ELEMENT.SHOCK] = {
        THROW: [{
            A: {
                icon: 100
            },
            B: {
                icon: 101
            }
        }, {
            A: {
                icon: 102
            },
            B: {
                icon: 103
            }
        }, {
            A: {
                icon: 104
            },
            B: {
                icon: 105
            }
        }],
        ATTACK: [{
            A: {
                icon: 106
            },
            B: {
                icon: 107
            }
        }, {
            A: {
                icon: 108
            },
            B: {
                icon: 109
            }
        }, {
            A: {
                icon: 110
            },
            MASTER: {
                icon: -1,
                altSheet: "media/gui/master-arts.png",
                altIcon: 2
            }
        }],
        DASH: [{
            A: {
                icon: 111
            },
            B: {
                icon: 112
            }
        }, {
            A: {
                icon: 113
            },
            B: {
                icon: 114
            }
        }, {
            A: {
                icon: 115
            },
            B: {
                icon: 116
            }
        }],
        GUARD: [{
            A: {
                icon: 117
            }
        }, {
            A: {
                icon: 118
            }
        }]
    };
    g[sc.ELEMENT.WAVE] = {
        THROW: [{
            A: {
                icon: 120
            },
            B: {
                icon: 121
            }
        }, {
            A: {
                icon: 122
            },
            B: {
                icon: 123
            }
        }, {
            A: {
                icon: 124
            },
            B: {
                icon: 125
            }
        }],
        ATTACK: [{
            A: {
                icon: 126
            }
        }, {
            A: {
                icon: 127
            }
        }],
        DASH: [{
            A: {
                icon: 128
            },
            B: {
                icon: 129
            }
        }, {
            A: {
                icon: 130
            },
            B: {
                icon: 131
            }
        }, {
            A: {
                icon: 132
            },
            B: {
                icon: 133
            }
        }],
        GUARD: [{
            A: {
                icon: 134
            },
            B: {
                icon: 135
            }
        }, {
            A: {
                icon: 136
            },
            B: {
                icon: 137
            }
        }, {
            A: {
                icon: 138
            },
            MASTER: {
                icon: -1,
                altSheet: "media/gui/master-arts.png",
                altIcon: 1
            }
        }]
    };
    var h = /(.+)_SPECIAL(\d)_(.+)/;
    sc.getCombatArtIcon = function(b, c) {
        var d = h.exec(c);
        if (d) return (d =
            a(d[1], b, d[2], d[3])) && d.icon || 0;
        return 0
    };
    sc.getCombatArtAltIcon = function(b, c) {
        var d = h.exec(c);
        if (d) return (d =
            a(d[1], b, d[2], d[3])) && d.altIcon || 0;
        return 0
    };
    sc.getCombatArtAltSheet = function(b, c) {
        var d = h.exec(c);
        if (d) return (d =
            a(d[1], b, d[2], d[3])) && d.altSheet || "";
        return ""
    };
    var b = {
        AIM_START: true,
        THROW_NORMAL: false,
        THROW_NORMAL_REV: false,
        THROW_CHARGED: false,
        THROW_CHARGED_REV: false,
        ATTACK: false,
        ATTACK_REV: false,
        ATTACK_FINISHER: false,
        DASH: false,
        DASH_SLOW: false,
        DASH_LONG: false,
        GUARD: true,
        CHARGING: false
    };
    sc.PlayerAction = ig.Class.extend({
        action: null,
        key: null,
        name: null,
        description: null,
        dmgType: null,
        stunType: false,
        status: false,
        altSheet: "",
        altIcon: 0,
        needsTarget: false,
        init: function(a, c, e) {
            this.key = a;
            if (c && c.steps) {
                this.action =
                    new ig.Action(a, c.steps, b[a]);
                this.name = c.name ? new ig.LangLabel(c.name) : null;
                this.description = c.description ? new ig.LangLabel(c.description) : null;
                this.dmgType = sc.ACTION_DMG_TYPE[c.dmgType] || null;
                this.stunType = sc.ACTION_STUN_TYPE[c.stunType] || false;
                this.status = c.status || false;
                this.needsTarget = c.needsTarget || false;
                this.icon = sc.getCombatArtIcon(e, this.key);
                this.altIcon = sc.getCombatArtAltIcon(e, this.key);
                this.altSheet = sc.getCombatArtAltSheet(e, this.key)
            } else this.action = new ig.Action(a, c, b[a])
        },
        clearCached: function() {
            this.action.clearCached()
        }
    });
    sc.StatusViewCombatArtsEntry.inject({
        init: function(a, b) {
            this.parent(a, b);
            this.setSize(512, 41);
            this.info = b;
            this.addText("lvl", 9, 2);
            var useAlt = this.info.icon == -1 && !!this.info.altSheet;
            useAlt && (this.skillIcons = new ig.Image(this.info.altSheet));
            var icon = useAlt ? this.info.altIcon : this.info.icon;
            this.icon = new ig.ImageGui(this.skillIcons, icon % 10 * 24, Math.floor(icon / 10) * 24, 24, 24);
            this.icon.setPos(3, 12);
            this.addChildGui(this.icon);
            this.level = new sc.NumberGui(9, {
                size: sc.NUMBER_SIZE.LARGE
            });
            this.level.setNumber(a);
            this.level.setPos(25,
                3);
            this.addChildGui(this.level);
            this.name = new sc.TextGui("\\c[3]" + b.name + "\\c[0]");
            this.name.setPos(40, -1);
            this.addChildGui(this.name);
            this.description = new sc.TextGui(b.description, {
                maxWidth: 460,
                font: sc.fontsystem.smallFont,
                linePadding: -3
            });
            this.description.setPos(40, 17);
            this.addChildGui(this.description);
            var c = 168,
                c = c + (this.addText("sp", c, 2).x + 3);
            this.sp = new sc.NumberGui(9);
            this.sp.setNumber(sc.PLAYER_SP_COST[a - 1]);
            this.sp.setPos(c, 3);
            this.addChildGui(this.sp);
            c = c + 13;
            c = c + (this.addText("dmgType",
                c, 2).x + 3);
            this.dmgType = new sc.TextGui(this.getDamageType(b.dmgType));
            this.dmgType.setPos(c, -1);
            this.addChildGui(this.dmgType);
            c = c + (this.dmgType.hook.size.x + 5);
            if (b.stunType || b.status && sc.menu.statusElement != 0) c = c + (this.addText("effects", c, 2).x + 2);
            if (b.stunType) {
                this.stunType = new sc.TextGui(this.getStunType(b.stunType));
                this.stunType.setPos(c, -1);
                this.addChildGui(this.stunType);
                c = c + (this.stunType.hook.size.x + 6)
            }
            if (b.status && sc.menu.statusElement == 0) {
                this.condition = new sc.TextGui("\\i[status-cond-0]" + ig.lang.get("sc.gui.menu.status.inflicts") + " " + ig.lang.get("sc.gui.menu.status.conditions")[0]);
                this.condition.setPos(c, -1);
                this.addChildGui(this.condition)
            }
        }
    });
    sc.SpecialSkill.inject({
        getDescription: function() {
            var a = sc.model.player.getCombatArt(this.element, this.skillType + "_SPECIAL" + this.level + "_" + this.branchType, true);
            return a && a.description ? a.description.toString() : ig.lang.get("sc.gui.skills.specials.wip.desc")
        },
        getName: function() {
            var a = sc.model.player.getCombatArt(this.element, this.skillType + "_SPECIAL" + this.level + "_" + this.branchType, true);
            return a && a.name ?
                a.name.toString() : ig.lang.get("sc.gui.skills.specials.wip.name")
        }
    });
});