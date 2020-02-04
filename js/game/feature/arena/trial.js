ig.module("game.feature.arena.trial").requires("game.feature.arena.arena", "game.feature.arena.gui.arena-gui", "game.feature.menu.gui.arena.arena-list").defines(function() {
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