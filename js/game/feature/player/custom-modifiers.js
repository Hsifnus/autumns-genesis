ig.module("game.feature.player.custom-modifiers").requires(
    "game.feature.player.modifiers",
    "game.feature.menu.gui.item.item-status-equip",
    "game.feature.menu.gui.menu-misc",
    "game.feature.menu.gui.status.status-misc").defines(function(){
    var a = Vec2.create();
    var b = ["#8bb5ff", "#ba0000", "#0036d0", "#a121bc", "#00994c", "#c7c7c7"];
    sc.MODIFIERS.MOTH_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 0,
        offY: 24,
        icon: -1,
        order: 100,
        noPercent: true
    };
    sc.MODIFIERS.DRILLER_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 36,
        offY: 24,
        icon: -1,
        order: 101,
        noPercent: true
    };
    sc.MODIFIERS.PHANTOM_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 24,
        offY: 24,
        icon: -1,
        order: 102,
        noPercent: true
    };
    sc.MODIFIERS.BLOB_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 12,
        offY: 24,
        icon: -1,
        order: 103,
        noPercent: true
    };
    sc.MODIFIERS.WIND_MELEE = {
        altSheet: "media/gui/stun-status.png",
        offX: 96,
        offY: 0,
        icon: -1,
        order: 102
    };
    // more modifiers go here!
    sc.SimpleStatusDisplay = sc.SimpleStatusDisplay.extend({
        init: function(a, b, c, d, i, j, k, l, x, y, z) {
            if (x) {
                this.newGfx = new ig.Image(x);
                this.offX = y || 0;
                this.offY = z || 0;
            }
            this.parent(a, b, c, d, i, j, k, l);
        },
        updateDrawables: function(b) {
            var c = 0,
                d = this.lineID * 12;
            if (this.noPercentMode) {
                a.x = this.simpleMode ? 144 : 0;
                a.y = (this.simpleMode ? 408 : 329) + d;
                b.addGfx(this.gfx, 0, 0, a.x, a.y, 72, 11);
                b.addGfx(this.gfx, 72, 0, a.x + 11, a.y, 9, 11);
                b.addGfx(this.gfx, 81, 10, a.x + 81, a.y, this.simpleMode ? 46 : 89, 11)
            } else b.addGfx(this.gfx, 0, 0, this.simpleMode ? 144 : 0, (this.simpleMode ? 408 : 329) + d, this.width, 11);
            if (this.offX === 0 || this.offX) {
                b.addGfx(this.newGfx, 0, 0, this.offX, this.offY, sc.MODIFIER_ICON_DRAW.SIZE, sc.MODIFIER_ICON_DRAW.SIZE)
            } else {
                c = this.iconIndex.x * (sc.MODIFIER_ICON_DRAW.SIZE + 1);
                d = this.iconIndex.y * (sc.MODIFIER_ICON_DRAW.SIZE + 1);
                b.addGfx(this.gfx, 0, 0, sc.MODIFIER_ICON_DRAW.X + c, sc.MODIFIER_ICON_DRAW.Y + d, sc.MODIFIER_ICON_DRAW.SIZE, sc.MODIFIER_ICON_DRAW.SIZE)
            }
        }
    });
    sc.ItemEquipModifier.inject({
        _createStatusDisplay: function(b, a, d, c, e, f, g, h, i, j) {
            var x = "",
                y = 0,
                z = 0
            if (d.length > 9 && d.slice(0, 9) == "modifier." && e == -1) {
                var modifier = sc.MODIFIERS[d.slice(9)];
                x = modifier.altSheet,
                    y = modifier.offX,
                    z = modifier.offY;
            }
            d = new sc.SimpleStatusDisplay(ig.lang.get("sc.gui.menu.equip." + d), c, e, f, g, true, 126, h, x, y, z);
            d.setPos(b, a);
            d.annotation = {
                type: "INFO",
                content: {
                    title: "sc.gui.menu.equip.modifier." + i,
                    description: "sc.gui.menu.equip.descriptions." +
                        i
                },
                offset: {
                    x: -1,
                    y: -1
                },
                index: {
                    x: 0,
                    y: j + 8
                }
            };
            this.addChildGui(d);
            return d
        }
    });
    sc.EquipStatusContainer.inject({
        _createStatusDisplay: function(a, b, c, e, f, g, h, i, j, k, l, o) {
            var x = "",
                y = 0,
                z = 0
            if (c.length > 9 && c.slice(0, 9) == "modifier." && f == -1) {
                var modifier = sc.MODIFIERS[c.slice(9)];
                x = modifier.altSheet;
                y = modifier.offX;
                z = modifier.offY;
            }
            g = new sc.SimpleStatusDisplay(ig.lang.get("sc.gui.menu.equip." + c), e, f, g, h, null, null, j, x, y, z);
            g.setPos(a, b);
            g.setCurrentValue(i);
            if (c == "res") {
                e == 1 && (c = "heat");
                e == 2 && (c = "cold");
                e == 3 && (c = "shock");
                e == 4 && (c = "wave")
            }
            l || (l = c);
            g.annotation = {
                type: "INFO",
                content: {
                    title: "sc.gui.menu.equip." + c,
                    description: "sc.gui.menu.equip.descriptions." + l
                },
                offset: {
                    x: -1,
                    y: -1
                },
                index: {
                    x: 0,
                    y: o != void 0 ? o + 8 : f
                }
            };
            k ? k.addChildGui(g) : this.addChildGui(g);
            return g
        }
    });
    sc.StatusViewModifiersContainer.inject({
        createLine: function(b, a, d, c, e) {
            var f = ig.lang.get("sc.gui.menu.equip.modifier." + b),
                g = ig.lang.get("sc.gui.menu.equip.descriptions." + b),
                a = new sc.StatusParamBar(f, g, 513, a, d, true, true, e, null, b);
            c && a.hideValues(true);
            this.entries[b] = a;
            this.list.addEntry(a,
                0);
            return a
        }
    });
    sc.StatusParamBar = sc.StatusParamBar.extend({
        init: function(a, b, c, e, f, g, h, i, j, k) {
            if (!!sc.MODIFIERS[k] && f == -1) {
                var modifier = sc.MODIFIERS[k];
                this.newGfx = new ig.Image(modifier.altSheet),
                    this.offX = modifier.offX,
                    this.offY = modifier.offY;
            }
            this.parent(a, b, c, e, f, g, h, i, j);
        },
        updateDrawables: function(a) {
            this.parent(a);
            var d = 0,
                c = this.lineID * 12,
                d = this.hook.size.x;
            if (this._hideAll) {
                a.addColor(b[this.lineID], 0,
                    10, 152, 1);
                a.addGfx(this.gfx, 152, 0, 71, 389, 13, 11);
                a.addColor(b[this.lineID], 165, 0, d - 244, 1)
            } else {
                a.addGfx(this.gfx, 0, 0, 0, 329 + c, 90, 11);
                a.addColor(b[this.lineID], 90, 0, d - 90 - 79, 1)
            }
            a.addGfx(this.gfx, d - 79, 0, 90, 329 + c, 79, 1);
            this.skipVertLine || a.addColor(b[this.lineID], 209 - (this._skillHidden ? 44 : 0), 0, 1, this.hook.size.y);
            if (this.usePercent && !this._hideAll) {
                a.addGfx(this.gfx, 107, 3, this._baseRed ? 9 : 0, 407, 8, 8);
                a.addGfx(this.gfx, 151, 3, this._equipRed ? 9 : 0, 407, 8, 8);
                this._skillHidden || a.addGfx(this.gfx, 195, 3, this._skillsRed ?
                    9 : 0, 407, 8, 8);
                if (sc.menu.statusDiff) {
                    a.addGfx(this.gfx, 151, 13, 0, 416, 8, 8);
                    this._skillHidden || a.addGfx(this.gfx, 195, 13, 0, 416, 8, 8)
                }
            }
            if (this.newGfx) {
                a.addGfx(this.newGfx, 0, 0, this.offX, this.offY, 11, 11)
            } else {
                d = this.iconIndex.x * 12;
                c = this.iconIndex.y * 12;
                a.addGfx(this.gfx, 0, 0, sc.MODIFIER_ICON_DRAW.X + d, sc.MODIFIER_ICON_DRAW.Y + c, 11, 11)
            }
        }
    });
    sc.TradeToggleStats.inject({
        _createStatusDisplay: function(b, a, d, c,
            e, f, g, h, i, j, k, l) {
            var x, y, z;
            if (d.length > 9 && d.slice(0, 9) == "modifier." && e == -1) {
                var modifier = sc.MODIFIERS[d.slice(9)];
                x = modifier.altSheet,
                y = modifier.offX,
                z = modifier.offY;
            }
            f = new sc.SimpleStatusDisplay(ig.lang.get("sc.gui.menu.equip." + d), c, e, f, g, null, 0, j, x, y, z);
            f.setPos(b, a);
            f.setCurrentValue(h, true);
            if (d == "res") {
                c == 1 && (d = "heat");
                c == 2 && (d = "cold");
                c == 3 && (d = "shock");
                c == 4 && (d = "wave")
            }
            k || (k = d);
            f.annotation = {
                type: "INFO",
                content: {
                    title: "sc.gui.menu.equip." + d,
                    description: "sc.gui.menu.equip.descriptions." + k
                },
                offset: {
                    x: -1,
                    y: -1
                },
                index: {
                    x: 0,
                    y: l + 8 || e
                }
            };
            this.addChildGui(f);
            return f
        },
        _setParameters: function(b) {
            this._resetParameters();
            var a = null,
                d = sc.inventory.getItem(b),
                b = null;
            this.level = 0;
            this.compareItem.setPos(this.titleOffset - 2 + this.compareHelpText.hook.size.x, 13);
            var c = ig.lang.get("sc.gui.trade.compare") + " ";
            if (sc.trade.compareMode ==
                sc.TRADE_COMPARE_MODE.BASE_STATS) {
                a = -1;
                c = c + ig.lang.get("sc.gui.trade.compareBASE");
                this.compareItem.setText("-----------------");
                this.level = 0
            } else {
                switch (d.equipType) {
                    case sc.ITEMS_EQUIP_TYPES.HEAD:
                        a = sc.model.player.equip.head;
                        c = c + ig.lang.get("sc.gui.trade.compareHEAD");
                        break;
                    case sc.ITEMS_EQUIP_TYPES.ARM:
                        if (sc.trade.compareMode == sc.TRADE_COMPARE_MODE.OFF_HAND) {
                            a = sc.model.player.equip.leftArm;
                            c = c + ig.lang.get("sc.gui.trade.compareARMLeft")
                        } else {
                            a = sc.model.player.equip.rightArm;
                            c = c + ig.lang.get("sc.gui.trade.compareARMRight")
                        }
                        break;
                    case sc.ITEMS_EQUIP_TYPES.TORSO:
                        a = sc.model.player.equip.torso;
                        c = c + ig.lang.get("sc.gui.trade.compareTORSO");
                        break;
                    case sc.ITEMS_EQUIP_TYPES.FEET:
                        a = sc.model.player.equip.feet;
                        c = c + ig.lang.get("sc.gui.trade.compareFEET")
                }
                if (a >= 0) {
                    b = sc.inventory.getItem(a);
                    if (b.type == sc.ITEMS_TYPES.EQUIP) this.level = b.level || 1;
                    var e;
                    e = "" + ("\\i[" + (b.icon + sc.inventory.getRaritySuffix(b.rarity || 0) || "item-default") + "]");
                    e = e + ig.LangLabel.getText(b.name);
                    this.compareItem.setText(e)
                } else {
                    this.compareItem.setText("\\i[" + this._getBodyPartIcon(d.equipType) +
                        "]-----------------");
                    this.level = 0
                }
            }
            this.compareText.setText(c);
            this.level > 0 ? this.compareItem.setDrawCallback(function(a, b) {
                sc.MenuHelper.drawLevel(this.level, a, b, this.ninepatch.gfx)
            }.bind(this)) : this.compareItem.setDrawCallback(null);
            c = d.params;
            e = this._calculateDifference(a, "hp", c.hp || 0);
            this.baseParams.hp.setChangeValue(e);
            e = this._calculateDifference(a, "attack", c.attack || 0);
            this.baseParams.atk.setChangeValue(e);
            e = this._calculateDifference(a, "defense", c.defense || 0);
            this.baseParams.def.setChangeValue(e);
            e = this._calculateDifference(a, "focus", c.focus || 0);
            this.baseParams.foc.setChangeValue(e);
            e = this._calculateDifference(a, "elemFactor", c.elemFactor ? c.elemFactor[0] : 1, 0);
            this.baseParams.fire.setChangeValue(e);
            e = this._calculateDifference(a, "elemFactor", c.elemFactor ? c.elemFactor[1] : 1, 1);
            this.baseParams.cold.setChangeValue(e);
            e = this._calculateDifference(a, "elemFactor", c.elemFactor ? c.elemFactor[2] : 1, 2);
            this.baseParams.shock.setChangeValue(e);
            e = this._calculateDifference(a, "elemFactor", c.elemFactor ? c.elemFactor[3] : 1, 3);
            this.baseParams.wave.setChangeValue(e);
            if (d = d.properties) {
                var b = b ? b.properties || {} : {},
                    c = 166,
                    g = 0,
                    f;
                for (f in this.modifierPool)
                    if (d[f] != void 0 || b[f] != void 0) g++;
                var h = g <= 6 ? 16 : 12;
                for (f in this.modifierPool)
                    if (d[f] != void 0) {
                        this.modifierPool[f].doStateTransition("DEFAULT", true);
                        if (b[f]) {
                            this.modifierPool[f].setChangeValue(this._calculateDifferenceModifier(a, f, d[f]));
                            this.modifierPool[f].setCurrentValue(b[f], true)
                        } else this.modifierPool[f].setChangeValue(Math.round((d[f] || 0) * 100 - 100) / 100);
                        this.modifierPool[f].setPos(this.lineOffset, c);
                        c = c + h
                    } else if (b[f] != void 0) {
                    this.modifierPool[f].doStateTransition("DEFAULT",
                        true);
                    this.modifierPool[f].setChangeValue(this._calculateDifferenceModifier(a, f, 1));
                    this.modifierPool[f].setCurrentValue(b[f], true);
                    this.modifierPool[f].setPos(this.lineOffset, c);
                    c = c + h
                } else this.modifierPool[f].doStateTransition("HIDDEN", true)
            }
        }
    });
});