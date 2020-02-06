ig.module("game.feature.arena.trial").requires(
	"game.feature.arena.arena",
	"game.feature.arena.gui.arena-gui",
	"game.feature.menu.gui.arena.arena-list",
	"game.feature.menu.gui.arena.arena-misc",
	"game.feature.menu.gui.arena.arena-round-page",
	"game.feature.arena.gui.arena-trophy-gui",
	"game.feature.arena.gui.arena-start-gui",
	"game.feature.arena.arena-steps",
	"game.feature.new-game.new-game-model").defines(function() {
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
				const maxTime = sc.arena.getCupData(sc.arena.runtime.cup).rounds[sc.arena.runtime.currentRound].maxTime;
				sc.timers.addTimer("trialTimer", sc.TIMER_TYPES.COUNTDOWN, maxTime, null, null,
	                true, true, null, ig.lang.get("sc.gui.arena.timeRemaining"), true);
				if (maxTime >= 60) {
					sc.timers.timers.trialTimerSixty && sc.timers.removeTimer("trialTimerSixty");
					sc.timers.addTimer("trialTimerSixty", sc.TIMER_TYPES.COUNTDOWN, maxTime - 60, null, null, false, true);
				}
				if (maxTime >= 30) {
					sc.timers.timers.trialTimerThirty && sc.timers.removeTimer("trialTimerThirty");
					sc.timers.addTimer("trialTimerThirty", sc.TIMER_TYPES.COUNTDOWN, maxTime - 30, null, null, false, true);
				}
				if (maxTime >= 10) {
					sc.timers.timers.trialTimerTen && sc.timers.removeTimer("trialTimerTen");
					sc.timers.addTimer("trialTimerTen", sc.TIMER_TYPES.COUNTDOWN, maxTime - 10, null, null, false, true);
				}
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
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
			this.parent();
		},
		endRound: function() {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
			this.parent();
		},
		startNextRound: function(a) {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
            this.parent(a);
        },
        restartCup: function(a) {
        	if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
            this.parent(a);
        },
        prepareLobbyReturn: function(a) {
        	if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
            this.parent(a);
        },
        exitArenaMode: function() {
			if (isTrial()) {
				sc.timers.stopTimer("trialTimer");
				sc.timers.removeTimer("trialTimer");
				sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
				sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
				sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
			}
			this.parent();
		},
		modelChanged: function(b, a) {
			if (b == sc.timers && a == sc.TIMER_EVENT.COUNTDOWN_DONE && isTrial()) {
				if (!!sc.timers.timers.trialTimerSixty && sc.timers.timers.trialTimerSixty.done()) {
					sc.timers.removeTimer("trialTimerSixty");
					sc.commonEvents.startCallEvent("trial-timer-sixty");	
				} else if (!!sc.timers.timers.trialTimerThirty && sc.timers.timers.trialTimerThirty.done()) {
					sc.timers.removeTimer("trialTimerThirty");
					sc.commonEvents.startCallEvent("trial-timer-thirty");
				} else if (!!sc.timers.timers.trialTimerTen && sc.timers.timers.trialTimerTen.done()) {
					sc.timers.removeTimer("trialTimerTen");
					sc.commonEvents.startCallEvent("trial-timer-ten");
				} else if (!!sc.timers.timers.trialTimer && sc.timers.timers.trialTimer.done()) {
	                this._pauseBlock = true;
	                this._endRoundDone = false;
	                ig.bgm.pause("IMMEDIATELY");
	                sc.timers.stopTimer("trialTimer");
					sc.commonEvents.startCallEvent("trial-timeout");
					ig.vars.set("tmp.playerDeathArena", true);
				}
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
                                cleared: 0,
                                firstClearBonus: 0
                            });
                        else a.length = b.length
                } else this.setEmptyProgress(a)
            } else throw Error("Cup not found: " +
                a);
        },
        setEmptyProgress: function(a) {
            var b = this.getCupRounds(a);
            if (!b) this.cups[a].progress = null;
            for (var c = {
                    rush: {
                        medal: 0,
                        points: 0,
                        time: 0,
                        cleared: 0,
                        chain: 0
                    },
                    rounds: []
                }, d = 0; d < b.length; d++) c.rounds.push({
                medal: 0,
                points: 0,
                time: 0,
                cleared: 0,
                firstClearBonus: 0
            });
            this.cups[a].progress = c
        },
        saveScore: function(a, b) {
            a < 0 && (a = 0);
            var c = this.runtime,
                d = b ? this.cups[c.cup].progress.rush : this.cups[c.cup].progress.rounds[c.currentRound];
            c.score = a;
            var e = b ? c.preTrophy : this.getCupTrophy(c.cup);
            c.prevMedal = d.medal;
            var g = this.getCupRounds(c.cup)[c.currentRound].firstClearBonus,
            		h = 0;
            if (g) {
            	if (isTrial() && !d.firstClearBonus) {
            		d.firstClearBonus = 1;
	            	for (h = 0; h < g.length; h++) {
	            		if (!g[h].condition) {
	            			sc.model.player.addItem(g[h].item, g[h].count);
	            		}
	            	}
            	}
            	for (h = 0; h < g.length; h++) {
            		if (g[h].condition && (new ig.VarCondition(g[h].condition)).evaluate()) {
            			sc.model.player.addItem(g[h].item, g[h].count);
            		}
            	}
        	}
            d.cleared++;
            d.points = Math.max(d.points, a);
            d.medal = this.getMedalForCurrentRound(d.points, b);
            d.time = c.timer <= 0 ? 0 : d.time <= 0 ? c.timer : Math.min(c.timer, d.time);
            sc.stats.addMap("arena", "score", a);
            if (d.medal > 0) {
                sc.stats.addMap("arena", "totalMedals", 1);
                sc.stats.addMap("arena", "medals-got-" + d.medal, 1)
            }
            if (c.rush && !b) {
                var f = c.rushScores[c.currentRound];
                f.points = Math.max(a, 0);
                f.medal = this.getMedalForCurrentRound(f.points, b);
                f.time = Math.max(c.timer, 0)
            }
            if (b) {
                d.chain = Math.max(d.chain, c.rushChainMax);
                sc.stats.addMap("arena", "rushCleared", 1)
            } else sc.stats.addMap("arena", "roundsCleared", 1);
            return this.getCupTrophy(c.cup) > e
        },
        getCupCompletion: function(a) {
            if ((a = this.cups[a]) && a.progress) {
                var b = a.progress;
                var d = !isTrial(a);
                var a = d ? 1 : 0;
                    c = d && b.rush.medal >= sc.ARENA_MEDALS_TROPHIES.GOLD ?
                    1 : 0;
                if (b) {
                    for (var b = b.rounds, d = b.length; d--;) {
                        b[d].medal >= sc.ARENA_MEDALS_TROPHIES.GOLD && c++;
                        a++
                    }
                    if (c == a && a == 0) {
                    	return 0;
                    }
                    return c / a
                }
            }
            return 0
        },
        getCupTrophy: function(a) {
            if (this.cups[a]) {
            	var f = a;
                if (!this.hasMedalsForTrophy(a)) return 0;
                for (var a = this.cups[a].progress, b = 0, c = a.rounds.length; c--;) b = b + a.rounds[c].medal;
                b = b / a.rounds.length;
                c = ~~b;
                b = b > c ? b - c >= sc.ARENA_TROPHY_QUOTA ? Math.round(b) : c : c;
                if (b >= 4 && (isTrial(f) || a.rush.medal == 4)) {
                    sc.stats.setMap("arena", "unlockedTruePlatin", 1);
                    return 5
                }
                return c
            }
            return -1
        },
        isFirstClear: function(b, c) {
            b = b || this.runtime.cup;
            c = c === 0 || !!c ? c : this.runtime.currentRound;
            return !this.cups[b] || !this.cups[b].progress ? false : !this.cups[b].progress.rounds[c].firstClearBonus;
        },
        hasFirstCleared: function(b, c) {
            b = b || this.runtime.cup;
            c = c === 0 || !!c ? c : this.runtime.currentRound;
            return !this.cups[b] || !this.cups[b].progress ? false : this.cups[b].progress.rounds[c].firstClearBonus == 1;
        },
        hasSatisfiedCondition: function(b, c) {
            b = b || this.runtime.cup;
            c = c === 0 || !!c ? c : this.runtime.currentRound;
            if (c === -1) {
            	return false;
            }
            var g = this.getCupRounds(b)[c].firstClearBonus,
            	h = 0;
            if (!!g) {
	            for (h = 0; h < g.length; h++) {
	        		if (g[h].condition && (new ig.VarCondition(g[h].condition)).evaluate()) {
	        			return true;
	        		}
	        	}
            }
        	return false;
        },
        onStorageSave: function(a) {
            var b = {
                    cupData: {}
                },
                c;
            for (c in this.cups)
                if (this.cups[c] && this.cups[c].progress) {
                    for (var d = this.cups[c].progress, e = {
                            rush: {
                                medal: d.rush.medal,
                                points: d.rush.points,
                                time: d.rush.time,
                                cleared: d.rush.cleared,
                                chain: d.rush.chain
                            },
                            rounds: []
                        }, f = 0; f < d.rounds.length; f++) e.rounds.push({
                        medal: d.rounds[f].medal,
                        points: d.rounds[f].points,
                        time: d.rounds[f].time,
                        cleared: d.rounds[f].cleared,
                        firstClearBonus: d.rounds[f].firstClearBonus
                    });
                    b.cupData[c] = e;
                    b.cupData[c].name = ig.copy(this.cups[c].name);
                    b.cupData[c].condition = ig.copy(this.cups[c].condition)
                } else b.cupData[c] = {};
            b.coins = this.coins || 0;
            b.coinsSpend = this.coinsSpend || 0;
            a.arena = b
        },
        onStoragePreLoad: function(a) {
            this.clearProgress();
            if (a.arena) {
                var b = a.arena.cupData,
                    c;
                for (c in b)
                    if (this.cups[c]) {
                        var d = b[c];
                        if (d && d.rush && d.rounds) {
                            for (var e = {
                                    rush: {
                                        medal: d.rush.medal || 0,
                                        points: d.rush.points || 0,
                                        time: d.rush.time || 0,
                                        cleared: d.rush.cleared || 0,
                                        chain: d.rush.chain || 0
                                    },
                                    rounds: []
                                }, f = 0; f < d.rounds.length; f++) e.rounds.push({
                                medal: d.rounds[f].medal || 0,
                                points: d.rounds[f].points || 0,
                                time: d.rounds[f].time || 0,
                                cleared: d.rounds[f].cleared || 0,
                                firstClearBonus: d.rounds[f].firstClearBonus || 0
                            });
                            this.cups[c].progress = e;
                            this.cups[c].name = d.name || null;
                            this.cups[c].condition = d.condition || null
                        }
                    }
                this.coins = a.arena.coins || 0;
                this.coinsSpend = a.arena.coinsSpend || 0
            }
        }
	});
	ig.addGameAddon(function() {
        return sc.arena = new sc.ArenaPlus;
    });
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
            this.content.setSize(280, isTrial(this.cup) ? 126 : 166);
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
            if (!isTrial(this.cup)) {
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
            if (!isTrial(this.cup)) {
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
                    if (this.currentIndex > 0 && (!isTrial(this.cup) || !this.entries[this.currentIndex].isRush)) {
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
                            if (isTrial(this.cup) && b.isRush) {
                            	this.currentIndex++;
                            	return;
                            }
                            var a = new sc.ArenaCupOverview.MedalEntry(b.id, b.medal, false, b.isRush);
                            var d = isTrial(this.cup) ? ~~((b.id-1) / 10) : ~~(b.id / 10);
                            a.setPos(1 + (isTrial(this.cup) ? b.id-1 : b.id) % 10 * 18, 2 + d * 18);
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
                            if (this.currentIndex >= this.entries.length) {
                                this.addEntries = false;
                                this.done = true;
                                this.timer = 0.2;
                                this.trophyHeader && this.trophyHeader.doStateTransition("DEFAULT");
                                this.trophyFooter &&
                                    this.trophyFooter.doStateTransition("DEFAULT", false, false, null, 0.4)
                            }
                        } else this.timer = this.timer - ig.system.tick
                } else if (this.done && this.timer > 0) {
                    this.timer = this.timer - ig.system.tick;
                    if (this.scoreDotPitch < 1.5) this.scoreDotPitch = this.scoreDotPitch + 0.6 * ig.system.tick;
                    this.scoreDotSound.play(false, {
                        speed: this.scoreDotPitch
                    });
                    if (this.timer <= 0) {
                        this.totalOverlay.setMaxNumber(this.totalValue);
                        this.totalOverlay.setNumber(this.totalValue, true);
                        this.totalOverlay.doStateTransition("DEFAULT", false, false, function() {
                            this.totalOverlay.doStateTransition("HIDDEN")
                        }.bind(this));
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
            this.effect && this.effect.hide(true);
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
                    if (isTrial(this.cup) && a.isRush) {
                    	continue;
                    }
                    var d = new sc.ArenaCupOverview.MedalEntry(a.id, a.medal, true, a.isRush);
                    var c = isTrial(this.cup) ? ~~((a.id-1) / 10) : ~~(a.id / 10);
                    d.setPos(1 + (isTrial(this.cup) ? a.id-1 : a.id) % 10 * 18, 2 + c * 18);
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
                this.totalOverlay.doStateTransition("DEFAULT", false, false, function() {
                    this.totalOverlay.doStateTransition("HIDDEN")
                }.bind(this));
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
                this.overlay.doStateTransition("DEFAULT", false, false, function() {
                    this.overlay.doStateTransition("HIDDEN_NO_SCALE")
                }.bind(this));
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
    sc.ArenaRoundEntryButton = sc.ArenaEntryButton.extend({
        round: null,
        dots: null,
        index: -2,
        init: function(a, b, c, e, f, g, h) {
            this.parent(a, b, g, e);
            this.decoration.offsetY = 0;
            this.index = c;
            if (!h && c >= 0) {
                this.round = new sc.NumberGui(f || 99, {
                    size: sc.NUMBER_SIZE.TEXT,
                    leadingZeros: f >= 100 ? 3 : 2
                });
                this.round.setPos(7, 5);
                this.round.setNumber(c + 1);
                this.addChildGui(this.round);
                this.dots = new ig.ImageGui(this.round.gfx,
                    267, 35, 3, 7);
                this.dots.setPos(7 + this.round.hook.size.x + 1, 7);
                this.addChildGui(this.dots);
                this.button.textChild.hook.pos.x = this.dots.hook.pos.x + 6
            } else {
                !h && this.button.textChild.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);
                this.button.textChild.setPos(7, 0)
            }
        },
        updateDrawables: function(a) {
            this.parent(a)
        },
        setActive: function(a) {
            this.parent(a);
            this.round && this.round.setColor(a ? sc.GUI_NUMBER_COLOR.WHITE : sc.GUI_NUMBER_COLOR.GREY);
            if (this.dots) this.dots.offsetY = a ? 35 : 65
        }
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
            var fc = false;
            this.summary = new sc.ArenaSummary(function() {
                if (this.state == 0) {
                	if ((fc = this.checkFirstClear() || this.checkConditionalClear()) && sc.options.get("show-items")) {
                		this.state = 99;
	                    this.waitTimer = 0.4;
                	} else {
	                    this.state = 1;
	                    this.waitTimer = 0.4;
                	}
                	this.checkNewRecord();
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
                    !fc && this.saveScore();
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
        update: function() {
            !this.overview && !this.buttons.dialogBlock && this.summary && this.summary.updateScroll();
            if (this.initTimer > 0) this.initTimer =
                this.initTimer - ig.system.tick;
            if (this.waitTimer > 0) {
                this.waitTimer = this.waitTimer - ig.system.rawTick;
                if (this.waitTimer <= 0)
                    if (this.state == 1) this.medal.show(sc.arena.getMedalForCurrentRound(this.summary.totalValue));
                    else if (this.state == 2) this.buttons.show();
                else if (this.state == 3) {
                    this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, function() {
                        this.state = 2;
                        this.waitTimer = 0.2;
                        this.overview = null
                    }.bind(this));
                    ig.gui.addGuiElement(this.overview);
                    this.overview.show(ig.lang.get("sc.gui.arena.newTrophy"))
                } else if (this.state ==
                    4) {
                    var a = sc.arena.saveRushScore();
                    this.overview = new sc.ArenaRushOverview(function() {
                        this.coins && this.coins.addRushCoins();
                        this.state = a ? 3 : 2;
                        this.waitTimer = 0.2;
                        this.overview = null
                    }.bind(this));
                    ig.gui.addGuiElement(this.overview);
                    this.overview.show()
                } else if (this.state == 99 && sc.options.get("show-items")) {
                	this.saveScore();
                	this.waitTimer = 3;
                	this.state = 1;
                }
            }
        },
        checkFirstClear: function() {
            if (isTrial() && sc.arena.isFirstClear()) {
                sc.commonEvents.startCallEvent("trial-first-clear");
                var a = new sc.SmallEntityBox(ig.game.playerEntity, ig.lang.get("sc.gui.arena.firstClear"), 3, null, -2);
                a.hideSmall = true;
                a.stopRumble();
                this.addChildGui(a)
                return true;
            }
            return false;
        },
        checkConditionalClear: function() {
            return sc.arena.hasSatisfiedCondition();
        },
        onInteraction: function() {
        	var a = false;
            if (!(this.waitTimer > 0 || this.initTimer > 0))
                if (this.state == 0) {
                    this.summary.skip();
                    this.state = 1;
                    this.waitTimer = 0.2;
                    this.checkNewRecord();
                    (a = this.checkFirstClear() || this.checkConditionalClear()) && (this.state = 99);
                } else if (this.state == 1) {
	                this.state = 2;
	                this.waitTimer = 0.2;
	                !a && this.saveScore();
	                this.coins && this.coins.show(true)
	            } else if (this.state == 99) {
	            	this.state = 1;
	            	this.waitTimer = 3;
	            	this.saveScore();
	            }
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
            var c = sc.arena.getCupRounds(this.currentCup);
            a.clear();
            b.clear();
            if (!isTrial(this.currentCup)) {
			    var e = "\\i[arena-bolt-left]\\c[0]" + ig.lang.get("sc.gui.arena.menu.rush") + "\\c[0]\\i[arena-bolt-right]",
	                e = new sc.ArenaRoundEntryButton(e, this.currentCup, -1, sc.arena.getCupMedal(this.currentCup, -1), c.length, null, isTrial(this.currentCup));
	            a.addButton(e);	
			}
            for (var f = 0; f <
                c.length; f++) {
                e = c[f].altName && sc.newgame.hasHarderEnemies() ? ig.LangLabel.getText(c[f].altName) : ig.LangLabel.getText(c[f].name);
                e = new sc.ArenaRoundEntryButton(e, this.currentCup, f, sc.arena.getCupMedal(this.currentCup, f), c.length, null, isTrial(this.currentCup));
                e.setActive(isTrial(this.currentCup) || ig.perf.enableArenaRound || this.isRoundActive(this.currentCup, f));
                a.addButton(e)
            }
        },
        onListEntryPressed: function(a) {
            this.submitSound.play();
            var b = a.key,
                c = a.index,
                a = null;
            if (isTrial(this.currentCup)) {
            	var round = sc.arena.getCupRounds(b)[c];
            	a = ig.lang.get("sc.gui.arena.menu.startTrial").replace("[TRIAL_NAME]", ig.LangLabel.getText(round.altName && sc.newgame.hasHarderEnemies() ? round.altName : round.name));
            } else {
            	a = c == -1 ?
	            	ig.lang.get("sc.gui.arena.menu.startRushMode").replace("[CUP_NAME]", sc.arena.getCupName(b))
	            	: ig.lang.get("sc.gui.arena.menu.startAtRound").replace("[CUP_NAME]", sc.arena.getCupName(b)).replace("[ROUND_INDEX]", c + 1);
            }
            sc.Dialogs.showYesNoDialog(a, sc.DIALOG_INFO_ICON.QUESTION,
                function(a) {
                    if (a.data == 0) {
                        sc.arena.enterArenaMode(b, c);
                        this.submit.play();
                        sc.model.enterPrevSubState()
                    } else a.data > 0 && sc.BUTTON_SOUND.submit.play()
                }.bind(this), true)
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
            	if (this.wasTrial != isTrial(b)) {
            		if (isTrial(b)) {
            			this.rightContent.removeChildGui(this.challenges);
            			this.rightContent.addChildGui(this.firstClearBonuses);
            		} else {
            			this.rightContent.addChildGui(this.challenges);
            			this.rightContent.removeChildGui(this.firstClearBonuses);
            		}
            		this.wasTrial = isTrial(b);
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
               	 	this.headerChallenges.textGui.setText(!isTrial(b) ? ig.lang.get("sc.gui.arena.menu.challenges") : sc.arena.hasFirstCleared(b, a)
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
		                    j > 0 && !d && k.setDrawCallback(function(a, b) {
		                        sc.MenuHelper.drawLevel(this.level, a, b, this.numberGfx)
		                    }.bind(k));
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
    sc.ArenaInfoBox.inject({
    	 setRoundInfo: function(a, b) {
            if (b == void 0) {
                this.title.setText(ig.lang.get("sc.gui.arena.menu.noRound"));
                this.pages[1].setData();
                this.round = -2
            } else if (!(this.key == a && this.round == b)) {
                this.key =
                    a;
                this.round = b;
                var roundData = this.cup.rounds[b];
                (this.cup = sc.arena.getCupData(this.key)) ? b == -1 ? this.title.setText(ig.lang.get("sc.gui.arena.menu.rush")) : this.title.setText(ig.LangLabel.getText(roundData.altName && sc.newgame.hasHarderEnemies() ? roundData.altName : roundData.name)): this.title.setText(ig.lang.get("sc.gui.arena.menu.noRound"));
                this.round >= -1 && this.pages[1].setData(a, this.round, true)
            }
        }
    });
    sc.ArenaRoundStartHud = ig.GuiElementBase.extend({
        transitions: {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    scaleY: 0.2
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        },
        timer: 0,
        done: false,
        round: null,
        name: null,
        container: null,
        init: function() {
            this.parent();
            this.setAlign(ig.GUI_ALIGN_X.LEFT, ig.GUI_ALIGN_Y.CENTER);
            this.setSize(ig.system.width, isTrial() ? 24 : 40);
            this.setPivot(0, this.hook.size.y / 2);
            this.setPos(0, -80);
            this.hook.zIndex = 99;
            this.timer = 2;
            var b = sc.arena.runtime.currentRound,
                a = sc.arena.getCurrentRound(),
                d = ig.lang.get("sc.gui.arena.round"),
                d = d.replace("[!]", b + 1);
            this.round = new sc.TextGui(d);
            this.round.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.TOP);
            this.round.hook.transitions = {
                DEFAULT: {
                    state: {
                        offsetX: 5
                    },
                    time: 2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                CENTER: {
                    state: {
                        offsetX: -5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: -100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                AWAY: {
                    state: {
                        alpha: 0,
                        offsetX: 100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.round.doStateTransition("HIDDEN", true);
            this.round.setPos(0, 4);
            if (!isTrial()) {
	            this.addChildGui(this.round);
            };
            b = sc.arena.runtime.challengeMods;
            this.container = new ig.GuiElementBase;
            this.container.setAlign(ig.GUI_ALIGN_X.LEFT,
                ig.GUI_ALIGN_Y.CENTER);
            this.container.setPos(10, 0);
            var c = d = 0,
                e = 0,
                f;
            for (f in b) {
                var g = new sc.ArenaRoundStartHud.ChallengeEntry(f, b[f].global);
                g.setPos(d, c);
                d = d + 19;
                e++;
                if (e >= 10) {
                    c = c + 19;
                    d = 0
                }
                this.container.addChildGui(g)
            }
            this.container.setSize(190, 18 * (~~(e / 10) + 1));
            this.addChildGui(this.container);
            this.name = new sc.TextGui(ig.LangLabel.getText(a.altName && sc.newgame.hasHarderEnemies() ? a.altName : a.name));
            this.name.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.BOTTOM);
            this.name.hook.transitions = {
                DEFAULT: {
                    state: {
                        offsetX: -5
                    },
                    time: 2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                CENTER: {
                    state: {
                        offsetX: 5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: 100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                AWAY: {
                    state: {
                        alpha: 0,
                        offsetX: -100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.name.doStateTransition("HIDDEN", true);
            this.name.setPos(0, 4);
            this.addChildGui(this.name);
            this.doStateTransition("HIDDEN", true);
            this.doStateTransition("DEFAULT");
            this.round.doStateTransition("CENTER", false, false, function() {
                this.round.doStateTransition("DEFAULT", false, false,
                    function() {
                        this.round.doStateTransition("AWAY")
                    }.bind(this))
            }.bind(this));
            this.name.doStateTransition("CENTER", false, false, function() {
                this.name.doStateTransition("DEFAULT", false, false, function() {
                    this.name.doStateTransition("AWAY")
                }.bind(this))
            }.bind(this))
        },
        updateDrawables: function(b) {
            var a = this.hook.size;
            b.addColor("#000", 0, 0, a.x, a.y).setAlpha(0.5);
            b.addColor("#FFF", 0, 1, a.x, 1).setAlpha(0.5);
            b.addColor("#FFF", 0, a.y - 2, a.x, 1).setAlpha(0.5)
        },
        update: function() {
            if (this.timer >= 0 && !this.hasTransition()) {
                this.timer =
                    this.timer - ig.system.tick;
                this.timer <= 0 && this.doStateTransition("HIDDEN", false, true, function() {
                    this.done = true
                }.bind(this))
            }
        }
    });
	sc.TrialTimeRemainingHud = ig.GuiElementBase.extend({
        transitions: {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    scaleY: 0.2
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        },
        timer: 0,
        done: false,
        name: null,
        init: function(n) {
            this.parent();
            this.setAlign(ig.GUI_ALIGN_X.LEFT, ig.GUI_ALIGN_Y.CENTER);
            this.setSize(ig.system.width, isTrial() ? 24 : 40);
            this.setPivot(0, this.hook.size.y / 2);
            this.setPos(0, 0);
            this.hook.zIndex = 99;
            this.timer = 2;
            this.name = new sc.TextGui(ig.lang.get("sc.gui.arena.trialTimeRemaining").replace("[NUM]", n));
            this.name.setAlign(ig.GUI_ALIGN_X.CENTER, ig.GUI_ALIGN_Y.BOTTOM);
            this.name.hook.transitions = {
                DEFAULT: {
                    state: {
                        offsetX: -5
                    },
                    time: 2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                CENTER: {
                    state: {
                        offsetX: 5
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: 100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                AWAY: {
                    state: {
                        alpha: 0,
                        offsetX: -100
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.name.doStateTransition("HIDDEN", true);
            this.name.setPos(0, 4);
            this.addChildGui(this.name);
            this.doStateTransition("HIDDEN", true);
            this.doStateTransition("DEFAULT");
            this.name.doStateTransition("CENTER", false, false, function() {
                this.name.doStateTransition("DEFAULT", false, false, function() {
                    this.name.doStateTransition("AWAY")
                }.bind(this))
            }.bind(this))
        },
        updateDrawables: function(b) {
            var a = this.hook.size;
            b.addColor("#000", 0, 0, a.x, a.y).setAlpha(0.5);
            b.addColor("#FFF", 0, 1, a.x, 1).setAlpha(0.5);
            b.addColor("#FFF", 0, a.y - 2, a.x, 1).setAlpha(0.5)
        },
        update: function() {
            if (this.timer >= 0 && !this.hasTransition()) {
                this.timer =
                    this.timer - ig.system.tick;
                this.timer <= 0 && this.doStateTransition("HIDDEN", false, true, function() {
                    this.done = true
                }.bind(this))
            }
        }
    });
    sc.ArenaRoundStartHud.ChallengeEntry = ig.GuiElementBase.extend({
        gfx: new ig.Image("media/gui/arena-gui.png"),
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
        icon: 0,
        challenge: null,
        global: false,
        init: function(b, a) {
            this.parent();
            this.setSize(18, 18);
            this.global = a || false;
            this.challenge = sc.ARENA_CHALLENGES[b ||
                "NO_MELEE"];
            this.icon = this.challenge.icon || 1
        },
        updateDrawables: function(b) {
            b.addGfx(this.gfx, 0, 0, 256 + this.icon % 6 * 18, ~~(this.icon / 6) * 18, 18, 18);
            this.global && b.addGfx(this.gfx, 0, 0, 128, 48, 18, 18)
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
	ig.EVENT_STEP.SHOW_TRIAL_TIME_REMAINING_GUI = ig.EventStepBase.extend({
        _wm: new ig.Config({
            attributes: {
            	count: {
                    _type: "Number",
                    _info: "Number of seconds to display on gui"
                },
                wait: {
                    _type: "Boolean",
                    _info: "If true, wait until the gui has finished animating."
                }
            }
        }),
        init: function(b) {
            this.wait = b.wait || false
            this.count = b.count || 999;
        },
        start: function(b) {
            var a = new sc.TrialTimeRemainingHud(this.count);
            ig.gui.addGuiElement(a);
            if (this.wait) b._gui = a
        },
        run: function(b) {
            return this.wait ? b._gui.done : true
        }
    });
});