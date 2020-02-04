ig.module("game.feature.arena.trial").requires("game.feature.arena.arena", "game.feature.arena.gui.arena-gui", "game.feature.menu.gui.arena.arena-list", "game.feature.menu.gui.arena.arena-round-page").defines(function() {
    var f = {
        value: 0
    };
	sc.ArenaPlus = sc.Arena.extend({
		init: function() {
			this.parent();
			sc.Model.addObserver(sc.timers, this);
		},
		startRound: function() {
			var a = this.runtime,
                b = this.getCurrentRound();
            a.scoreStats = {};
            this.addGui();
			if (isTrial()) {
				var maxTime = sc.arena.getCupData(sc.arena.runtime.cup).rounds[sc.arena.runtime.currentRound].maxTime;
				sc.timers.addTimer("trialTimer", sc.TIMER_TYPES.COUNTDOWN, maxTime, null, null,
	                true, true, null, ig.lang.get("sc.gui.arena.timeRemaining"), true);
	            sc.timers.timers.arenaTimer ? sc.timers.resumeTimer("arenaTimer") : sc.timers.addTimer("arenaTimer", sc.TIMER_TYPES.COUNTER, null, null, null, false, true);
			} else {
	            sc.timers.timers.arenaTimer ? sc.timers.resumeTimer("arenaTimer") : sc.timers.addTimer("arenaTimer", sc.TIMER_TYPES.COUNTER, null, null, null,
	                true, true, null, ig.lang.get("sc.gui.arena.time"), true);
			}
            ig.game.playerEntity.manualKill = "tmp.playerDeathArena";
            sc.timers.addTimer("arenaTimerReal", sc.TIMER_TYPES.COUNTER, null, null, null, false, true);
            a.customRound = b.customCode || false;
            a.roundKills = 0;
            a.score = 0;
            a.roundFinished = false;
            a.roundStarted = true;
            a.chainHits = sc.ARENA_MAX_CHAIN_HITS;
            a.prevScoreType = null;
            a.killTimer = 0;
            a.chain = 0;
            a.chainGui.setChainNumber(0, true);
            a.prevMedal = this.getCupMedal(a.cup, a.currentRound);
            if (!a.rush || a.rush && a.currentRound == 0) {
                f.value =
                    1;
                ig.game.playerEntity.heal(f, true);
                sc.model.player.setElementMode(0, true, true);
                sc.party.reviveAllPartyMembers()
            } else {
                f.value = 0.5;
                ig.game.playerEntity.heal(f, false)
            }
            sc.model.player.params.resetSp();
            this.addBonusObjectives();
            for (var c in a.challengeMods) {
                ig.debug("CHALLENGE ON: " + c);
                sc.ARENA_CHALLENGES[c].toggle(true)
            }
            sc.model.setTask(this.getCurrentObjective(), false, 0);
            if (!b.customCode) {
                a.rush && a.currentRound == 0 ? ig.bgm.play(a.bgmTrack || a.defaultBgmTrack, 1, "IMMEDIATELY") : a.rush || ig.bgm.play(a.bgmTrack ||
                    a.defaultBgmTrack, 1, "IMMEDIATELY");
                a = ig.game.entities;
                for (b = a.length; b--;) {
                    c = a[b];
                    c instanceof ig.ENTITY.Enemy && c.setTarget(ig.game.playerEntity, true)
                }
            }
		},
		endRoundDeath: function() {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
			}
			this.parent();
		},
		endRound: function() {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
			}
			this.parent();
		},
		startNextRound: function(a) {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
			}
            this.parent();
        },
        restartCup: function(a) {
        	if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
			}
            this.parent();
        },
        prepareLobbyReturn: function(a) {
        	if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
			}
            this.parent();
        },
        exitArenaMode: function() {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
			}
			this.parent();
		},
		modelChanged: function(b, a) {
			if (b == sc.timers && a == sc.TIMER_EVENT.COUNTDOWN_DONE && !!sc.timers.timers.trialTimer && sc.timers.timers.trialTimer.done() && isTrial()) {
                this._pauseBlock = true;
                this._endRoundDone = false;
                ig.bgm.pause("IMMEDIATELY");
                sc.timers.stopTimer("trialTimer");
				sc.commonEvents.startCallEvent("arena-player-death-pre");
				ig.vars.set("tmp.playerDeathArena", true);
			}
        },
        initMetaData: function(a) {
            if (this.cups[a]) {
                this.cups[a].name = this.getCupCoreAttrib(a, "name");
                this.cups[a].condition = this.getCupCoreAttrib(a, "condition") || null;
                this.cups[a].isTrial = this.getCupCoreAttrib(a, "isTrial") || false;
                var b = this.getCupCoreAttrib(a,
                    "type");
                if (this.cups[a].extension) {
                    b == "SOLO_CUP" && (this.getCupCore(a).type = "SOLO_CUSTOM");
                    b == "TEAM_CUP" && (this.getCupCore(a).type = "TEAM_CUSTOM")
                }
                b = this.getCupCoreAttrib(a, "type");
                if (b == "SOLO_CUSTOM" || b == "TEAM_CUSTOM") this._hasCustomCups = true;
                if (this.cups[a].progress) {
                    b = this.getCupRounds(a);
                    a = this.cups[a].progress.rounds;
                    if (b.length != a.length)
                        if (b.length > a.length)
                            for (var c = a.length; c < b.length; c++) a.push({
                                medal: 0,
                                points: 0,
                                time: 0,
                                cleared: 0
                            });
                        else a.length = b.length
                } else this.setEmptyProgress(a)
            } else throw Error("Cup not found: " +
                a);
        }
	});
	ig.addGameAddon(function() {
        return sc.arena = new sc.ArenaPlus;
    });
	var isTrial = function(a) {
		a = a ? a : sc.arena.runtime.cup;
		return sc.arena.cups[a].isTrial;
	};
	sc.ArenaPlayerDeathOverlay.inject({
		show: function() {
			if (isTrial()) {
				this.header.show(function() {
	                this.buttons.show()
	            }.bind(this), ig.lang.get("sc.gui.arena.trialFail"));
			} else {
	            this.header.show(function() {
	                this.buttons.show()
	            }.bind(this), ig.lang.get("sc.gui.arena.roundFail"));
			}
            this.doStateTransition("DEFAULT", true)
        }
	});
	sc.ArenaRoundEndOverlay.inject({
		init: function() {
            this.parent();
            this.setSize(ig.system.width, ig.system.height);
            this.hook.zIndex = 102;
            this.interact = new sc.ScreenInteractEntry(this, false);
            this.header = new sc.ArenaRoundEndHeader;
            this.addChildGui(this.header);
            this.rushChain = new sc.ArenaChainHud(true);
            this.addChildGui(this.rushChain);
            this.summary = new sc.ArenaSummary(function() {
                if (this.state == 0) {
                    this.state = 1;
                    this.waitTimer = 0.4;
                    this.checkNewRecord()
                }
            }.bind(this));
            if (!sc.arena.isCupCustom(sc.arena.runtime.cup)) {
                this.coins = new sc.ArenaCoinsHud;
                this.addChildGui(this.coins)
            }
            this.medal = new sc.ArenaMedalHud(function() {
                if (this.state == 1) {
                    this.state = 2;
                    this.waitTimer = 0.2;
                    this.saveScore();
                    this.coins && this.coins.show()
                }
            }.bind(this));
            this.addChildGui(this.medal);
            this.info = new sc.InfoBar(null, null, true);
            this.info.setAlign(ig.GUI_ALIGN_X.LEFT,
                ig.GUI_ALIGN_Y.BOTTOM);
            this.info.setPos(0, 1);
            this.info.doStateTransition("DEFAULT");
            this.addChildGui(this.info);
            this.buttons = isTrial() ?
	            new sc.ArenaRoundEndButtons(function(a, b) {
                    if (a)
                        if (b == 0) {
                            sc.arena.restartCup();
                            this.hide();
                            sc.commonEvents.startCallEvent("arena-teleport")
                        } else {
                            if (b == 1) {
                                sc.arena.prepareLobbyReturn();
                                this.hide();
                                sc.commonEvents.startCallEvent("arena-end-cup")
                            }
                        } else if (b == 0) {
	                        sc.arena.startNextRound(false);
	                        this.hide();
	                        sc.commonEvents.startCallEvent("arena-teleport")
	                    } else if (b == 1) {
	                        this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, function() {
	                            this.overview = null
	                        }.bind(this), true);
	                        ig.gui.addGuiElement(this.overview);
	                        this.overview.show()
	                    } else if (b == 2) {
	                        sc.arena.prepareLobbyReturn();
	                        this.hide();
	                        sc.commonEvents.startCallEvent("arena-end-cup")
	                    }
                }.bind(this), this.info, true)
	        :   new sc.ArenaRoundEndButtons(function(a, b, c) {
	                if (a)
	                    if (c)
	                        if (b == 0) {
	                            ig.bgm.pause("FAST_OUT");
	                            sc.arena.restartCup();
	                            this.hide();
	                            sc.commonEvents.startCallEvent("arena-teleport")
	                        } else if (b == 1) {
	                    this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, function() {
	                        this.overview = null
	                    }.bind(this), true);
	                    ig.gui.addGuiElement(this.overview);
	                    this.overview.show()
	                } else {
	                    if (b == 2) {
	                        sc.arena.prepareLobbyReturn();
	                        this.hide();
	                        sc.commonEvents.startCallEvent("arena-end-cup")
	                    }
	                } else if (b == 0) {
	                    sc.arena.startNextRound(b == 0);
	                    this.hide();
	                    sc.commonEvents.startCallEvent("arena-teleport")
	                } else if (b == 1) {
	                    ig.bgm.pause("FAST_OUT");
	                    sc.arena.restartCup();
	                    this.hide();
	                    sc.commonEvents.startCallEvent("arena-teleport")
	                } else {
	                    if (b == 2) {
	                        sc.arena.prepareLobbyReturn();
	                        this.hide();
	                        sc.commonEvents.startCallEvent("arena-end-cup")
	                    }
	                } else if (b <= 1) {
	                    sc.arena.startNextRound(b == 0);
	                    this.hide();
	                    sc.commonEvents.startCallEvent("arena-teleport")
	                } else if (b ==
	                    2) {
	                    this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, function() {
	                        this.overview = null
	                    }.bind(this), true);
	                    ig.gui.addGuiElement(this.overview);
	                    this.overview.show()
	                } else if (b == 3) {
	                    sc.arena.prepareLobbyReturn();
	                    this.hide();
	                    sc.commonEvents.startCallEvent("arena-end-cup")
	                }
	            }.bind(this), this.info);
            this.addChildGui(this.buttons);
            this.doStateTransition("HIDDEN", true)
        },
		show: function() {
			this.initTimer = 0.8;
            ig.interact.addEntry(this.interact);
            sc.gui.rightHudPanel.addHudBoxBefore(this.summary, sc.gui.moneyHud);
            if (isTrial()) {
				this.header.show(function() {
	                this.summary.show()
	            }.bind(this), ig.lang.get("sc.gui.arena.trialClear"));
			} else {
				this.header.show(function() {
	                this.summary.show()
	            }.bind(this));
			}
            var a = sc.arena.runtime;
            if (a.rush && a.chain > 1) {
                a.chainGui.doPosTranstition(0, 40, 0.2, KEY_SPLINES.EASE);
                this.rushChain.show();
                this.rushChain.animateChainNumber(0, a.rushChain, 0.4)
            }
            this.doStateTransition("DEFAULT", true)
        }
	});
	sc.ArenaRoundList.inject({
		onCreateListEntries: function(a, b) {
			console.log('onCreateListEntries');
            var c = sc.arena.getCupRounds(this.currentCup);
            a.clear();
            b.clear();
            if (!isTrial(this.currentCup)) {
			    var e = "\\i[arena-bolt-left]\\c[0]" + ig.lang.get("sc.gui.arena.menu.rush") + "\\c[0]\\i[arena-bolt-right]",
	                e = new sc.ArenaRoundEntryButton(e, this.currentCup, -1, sc.arena.getCupMedal(this.currentCup, -1), c.length);
	            a.addButton(e);	
			}
            for (var f = 0; f <
                c.length; f++) {
                e = ig.LangLabel.getText(c[f].name);
                e = new sc.ArenaRoundEntryButton(e, this.currentCup, f, sc.arena.getCupMedal(this.currentCup, f), c.length);
                e.setActive(isTrial(this.currentCup) || ig.perf.enableArenaRound || this.isRoundActive(this.currentCup, f));
                a.addButton(e)
            }
        }
	});
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
        noneText: null,
        leftContent: null,
        rightContent: null,
        side: false,
        maxTime: null,
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
        	console.log(b, a);
            if (b) {
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
                    d.description && (c = c + ("\\n" + ig.LangLabel.getText(d.description)));
                    this.description.setText(c);
                    this.setBonusPoints(d.bonuses);
                    this.setChallenges(sc.arena.getChallengeMods(b, a))
                } else {
                    this.setChallenges(sc.arena.getChallengeMods(b, -1));
                    this.bonusTotal.setValueAsNumber(0);
                    this.bonuses.addChildGui(this.noneText);
                    this.description.setText(ig.lang.get("sc.gui.arena.menu.objectiveRushMode"))
                }
            } else {
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
            b.sort(function(a, b) {
                return (sc.ARENA_BONUS_OBJECTIVE[a.type] || 0).order - (sc.ARENA_BONUS_OBJECTIVE[b.type] || 0).order
            }.bind(this));
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
	var moddedCups = {
	    "master-trial-cup": {
	      order: 100000
	    }
	};
	sc.ArenaPlus.inject({
		loadModdedCups: false,
	    registerCup: function(a, b) {
	      this.cups[a] ? ig.warn("Cup with id '" + a + "' already exists.") : this.cups[a] = {
	        path: b.path || a,
	        order: b.order != void 0 ? b.order : 9999999,
	        data: null,
	        progress: null
	      }
	      // a bit hacky, but minimizes the amount of stuff needed to inject
	      if (!this.loadModdedCups) {
	      	this.loadModdedCups = true;
	      	for (var c in moddedCups) this.registerCup(c, moddedCups[c]);
	      }
	    },
	    isRoundActive: function(a, b) {
	    	if (!sc.arena.getProgress(a) === undefined) {
	    		this.registerCup(a, moddedCups[a]);
	    	}
	      return b <= 0 || sc.arena.getCupProgress(a).rounds[b].cleared >= 1 ? true : sc.arena
	        .getCupProgress(a).rounds[b - 1].cleared >= 1
	    }
	});
});