ig.module("game.feature.arena.trial-gui").requires("game.feature.arena.gui.arena-gui").defines(function() {
    sc.ArenaPlayerDeathOverlay.inject({
        show: function() {
            if (sc.arena.isTrial()) {
                this.header.show(() => this.buttons.show(), ig.lang.get("sc.gui.arena.trialFail"));
            } else {
                this.header.show(() => this.buttons.show(), ig.lang.get("sc.gui.arena.roundFail"));
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
            this.summary = new sc.ArenaSummary(() => {
                if (this.state == 0) {
                    if ((fc = this.checkFirstClear() || this.checkConditionalClear() || this.checkCrystalsClear()) && sc.options.get("show-items")) {
                        this.state = 99;
                        this.waitTimer = 0.4;
                    } else {
                        this.state = 1;
                        this.waitTimer = 0.4;
                    }
                    this.checkNewRecord();
                }
            });
            if (!sc.arena.isCupCustom(sc.arena.runtime.cup)) {
                this.coins = new sc.ArenaCoinsHud;
                this.addChildGui(this.coins)
            }
            this.medal = new sc.ArenaMedalHud(() => {
                if (this.state == 1) {
                    this.state = 2;
                    this.waitTimer = 0.2;
                    !fc && this.saveScore();
                    this.coins && this.coins.show()
                }
            });
            this.addChildGui(this.medal);
            this.info = new sc.InfoBar(null, null, true);
            this.info.setAlign(ig.GUI_ALIGN_X.LEFT,
                ig.GUI_ALIGN_Y.BOTTOM);
            this.info.setPos(0, 1);
            this.info.doStateTransition("DEFAULT");
            this.addChildGui(this.info);
            this.buttons = sc.arena.isTrial() ?
                new sc.ArenaRoundEndButtons((a, b) => {
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
                        }
                    else if (b == 0) {
                        sc.arena.startNextRound(false);
                        this.hide();
                        sc.commonEvents.startCallEvent("arena-teleport")
                    } else if (b == 1) {
                        this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, () => (this.overview = null), true);
                        ig.gui.addGuiElement(this.overview);
                        this.overview.show()
                    } else if (b == 2) {
                        sc.arena.prepareLobbyReturn();
                        this.hide();
                        sc.commonEvents.startCallEvent("arena-end-cup")
                    }
                }, this.info, true) :
                new sc.ArenaRoundEndButtons((a, b, c) => {
                    if (a)
                        if (c)
                            if (b == 0) {
                                ig.bgm.pause("FAST_OUT");
                                sc.arena.restartCup();
                                this.hide();
                                sc.commonEvents.startCallEvent("arena-teleport")
                            } else if (b == 1) {
                        this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, () => (this.overview = null), true);
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
                        this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, () => (this.overview = null), true);
                        ig.gui.addGuiElement(this.overview);
                        this.overview.show()
                    } else if (b == 3) {
                        sc.arena.prepareLobbyReturn();
                        this.hide();
                        sc.commonEvents.startCallEvent("arena-end-cup")
                    }
                }, this.info);
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
                    this.overview = new sc.ArenaCupOverview(sc.arena.runtime.cup, () => {
                        this.state = 2;
                        this.waitTimer = 0.2;
                        this.overview = null
                    });
                    ig.gui.addGuiElement(this.overview);
                    this.overview.show(ig.lang.get("sc.gui.arena.newTrophy"))
                } else if (this.state ==
                    4) {
                    var a = sc.arena.saveRushScore();
                    this.overview = new sc.ArenaRushOverview(() => {
                        this.coins && this.coins.addRushCoins();
                        this.state = a ? 3 : 2;
                        this.waitTimer = 0.2;
                        this.overview = null
                    });
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
            if (sc.arena.isTrial() && sc.arena.isFirstClear()) {
                sc.commonEvents.startCallEvent("trial-first-clear");
                var a = new sc.SmallEntityBox(ig.game.playerEntity, ig.lang.get("sc.gui.arena.firstClear"), 3, null, -2);
                a.hideSmall = true;
                a.stopRumble();
                this.addChildGui(a)
                return true;
            }
            return false;
        },
        checkCrystalsClear: function() {
            if (sc.arena.isTrial() && sc.arena.isCrystalsClear(undefined, undefined, this.summary.totalValue)) {
                sc.commonEvents.startCallEvent("trial-first-clear");
                var a = new sc.SmallEntityBox(ig.game.playerEntity, ig.lang.get("sc.gui.arena.crystalsClear"), 3, null, -2);
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
            if (sc.arena.isTrial()) {
                this.header.show(() => this.summary.show(), ig.lang.get("sc.gui.arena.trialClear"));
            } else {
                this.header.show(() => this.summary.show());
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
});