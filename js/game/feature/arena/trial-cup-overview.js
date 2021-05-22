ig.module("game.feature.arena.trial-cup-overview").requires("game.feature.arena.gui.arena-trophy-gui").defines(function() {
    sc.ArenaCupOverview = ig.GuiElementBase.extend({
        gfx: new ig.Image("media/gui/menu.png"),
        transitions: {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE_OUT
            },
            HIDDEN: {
                state: {
                    alpha: 0
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE_IN
            }
        },
        interact: null,
        content: null,
        msgBox: null,
        header: null,
        medals: null,
        list: null,
        trophy: null,
        effect: null,
        total: null,
        time: null,
        rushTime: null,
        rushChain: null,
        totalOverlay: null,
        score: null,
        trophyHeader: null,
        trophyFooter: null,
        callback: null,
        entries: [],
        currentIndex: 0,
        timer: 0,
        totalValue: 0,
        totalTime: 0,
        addEntries: false,
        cup: null,
        trophyType: null,
        state: 0,
        blockTimer: 0,
        initGui: false,
        scoreCountSound: new ig.Sound("media/sound/arena/arena-score-count.ogg",
            0.8, 0.1),
        scoreDotSound: new ig.Sound("media/sound/arena/score-dot.ogg", 0.8),
        scoreDotPitch: 0.8,
        init: function(b, a) {
            this.parent();
            this.hook.zIndex = 9999998;
            this.hook.localAlpha = 0.8;
            this.hook.temporary = true;
            this.hook.pauseGui = true;
            this.hook.size.x = ig.system.width;
            this.hook.size.y = ig.system.height;
            this.cup = b;
            this.callback = a;
            this.interact = new sc.ScreenInteractEntry(this, true);
            this.content = new ig.GuiElementBase;
            this.content.setSize(280, sc.arena.isTrial(this.cup) ? 126 : 166);
            this.header = new sc.TextGui("");
            this.header.setAlign(ig.GUI_ALIGN_X.CENTER,
                ig.GUI_ALIGN_Y.TOP);
            this.header.setPos(0, -4);
            this.content.addChildGui(this.header);
            var d = new ig.ColorGui("#7E7E7E", 280, 1);
            d.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.TOP);
            d.setPos(0, 13);
            this.content.addChildGui(d);
            this.medals = new ig.GuiElementBase;
            this.list = new sc.ScrollPane(sc.ScrollType.Y_ONLY);
            this.list.showTopBar = false;
            this.list.showBottomBar = false;
            this.list.setContent(this.medals);
            this.list.setSize(184, 76);
            this.list.setPos(0, 13);
            this.content.addChildGui(this.list);
            d = new ig.ColorGui("#7E7E7E",
                280, 1);
            d.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.TOP);
            d.setPos(0, 13 + this.list.hook.size.y - 1);
            this.content.addChildGui(d);
            this.total = new sc.STATS_ENTRY_TYPE.KeyValue("total", {
                value: 1,
                maxValue: 999999999,
                asNumber: true,
                numberDots: true,
                numberSize: sc.NUMBER_SIZE.TEXT,
                transitionTime: 0.2
            }, 286);
            this.total.keyGui.setText(ig.lang.get("sc.gui.arena.totalScore"));
            this.total.setPos(-3, 13 + this.list.hook.size.y);
            this.total.setValueAsNumber(0, true);
            this.content.addChildGui(this.total);
            this.totalOverlay = new sc.NumberGui(999999999, {
                size: sc.NUMBER_SIZE.TEXT,
                dots: true,
                transitionTime: 0.2,
                color: sc.GUI_NUMBER_COLOR.NO_SHADOW
            });
            this.totalOverlay.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.1,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0
                    },
                    time: 0.1,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.totalOverlay.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_CENTER);
            this.totalOverlay.setPos(5, 0);
            this.totalOverlay.doStateTransition("HIDDEN", true);
            this.total.addChildGui(this.totalOverlay);
            this.time = new sc.STATS_ENTRY_TYPE.Time("total", {
                value: function() {
                    return 0
                },
                leading: 2,
                max: 99,
                millis: true,
                hideHours: true,
                transitionTime: 0.2
            }, 286);
            this.time.keyGui.setText(ig.lang.get("sc.gui.arena.menu.time"));
            this.time.setPos(-3, this.total.hook.pos.y + 20);
            this.time.setTime(0, true);
            this.content.addChildGui(this.time);
            this.rushTime = new sc.STATS_ENTRY_TYPE.Time("total", {
                value: function() {
                    return 0
                },
                leading: 2,
                max: 99,
                millis: true,
                hideHours: true,
                transitionTime: 0.2
            }, 262);
            this.rushTime.keyGui.setText(ig.lang.get("sc.gui.arena.menu.rush"));
            this.rushTime.setPos(-3, this.time.hook.pos.y +
                20);
            this.rushTime.setTime(0, true);
            if (!sc.arena.isTrial(this.cup)) {
                this.content.addChildGui(this.rushTime);
            }
            this.rushTime.hook.pos.x = this.rushTime.hook.pos.x + 24;
            d = new ig.ImageGui(this.gfx, 512, 207, 17, 16);
            d.setPos(-17, -1);
            this.rushTime.addChildGui(d);
            this.rushChain = new sc.STATS_ENTRY_TYPE.KeyValue("total", {
                value: 1,
                maxValue: 999999999,
                asNumber: true,
                numberDots: true,
                numberSize: sc.NUMBER_SIZE.TEXT,
                transitionTime: 0.2
            }, 286);
            this.rushChain.keyGui.setText(ig.lang.get("sc.gui.arena.rushChainHigh"));
            this.rushChain.setPos(-3, this.rushTime.hook.pos.y +
                20);
            this.rushChain.setValueAsNumber(0, true);
            if (!sc.arena.isTrial(this.cup)) {
                this.content.addChildGui(this.rushChain);
            }
            this.trophy = new ig.GuiElementBase;
            this.trophy.setSize(96, 74);
            this.trophy.setPos(184, 14);
            this.content.addChildGui(this.trophy);
            this.trophyType = sc.arena.getCupTrophy(this.cup);
            if (this.trophyType > 0) {
                this.trophyHeader = new sc.TextGui("\\c[4]" + ig.lang.get("sc.gui.arena.overview.trophyHeader") + "\\c[0]", {
                    font: sc.fontsystem.smallFont
                });
                this.trophyHeader.hook.transitions = {
                    DEFAULT: {
                        state: {},
                        time: 0.4,
                        timeFunction: KEY_SPLINES.EASE_OUT
                    },
                    HIDDEN: {
                        state: {
                            alpha: 0,
                            offsetX: 30
                        },
                        time: 0.2,
                        timeFunction: KEY_SPLINES.EASE_IN_OUT
                    }
                };
                this.trophyHeader.setPos(2, 0);
                this.trophyHeader.doStateTransition("HIDDEN", true);
                this.trophy.addChildGui(this.trophyHeader);
                d = ig.lang.get("sc.gui.arena.medals")[this.trophyType - 1];
                this.trophyFooter = new sc.TextGui("\\c[4]" + d + "\\c[0]", {
                    font: sc.fontsystem.smallFont,
                    maxWidth: 76,
                    textAlign: ig.Font.ALIGN.RIGHT,
                    linePadding: -3
                });
                this.trophyFooter.setAlign(ig.GUI_ALIGN_X.RIGHT, ig.GUI_ALIGN_Y.BOTTOM);
                this.trophyFooter.setPos(0, -2);
                this.trophyFooter.hook.transitions = {
                    DEFAULT: {
                        state: {},
                        time: 0.4,
                        timeFunction: KEY_SPLINES.EASE_OUT
                    },
                    HIDDEN: {
                        state: {
                            alpha: 0,
                            offsetX: 30
                        },
                        time: 0.2,
                        timeFunction: KEY_SPLINES.EASE_IN_OUT
                    }
                };
                this.trophyFooter.setPos(2, 0);
                this.trophyFooter.doStateTransition("HIDDEN", true);
                this.trophy.addChildGui(this.trophyFooter);
                this.effect = new sc.ArenaMedalEffect;
                this.effect.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.CENTER);
                this.trophy.addChildGui(this.effect)
            } else {
                this.trophyHeader = new sc.TextGui("\\c[4]" + ig.lang.get("sc.gui.arena.overview.trophyNone") +
                    "\\c[9]", {
                        font: sc.fontsystem.smallFont,
                        maxWidth: 80,
                        textAlign: ig.Font.ALIGN.CENTER
                    });
                this.trophyHeader.hook.transitions = {
                    DEFAULT: {
                        state: {},
                        time: 0.4,
                        timeFunction: KEY_SPLINES.EASE_OUT
                    },
                    HIDDEN: {
                        state: {
                            alpha: 0
                        },
                        time: 0.2,
                        timeFunction: KEY_SPLINES.EASE_IN_OUT
                    }
                };
                this.trophyHeader.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.CENTER);
                this.trophy.addChildGui(this.trophyHeader)
            }
            this.msgBox = new sc.CenterBoxGui(this.content);
            this.msgBox.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
            this.addChildGui(this.msgBox);
            this.doStateTransition("HIDDEN", true)
        },
        update: function() {
            if (this.blockTimer > 0) this.blockTimer = this.blockTimer - ig.system.tick;
            else {
                if (this.done) {
                    sc.control.menuScrollUp() ? this.list.scrollY(-18) : sc.control.menuScrollDown() && this.list.scrollY(18);
                    sc.control.arenaScrollDown() ? this.list.scrollY(140 * ig.system.tick) : sc.control.arenaScrollUp() && this.list.scrollY(-140 * ig.system.tick)
                }
                if (this.addEntries) {
                    if (this.currentIndex > 0 && (!sc.arena.isTrial(this.cup) || !this.entries[this.currentIndex].isRush)) {
                        if (this.scoreDotPitch < 1.5) this.scoreDotPitch = this.scoreDotPitch + 0.6 * ig.system.tick;
                        this.scoreDotSound.play(false, {
                            speed: this.scoreDotPitch
                        })
                    }
                    if (this.timer <= 0)
                        if (this.currentIndex == -1) {
                            this.timer = 0.1;
                            this.currentIndex = 0
                        } else {
                            if (!this.initGui) {
                                this.rushTime.setTime(sc.arena.getRoundTime(this.cup, -1));
                                this.rushChain.setValueAsNumber(sc.arena.getCupProgress(this.cup).rush.chain);
                                this.initGui = true
                            }
                            var b = this.entries[this.currentIndex];
                            if (sc.arena.isTrial(this.cup) && b.isRush) {
                                this.currentIndex++;
                                return;
                            }
                            if (sc.arena.isRoundEncore(this.cup, b.id-1)) {
                                this.currentIndex++;
                            } else {
                                var a = new sc.ArenaCupOverview.MedalEntry(b.id, b.medal, false, b.isRush);
                                var d = sc.arena.isTrial(this.cup) ? ~~((b.id - 1) / 10) : ~~(b.id / 10);
                                a.setPos(1 + (sc.arena.isTrial(this.cup) ? b.id - 1 : b.id) % 10 * 18, 2 + d * 18);
                                this.medals.addChildGui(a);
                                this.totalValue =
                                    this.totalValue + b.points;
                                this.total.setValueAsNumber(this.totalValue);
                                if (b.time) {
                                    this.totalTime = this.totalTime + b.time;
                                    this.time.setTime(this.totalTime)
                                }
                                this.currentIndex++;
                                this.medals.hook.size.y = 2 + (d + 1) * 18;
                                this.list.recalculateScrollBars(true);
                                this.list.setScrollY(this.medals.hook.size.y, false, 0.1, KEY_SPLINES.LINEAR);
                                this.timer = 0.1;
                            }
                            if (this.currentIndex >= this.entries.length) {
                                this.addEntries = false;
                                this.done = true;
                                this.timer = 0.2;
                                this.trophyHeader && this.trophyHeader.doStateTransition("DEFAULT");
                                this.trophyFooter &&
                                    this.trophyFooter.doStateTransition("DEFAULT", false, false, null, 0.4)
                            }
                        }
                    else this.timer = this.timer - ig.system.tick
                } else if (this.done && this.timer > 0) {
                    this.timer = this.timer - ig.system.tick;
                    if (this.scoreDotPitch < 1.5) this.scoreDotPitch = this.scoreDotPitch + 0.6 * ig.system.tick;
                    this.scoreDotSound.play(false, {
                        speed: this.scoreDotPitch
                    });
                    if (this.timer <= 0) {
                        this.totalOverlay.setMaxNumber(this.totalValue);
                        this.totalOverlay.setNumber(this.totalValue, true);
                        this.totalOverlay.doStateTransition("DEFAULT", false, false, () => this.totalOverlay.doStateTransition("HIDDEN"));
                        this.scoreCountSound.play();
                        this.state = 1;
                        this.effect && this.effect.show(this.trophyType, true)
                    }
                }
            }
        },
        updateDrawables: function(b) {
            b.addColor("#000", 0, 0, this.hook.size.x, this.hook.size.y)
        },
        show: function(b) {
            ig.interact.addEntry(this.interact);
            this.blockTimer = 0.1;
            b = b || ig.lang.get("sc.gui.arena.overview.cupHeader").replace("[CUP_NAME]", sc.arena.getCupName(this.cup));
            this.header.setText(b);
            this.addMedals();
            this.msgBox.doStateTransition("DEFAULT");
            this.doStateTransition("DEFAULT")
        },
        hide: function() {
            this.addEntries =
                false;
            this.blockTimer = 1;
            this.effect && ig.EffectTools && this.effect.hide(true);
            ig.interact.removeEntry(this.interact);
            ig.interact.setBlockDelay(0.2);
            this.msgBox.doStateTransition("HIDDEN");
            this.doStateTransition("HIDDEN", false, true)
        },
        addMedals: function() {
            this.medals.removeAllChildren();
            this.list.recalculateScrollBars(true);
            this.totalTime = this.totalValue = this.entries.length = 0;
            this.time.setTime(0, true);
            this.rushTime.setTime(0, true);
            this.rushChain.setValueAsNumber(0, true);
            this.total.setValueAsNumber(0, true);
            var b = sc.arena.getCupProgress(this.cup);
            if (b) {
                this.entries.push({
                    id: 0,
                    medal: b.rush.medal || 0,
                    points: b.rush.points || 0,
                    isRush: true
                });
                for (var b = b.rounds, a = 0; a < b.length; a++) {
                    var d = b[a];
                    this.entries.push({
                        id: a + 1,
                        medal: d.medal || 0,
                        time: d.time || 0,
                        points: d.points || 0
                    })
                }
            } else throw Error("No Round Progress found: " + this.cup);
            this.totalValue = 0;
            this.addEntries = true;
            this.currentIndex = -1;
            this.timer = 0.1
        },
        skip: function() {
            if (!this.done) {
                this.addEntries = false;
                if (this.currentIndex < 0) this.currentIndex = 0;
                for (var b = this.currentIndex; b < this.entries.length; b++) {
                    var a = this.entries[this.currentIndex];
                    if (sc.arena.isTrial(this.cup) && a.isRush) {
                        continue;
                    }
                    if (sc.arena.isRoundEncore(this.cup, a.id-1)) {
                        continue;
                    }
                    var d = new sc.ArenaCupOverview.MedalEntry(a.id, a.medal, true, a.isRush);
                    var c = sc.arena.isTrial(this.cup) ? ~~((a.id - 1) / 10) : ~~(a.id / 10);
                    d.setPos(1 + (sc.arena.isTrial(this.cup) ? a.id - 1 : a.id) % 10 * 18, 2 + c * 18);
                    this.medals.addChildGui(d);
                    this.totalValue = this.totalValue + a.points;
                    if (a.time) this.totalTime = this.totalTime + a.time;
                    this.currentIndex++;
                    this.medals.hook.size.y = 2 + (c + 1) * 18
                }
                this.total.setValueAsNumber(this.totalValue);
                this.list.recalculateScrollBars(true);
                this.list.setScrollY(this.medals.hook.size.y, false, 0.1, KEY_SPLINES.LINEAR);
                this.trophyHeader && this.trophyHeader.doStateTransition("DEFAULT");
                this.trophyFooter && this.trophyFooter.doStateTransition("DEFAULT");
                this.rushTime.setTime(sc.arena.getRoundTime(this.cup, -1));
                this.rushChain.setValueAsNumber(sc.arena.getCupProgress(this.cup).rush.chain);
                this.time.setTime(this.totalTime);
                this.totalOverlay.setMaxNumber(this.totalValue);
                this.totalOverlay.setNumber(this.totalValue, true);
                this.totalOverlay.doStateTransition("DEFAULT", false, false, () => this.totalOverlay.doStateTransition("HIDDEN"));
                this.scoreCountSound.play();
                this.effect &&
                    this.effect.show(this.trophyType, true);
                this.timer = 0;
                this.done = true
            }
        },
        onInteraction: function() {
            if (!(this.blockTimer > 0))
                if (this.state == 0) {
                    this.blockTimer = 0.2;
                    this.skip();
                    this.state = 1
                } else {
                    this.hide();
                    this.callback && this.callback()
                }
        }
    });
    sc.ArenaCupOverview.MedalEntry = ig.GuiElementBase.extend({
        transitions: {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        },
        gfx: new ig.Image("media/gui/arena-gui.png"),
        medal: 0,
        medalGui: null,
        overlay: null,
        rush: null,
        init: function(b, a, d, c) {
            this.parent();
            this.setSize(16, 16);
            this.medal = a || 0;
            this.medalGui = new ig.ImageGui(this.gfx, this.medal * 16, 0, 16, 16);
            this.medalGui.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.4,
                    timeFunction: KEY_SPLINES.EASE_OUT
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        scaleX: 1.5,
                        scaleY: 1.5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.medalGui.doStateTransition("HIDDEN", true);
            this.medalGui.doStateTransition("DEFAULT", d);
            this.addChildGui(this.medalGui);
            if (a > 0 && !d) {
                this.overlay = new ig.ImageGui(this.gfx,
                    this.medal * 16, 16, 16, 16);
                this.overlay.hook.transitions = {
                    DEFAULT: {
                        state: {
                            alpha: 1
                        },
                        time: 0.4,
                        timeFunction: KEY_SPLINES.EASE_OUT
                    },
                    HIDDEN: {
                        state: {
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5
                        },
                        time: 0.2,
                        timeFunction: KEY_SPLINES.LINEAR
                    },
                    HIDDEN_NO_SCALE: {
                        state: {
                            alpha: 0
                        },
                        time: 0.2,
                        timeFunction: KEY_SPLINES.LINEAR
                    }
                };
                this.overlay.doStateTransition("HIDDEN", true);
                this.overlay.doStateTransition("DEFAULT", false, false, () => this.overlay.doStateTransition("HIDDEN_NO_SCALE"));
                this.addChildGui(this.overlay)
            }
            if (c) {
                b = new sc.TextGui(ig.lang.get("sc.gui.arena.rushAbbreviated"), {
                    font: sc.fontsystem.tinyFont
                });
                b.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.CENTER);
                b.setPos(1, 1);
                this.rush = new ig.ColorGui("#000", b.hook.size.x + 1, b.hook.size.y - 1);
                this.rush.hook.localAlpha = 1;
                this.rush.setAlign(ig.GUI_ALIGN_X.LEFT, ig.GUI_ALIGN_Y.TOP);
                this.rush.addChildGui(b);
                this.medalGui.addChildGui(this.rush)
            }
        }
    });
});