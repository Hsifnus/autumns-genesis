ig.module("game.feature.gui.hud.special-party")
    .requires(
        "game.feature.gui.hud.member-hud",
        "game.feature.gui.hud.status-hud",
        "game.feature.party.party"
    ).defines(function() {
        var a = [1, 0.9, 0.75],
            d = [1, 0.8, 0.6];
        sc.PartyMemberDungeonExceptions = {
            "Coquelicot": ["autumn-dng", "final-dng"]
        }
        sc.SpecialPartyHudGui = ig.GuiElementBase.extend({
            model: null,
            memberGuis: [],
            transitions: {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.EASE_OUT
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: -32
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.EASE_IN
                }
            },
            init: function() {
                this.parent();
                sc.Model.addObserver(sc.party, this);
                sc.Model.addObserver(sc.model, this);
                this.updatePartySubGui()
                this.updateVisibility();
            },
            modelChanged: function(a, b) {
                a == sc.party ? b == sc.PARTY_MSG.PARTY_CHANGED ? this.updatePartySubGui() : b == sc.PARTY_MSG.DUNGEON_BLOCK_CHANGED && this.updateVisibility() : a == sc.model && this.updateVisibility()
            },
            updateVisibility: function() {
                var a = !sc.model.isLevelUp() && sc.party.isDungeonBlocked();
                this.doStateTransition(a ? "DEFAULT" : "HIDDEN");
                a && this.updatePartySubGui();
            },
            updatePartySubGui: function() {
                for (var a = this.memberGuis.length; a--;) this.memberGuis[a].remove(!this.hook._visible);
                this.memberGuis.length = 0;
                for (var b = sc.party.getPartySize(), c = 0, a = 0; a < b; ++a) {
                    var m = sc.party.getPartyMemberModelByIndex(a),
                        f = sc.PartyMemberDungeonExceptions[m.name],
                        e = new sc.MemberHudGui(m);
                    if (f && f.includes(sc.map.currentArea ? sc.map.currentArea.path : "")) {
                        e.setPos(0, c);
                        this.addChildGui(e);
                        this.memberGuis.push(e);
                        c = c + 26
                    }
                }
            }
        });
        sc.StatusHudGui.inject({
            init: function() {
                this.parent();
                this.specialPartyGui = new sc.SpecialPartyHudGui;
                this.specialPartyGui.setPos(2, 39);
                this.addChildGui(this.specialPartyGui);
            },
            _minimizeDisplay: function() {
                this.parent();
                this.specialPartyGui.doPosTranstition(2, 39, 0.3, KEY_SPLINES.EASE_IN_OUT);
            },
            _minimizeDisplayFast: function() {
                this.parent();
                this.specialPartyGui.doPosTranstition(2, 39, 0.3, KEY_SPLINES.EASE_IN_OUT);
            },
            _enterQuickMenuMode: function() {
                this.parent();
                this.specialPartyGui.doPosTranstition(2, 88, 0.2, KEY_SPLINES.EASE);
            },
            _enterMenuMode: function() {
                this.parent();
                this.specialPartyGui.doPosTranstition(2, 88, 0.2, KEY_SPLINES.EASE);
            },
            elementSwitchDisplay: function() {
                this.parent();
                this.specialPartyGui.doPosTranstition(2, 88, 0.1, KEY_SPLINES.LINEAR);
            }
        });
        sc.PartyModel.inject({
            _hasAddedSpecialParty: true,
            getPartySizeAlive: function(a) {
                for (var b = this.currentParty.length, c = 0; b--;) {
                    var d = this.getPartyMemberModel(this.currentParty[b]);
                    if (this.isDungeonBlocked() && sc.PartyMemberDungeonExceptions[d.name] === (sc.map.currentArea ? sc.map.currentArea.path : "")) {
                        c = c + 1;
                    } else if (d.isAlive() && (!a || !d.isAlive().temporary)) c = c + 1
                }
                return c
            },
            addExperience: function(b, c, d, h, i) {
                var j = this.getPartySize().limit(0, 2);
                if (i && i.ignorePartyCount) j = 0;
                for (var j = a[j] || 1, k = this.currentParty.length; k--;)
                    (!this.isDungeonBlocked() ||
                        sc.PartyMemberDungeonExceptions[this.models[this.currentParty[k]].name] ===
                        (sc.map.currentArea ? sc.map.currentArea.path : "")) && this.models[this.currentParty[k]].addExperience(b * j, c, d, h, i);
                return j
            },
            respawnSpecialMembers: function() {
                for (var c in sc.PartyMemberDungeonExceptions) {
                    if (this.currentParty.includes(c) && sc.PartyMemberDungeonExceptions[c].includes(sc.map.currentArea ? sc.map.currentArea.path : "")) {
                        this.models[c].isAlive() && this._spawnPartyMemberEntity(c, false, false);
                        d++;
                    }
                }
                this._updateEntitiesOffset()
            },
            onMapEnter: function() {
                this.partyEntities = {};
                this.resetAi();
                var a = sc.map.isDungeon(true),
                    b = null,
                    c = null;
                if (sc.map.isDungeon()) {
                    if (!this.dungeonBlocked) {
                        this.dungeonBlocked = true;
                        sc.Model.notifyObserver(this, sc.PARTY_MSG.DUNGEON_BLOCK_CHANGED);
                        b = "ENTER"
                    }
                    this.respawnSpecialMembers();
                } else {
                    if (this.dungeonBlocked) {
                        this.dungeonBlocked = false;
                        sc.Model.notifyObserver(this, sc.PARTY_MSG.DUNGEON_BLOCK_CHANGED);
                        b = "LEAVE"
                    }
                    this.respawnMembers()
                }
                if (a !=
                    this.lastAreaDungeon) c = (this.lastAreaDungeon = a) ? "ENTER" : "LEAVE";
                (b || c) && c
            },
            doDeferredEntityUpdate: function() {
                if (!this.dungeonBlocked) {
                    for (var a in this.partyEntities) this.isPartyMember(a) || this._removePartyMemberEntity(a);
                    for (var b = this.currentParty.length; b--;) {
                        a = this.currentParty[b];
                        this.partyEntities[a] || this._spawnPartyMemberEntity(a, true, false)
                    }
                    this._updateEntitiesOffset()
                } else {
                    for (var a in this.partyEntities)
                        this.isPartyMember(a) ||
                        sc.PartyMemberDungeonExceptions[a] !==
                        (sc.map.currentArea ? sc.map.currentArea.path : "") ||
                        this._removePartyMemberEntity(a);
                    for (var c in sc.PartyMemberDungeonExceptions) {
                        if (this.currentParty.includes(c) && sc.PartyMemberDungeonExceptions[c].includes(sc.map.currentArea ? sc.map.currentArea.path : "")) {
                            this.partyEntities[c] || this._spawnPartyMemberEntity(c, true, false);
                        }
                    }
                    this._updateEntitiesOffset()
                }
            }
        });
        ig.addGameAddon(function() {
            return sc.party = new sc.PartyModel;
        });
    });