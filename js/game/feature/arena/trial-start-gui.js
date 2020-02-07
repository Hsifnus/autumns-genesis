ig.module("game.feature.arena.trial-start-gui").requires("game.feature.arena.gui.arena-start-gui",
    "game.feature.new-game.new-game-model").defines(function(){
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
            this.setSize(ig.system.width, sc.arena.isTrial() ? 24 : 40);
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
            if (!sc.arena.isTrial()) {
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
            this.round.doStateTransition("CENTER", false, false, () => this.round.doStateTransition("DEFAULT", false, false, () => this.round.doStateTransition("AWAY")));
            this.name.doStateTransition("CENTER", false, false, () => this.name.doStateTransition("DEFAULT", false, false, () => this.name.doStateTransition("AWAY")));
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
                this.timer <= 0 && this.doStateTransition("HIDDEN", false, true, () => (this.done = true))
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
            this.setSize(ig.system.width, sc.arena.isTrial() ? 24 : 40);
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
            this.name.doStateTransition("CENTER", false, false, () => this.name.doStateTransition("DEFAULT", false, false, () => this.name.doStateTransition("AWAY")));
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
                this.timer <= 0 && this.doStateTransition("HIDDEN", false, true, () => (this.done = true));
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
});