ig.module("game.feature.arena.trial-round-page").requires("game.feature.menu.gui.arena.arena-round-page").defines(function(){
    sc.ArenaRoundInfoPage = ig.GuiElementBase.extend({
        gfx: new ig.Image("media/gui/menu.png"),
        numberGFX: new ig.Image("media/gui/basic.png"),
        transitions: {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    scaleY: 0
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        },
        highscore: null,
        time: null,
        coins: null,
        clearTimes: null,
        headerInfo: null,
        headerFeat: null,
        headerChallenges: null,
        medals: null,
        bonuses: null,
        challenges: null,
        firstClearBonuses: null,
        noneText: null,
        leftContent: null,
        rightContent: null,
        side: false,
        maxTime: null,
        wasTrial: false,
        menuGfx: new ig.Image("media/gui/menu.png"),
        init: function() {
            this.parent();
            this.setPivot(0, 213);
            this.setSize(269, 213);
            var b = 2;
            this.leftContent = new ig.GuiElementBase;
            this.leftContent.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0.5,
                        scaleX: 0
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.leftContent.setPivot(-4,
                0);
            this.leftContent.setSize(269, 213);
            this.leftContent.setPos(0, 0);
            this.addChildGui(this.leftContent);
            this.rightContent = new ig.GuiElementBase;
            this.rightContent.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0.5,
                        scaleX: 0
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.rightContent.setPivot(273, 0);
            this.rightContent.setSize(269, 213);
            this.rightContent.setPos(0, 0);
            this.rightContent.doStateTransition("HIDDEN", true);
            this.addChildGui(this.rightContent);
            this.highscore = this.createStatGui("highscore", "KeyValue", this.leftContent, b, {
                value: 1,
                maxValue: 999999999,
                asNumber: true,
                numberDots: true,
                transitionTime: 0.2
            });
            this.setAnnotation(this.highscore, "highscoreRound", 0, "dyn", 32);
            b = b + 18;
            this.medals = new sc.ArenaRoundInfoPage.Medals;
            this.medals.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
            this.medals.setPos(1, b);
            this.leftContent.addChildGui(this.medals);
            var a = new ig.ImageGui(this.gfx, 544, 224, 9, 12);
            a.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
            a.setPos(this.medals.hook.size.x +
                3, b);
            this.leftContent.addChildGui(a);
            b = b + this.medals.hook.size.y;
            this.time = this.createStatGui("timeRound", "Time", this.leftContent, b, {
                value: function() {
                    return 0
                },
                leading: 2,
                max: 99,
                millis: true,
                hideHours: true,
                transitionTime: 0.2
            });
            this.setAnnotation(this.time, "timeRound", 1, "dyn", 18, 0, -1);
            b = b + 17;
            this.maxTime = this.createStatGui("trialTimeLimit", "Time", this.leftContent, b, {
                value: function() {
                    return 0
                },
                leading: 2,
                max: 99,
                millis: true,
                hideHours: true,
                transitionTime: 0.2
            });
            this.setAnnotation(this.maxTime, "trialTimeLimit", 1, "dyn", 18, 0, -1);
            b = b + 17;
            if (!sc.menu.arenaCustomMode) {
                this.coins = new sc.ArenaKeyValue(ig.lang.get("sc.gui.arena.menu.coins"), 267);
                this.coins.setPos(1, b);
                this.setAnnotation(this.coins, "coinsRound", 2, 277, 16, -5, 1);
                this.leftContent.addChildGui(this.coins);
                b = b + 17
            }
            this.clearTimes = new sc.ArenaKeyValue(ig.lang.get("sc.gui.arena.menu.cleared"), 267);
            this.clearTimes.setPos(1, b);
            this.setAnnotation(this.clearTimes, "clears", 3, 277, 16, -5, 1);
            this.leftContent.addChildGui(this.clearTimes);
            b = b + 20;
            this.headerFeat = new sc.ArenaInfoLine(ig.lang.get("sc.gui.arena.menu.objective"));
            this.headerFeat.setPos(0, b);
            this.headerFeat.show(true);
            this.leftContent.addChildGui(this.headerFeat);
            b = b + (this.headerFeat.hook.size.y + 2);
            a = new ig.GuiElementBase;
            a.setSize(269, 38);
            a.setPos(0,
                b + 2);
            this.leftContent.addChildGui(a);
            this.setAnnotation(a, "objective", 4, 277, 83 + (sc.menu.arenaCustomMode ? 17 : 0), -4, -4);
            this.description = new sc.TextGui("", {
                font: sc.fontsystem.smallFont,
                maxWidth: 269,
                textAlign: ig.Font.ALIGN.CENTER,
                linePadding: 0
            });
            this.description.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
            this.description.setPos(0, 0);
            a.addChildGui(this.description);
            b = 2;
            this.headerFeat = new sc.ArenaInfoLine(ig.lang.get("sc.gui.arena.menu.bonuses"));
            this.headerFeat.setPos(0, b);
            this.headerFeat.show(true);
            this.bonusTotal = this.createStatGui("bonuses", "KeyValue", this.rightContent, b, {
                value: 1,
                maxValue: 999999999,
                asNumber: true,
                numberDots: true,
                transitionTime: 0.2
            });
            this.setAnnotation(this.bonusTotal, "bonus", 0, "dyn", 72);
            b = b + 14;
            this.bonuses = new ig.GuiElementBase;
            this.bonuses.setSize(269, 60);
            this.bonuses.setPos(0, b);
            this.rightContent.addChildGui(this.bonuses);
            b = b + this.bonuses.hook.size.y;
            this.headerChallenges = new sc.ArenaInfoLine(ig.lang.get("sc.gui.arena.menu.challenges"));
            this.headerChallenges.setPos(0, b);
            this.headerChallenges.show(true);
            this.rightContent.addChildGui(this.headerChallenges);
            b = b + (this.headerChallenges.hook.size.y + 2);
            this.challenges = new ig.GuiElementBase;
            this.challenges.setSize(269, 92);
            this.challenges.setPos(0, b);
            this.rightContent.addChildGui(this.challenges);
            this.setAnnotation(this.challenges, "challenges", 4, 277, 100, -4, -4);
            this.firstClearBonuses = new ig.GuiElementBase;
            this.firstClearBonuses.setPos(0, b);
            this.firstClearBonuses.setSize(269, 92);
            this.setAnnotation(this.firstClearBonuses, "firstClearBonuses", 4, 277, 100, -4, -4);
            this.noneText = new sc.TextGui(ig.lang.get("sc.gui.arena.menu.bonusNone"), {
                font: sc.fontsystem.smallFont,
                maxWidth: 269,
                textAlign: ig.Font.ALIGN.CENTER
            });
            this.noneText.setAlign(ig.GUI_ALIGN.X_CENTER,
                ig.GUI_ALIGN.Y_CENTER);
            b = new ig.ColorGui("#545454", 277, 22);
            b.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM);
            b.setPos(0, 2);
            this.addChildGui(b);
            this.rightButton = new sc.ButtonGui("\\i[page-right]", 32, true, sc.BUTTON_TYPE.SMALL);
            this.rightButton.onButtonPress = this.onRightButtonPressed.bind(this);
            this.rightButton.textChild.setPos(1, 0);
            this.rightButton.keepMouseFocus = true;
            this.rightButton.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.EASE
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: 5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.rightButton.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
            this.rightButton.setPos(-4, 2);
            this.addChildGui(this.rightButton);
            this.leftButton = new sc.ButtonGui("\\i[page-left]", 32, true, sc.BUTTON_TYPE.SMALL);
            this.leftButton.onButtonPress = this.onLeftButtonPressed.bind(this);
            this.leftButton.textChild.setPos(1, 0);
            this.leftButton.keepMouseFocus = true;
            this.leftButton.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.EASE
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: 5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.leftButton.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_BOTTOM);
            this.leftButton.setPos(-4, 2);
            this.addChildGui(this.leftButton);
            this.pagesNumberContainer = new ig.GuiElementBase;
            this.pagesNumberContainer.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM);
            this.pagesNumberContainer.setPos(0, 7);
            this.pagesNumberContainer.setSize(60, 8);
            this.pagesNumberContainer.hook.transitions = {
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
            };
            b = new ig.ImageGui(this.numberGFX, 96, 0, 8, 8);
            b.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
            this.pagesNumberContainer.addChildGui(b);
            this.currentPage = new sc.NumberGui(99);
            this.currentPage.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
            this.currentPage.setPos(36, 0);
            this.pagesNumberContainer.addChildGui(this.currentPage);
            b = new sc.NumberGui(2);
            b.setNumber(2, true);
            b.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP);
            b.setPos(36, 0);
            this.pagesNumberContainer.addChildGui(b);
            this.addChildGui(this.pagesNumberContainer);
            this.setData()
        },
        setData: function(b, a) {
            if (b) {
                if (this.wasTrial != sc.arena.isTrial(b)) {
                    if (sc.arena.isTrial(b)) {
                        this.rightContent.removeChildGui(this.challenges);
                        this.rightContent.addChildGui(this.firstClearBonuses);
                    } else {
                        this.rightContent.addChildGui(this.challenges);
                        this.rightContent.removeChildGui(this.firstClearBonuses);
                    }
                    this.wasTrial = sc.arena.isTrial(b);
                }
                this.highscore.setValueAsNumber(sc.arena.getRoundPoints(b,
                    a));
                this.medals.setValues(sc.arena.getRoundMedalRequirement(b, a, true), sc.arena.getRoundMedalRequirement(b, a), sc.arena.getRoundMedalRequirement(b, a, false, true));
                this.time.setTime(sc.arena.getRoundTime(b, a), true);
                this.coins && this.coins.setValue(sc.arena.getArenaCoinsObtainedInRound(b, a) + "\\i[slash]" + sc.arena.getAvailableArenaCoinsInRound(b, a));
                this.clearTimes.setValue(sc.arena.getRoundCompletionTotal(b, a) + "");
                this.bonuses.removeAllChildren();
                this.challenges.removeAllChildren();
                if (a != -1) {
                    var d = sc.arena.getCupRounds(b)[a],
                        c = d.objective ? ig.LangLabel.getText(d.objective) : ig.lang.get("sc.gui.arena.menu.objectiveDefault");
                    this.maxTime.setTime(d.maxTime || 0, true);
                    this.headerChallenges.textGui.setText(!sc.arena.isTrial(b) ? ig.lang.get("sc.gui.arena.menu.challenges") : sc.arena.hasFirstCleared(b, a)
                        ? ig.lang.get("sc.gui.arena.menu.firstClear") + " \\i[quest-mini-ok]"
                        : ig.lang.get("sc.gui.arena.menu.firstClear") + " \\i[quest-mini-no]");
                    d.description && (c = c + ("\\n" + ig.LangLabel.getText(d.description)));
                    this.description.setText(c);
                    this.setBonusPoints(d.bonuses);
                    this.setChallenges(sc.arena.getChallengeMods(b, a));
                    var x = d.firstClearBonus;
                    this.firstClearBonuses.removeAllChildren();
                    var h = 0;
                    if (x) {
                        for (var f = this.firstClearBonuses, g = this.menuGfx, i = h = 0; i < x.length; i++) {
                            if (!!x[i].condition) continue;
                            var j = x[i].count,
                                k = sc.inventory.getItem(x[i].item),
                                l = "\\i[" + (k.icon + sc.inventory.getRaritySuffix(k.rarity || 0) || "item-default") + "]",
                                l = l + ig.LangLabel.getText(k.name);
                            j > 1 && (l = l + (" x " + j));
                            j = 0;
                            k.type == sc.ITEMS_TYPES.EQUIP && (j = k.level || 0);
                            k = new sc.TextGui(l);
                            k.setPos(0, h);
                            k.level = j;
                            k.numberGfx = g;
                            j > 0 && !d && k.setDrawCallback((a, b) => {
                                sc.MenuHelper.drawLevel(this.level, a, b, this.numberGfx)
                            });
                            f.addChildGui(k);
                            h = h + 17
                        }
                    }
                } else {
                    this.firstClearBonuses.removeAllChildren();
                    this.setChallenges(sc.arena.getChallengeMods(b, -1));
                    this.bonusTotal.setValueAsNumber(0);
                    this.bonuses.addChildGui(this.noneText);
                    this.description.setText(ig.lang.get("sc.gui.arena.menu.objectiveRushMode"))
                }
            } else {
                if (this.wasTrial) {
                    this.rightContent.addChildGui(this.challenges);
                    this.rightContent.removeChildGui(this.firstClearBonuses);
                    this.wasTrial = false;
                }
                this.firstClearBonuses.removeAllChildren();
                this.bonusTotal.setValueAsNumber(0,
                    true);
                this.highscore.setValueAsNumber(0, true);
                this.medals.setValues(0, 0, 0, true);
                this.time.setTime(0, true);
                this.maxTime.setTime(0, true);
                this.description.setText("");
                this.bonuses.removeAllChildren();
                this.challenges.removeAllChildren();
                this.clearTimes.setValue("0");
                this.coins && this.coins.setValue("0\\i[slash]0")
            }
        },
        onRightButtonCheck: function() {
            return sc.control.rightPressed()
        },
        onLeftButtonCheck: function() {
            return sc.control.leftPressed()
        },
        onRightButtonPressed: function() {
            this.togglePage()
        },
        onLeftButtonPressed: function() {
            this.togglePage()
        },
        show: function() {
            sc.menu.buttonInteract.removeGlobalButton(this.rightButton);
            sc.menu.buttonInteract.removeGlobalButton(this.leftButton);
            this.side = true;
            this.togglePage(true);
            this.doStateTransition("DEFAULT")
        },
        hide: function(b) {
            sc.menu.buttonInteract.removeGlobalButton(this.rightButton);
            sc.menu.buttonInteract.removeGlobalButton(this.leftButton);
            this.doStateTransition("HIDDEN", b)
        },
        togglePage: function(b) {
            ig.interact.setBlockDelay(0.2);
            if (this.side = !this.side) {
                this.leftContent.doStateTransition("HIDDEN", b);
                this.rightContent.doStateTransition("DEFAULT", b);
                this.rightButton.doStateTransition("HIDDEN", true);
                this.leftButton.doStateTransition("DEFAULT", true);
                sc.menu.buttonInteract.removeGlobalButton(this.rightButton);
                sc.menu.buttonInteract.addGlobalButton(this.leftButton, this.onLeftButtonCheck.bind(this),
                    true);
                this.currentPage.setNumber(2)
            } else {
                this.leftContent.doStateTransition("DEFAULT", b);
                this.rightContent.doStateTransition("HIDDEN", b);
                this.rightButton.doStateTransition("DEFAULT", true);
                this.leftButton.doStateTransition("HIDDEN", true);
                sc.menu.buttonInteract.removeGlobalButton(this.leftButton);
                sc.menu.buttonInteract.addGlobalButton(this.rightButton, this.onRightButtonCheck.bind(this), true);
                this.currentPage.setNumber(1)
            }
        },
        setChallenges: function(b) {
            if (b) {
                var a = 0,
                    d = 0,
                    c = Object.keys(b).length >= 6,
                    e;
                for (e in b) {
                    var f = new sc.ArenaChallengeEntry(e, 269, c, b[e].global);
                    f.setPos(0, a);
                    this.challenges.addChildGui(f);
                    a = a + (f.hook.size.y - 3);
                    d++
                }
            }
        },
        setBonusPoints: function(b) {
            var a =
                0,
                b = ig.copy(b);
            b.sort((a, b) => {
                return (sc.ARENA_BONUS_OBJECTIVE[a.type] || 0).order - (sc.ARENA_BONUS_OBJECTIVE[b.type] || 0).order
            });
            if (b)
                for (var d = Math.min(b.length, sc.ARENA_MAX_BONUS_OBJECTIVES), c = 0; c < d; c++) {
                    b.length <= 4 ? this.createBonusEntry("\\i[insetArrow]" + this.getBonusText(b[c]), c * 14, this.getBonusPointsText(b[c])) : this.createBonusEntry("\\i[insetArrow]" + this.getBonusText(b[c]), 5 + c * 9, this.getBonusPointsText(b[c]), true);
                    a = a + b[c].points
                }
            this.bonusTotal.setValueAsNumber(a)
        },
        getBonusText: function(b) {
            return sc.ARENA_BONUS_OBJECTIVE[b.type] ?
                sc.ARENA_BONUS_OBJECTIVE[b.type].getText(ig.lang.get("sc.gui.arena.bonuses." + b.type), b) : "INVALID TYPE: " + b.type
        },
        getBonusPointsText: function(b) {
            var a = sc.ARENA_BONUS_OBJECTIVE[b.type];
            return a ? (a.getPointsRange ? a.getPointsRange(b, b.points) : b.points || 0) + "" : "INVALID_TYPE: " + b.type
        },
        createBonusEntry: function(b, a, d, c) {
            var e = null;
            if (c) {
                e = new sc.TrophyTabOverview.Entry(b, d, 267);
                e.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP)
            } else {
                e = new sc.ArenaKeyValue(b, 267);
                e.setValue(d || "")
            }
            e.setPos(1, a);
            this.bonuses.addChildGui(e)
        },
        createStatGui: function(b, a, d, c, e) {
            a = new sc.STATS_ENTRY_TYPE[a](b, e, e.width || 277);
            a.keyGui.setText(ig.lang.get("sc.gui.arena.menu." + b));
            a.setPos(-4, c);
            d && d.addChildGui(a);
            return a
        },
        setAnnotation: function(b, a, d, c, e, f, g) {
            b.annotation = {
                content: {
                    title: "sc.gui.menu.help.arena.titles." + a,
                    description: "sc.gui.menu.help.arena.description." + a
                },
                offset: {
                    x: f || 0,
                    y: g || 0
                },
                size: {
                    x: c || "dyn",
                    y: e || "dyn"
                },
                index: {
                    x: 0,
                    y: d + 1
                }
            }
        }
    });
    sc.ArenaRoundInfoPage.Medals = ig.GuiElementBase.extend({
        gfx: new ig.Image("media/gui/arena-gui.png"),
        silver: null,
        gold: null,
        platin: null,
        platUnlocked: false,
        init: function() {
            this.parent();
            this.silver = new sc.NumberGui(99999999, {
                size: sc.NUMBER_SIZE.NORMAL,
                transitionTime: 0.2,
                leadingZeros: 8,
                zeroAsGrey: true
            });
            this.silver.setPos(18, 4);
            this.silver.setNumber(0, true);
            this.addChildGui(this.silver);
            this.gold = new sc.NumberGui(99999999, {
                size: sc.NUMBER_SIZE.NORMAL,
                transitionTime: 0.2,
                leadingZeros: 8,
                zeroAsGrey: true
            });
            this.gold.setPos(18 + this.silver.hook.size.x + 5 + 18, 4);
            this.gold.setNumber(0, true);
            this.addChildGui(this.gold);
            if (this.platUnlocked = sc.stats.getMap("arena", "medals-got-4") > 0) {
                this.platin = new sc.NumberGui(99999999, {
                    size: sc.NUMBER_SIZE.NORMAL,
                    transitionTime: 0.2,
                    leadingZeros: 8,
                    zeroAsGrey: true
                });
                this.platin.setPos(18 + this.silver.hook.size.x + this.gold.hook.size.x + 10 + 36, 4);
                this.platin.setNumber(0, true);
                this.addChildGui(this.platin);
                this.setSize(64 + this.silver.hook.size.x + this.gold.hook.size.x + this.platin.hook.size.x, 16)
            } else this.setSize(41 + this.silver.hook.size.x + this.gold.hook.size.x, 16)
        },
        updateDrawables: function(b) {
            b.addGfx(this.gfx,
                0, 0, 32, 0, 16, 16);
            b.addGfx(this.gfx, this.silver.hook.size.x + 5 + 18, 0, 48, 0, 16, 16);
            this.platUnlocked && b.addGfx(this.gfx, this.silver.hook.size.x + this.gold.hook.size.x + 10 + 36, 0, 64, 0, 16, 16)
        },
        setValues: function(b, a, d, c) {
            this.silver.setNumber(b, c);
            this.gold.setNumber(a, c);
            this.platUnlocked && this.platin.setNumber(d, c)
        }
    });
});