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
    ig.lang = new ig.Lang;
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
});