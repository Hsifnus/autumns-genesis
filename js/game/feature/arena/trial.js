ig.module("game.feature.arena.trial").requires(
    "game.feature.arena.arena", "game.feature.arena.arcane-lab-arena", "game.feature.arena.trial-legacy").defines(function() {
    var c = null,
        f = {
            value: 0
        },
        moddedCups = {
            "special-cup": {
                order: 90000
            },
            "master-trial-cup": {
                order: 100000
            },
            "master-trial-cup-2": {
                order: 100001
            }
        },
        b = {
            "rookie-cup": {
                order: 100
            },
            "seeker-cup": {
                order: 200
            },
            "boss-cup": {
                order: 1E3
            },
            "faction-cup-1": {
                order: 2E3
            },
            "faction-cup-2": {
                order: 2100
            },
            "rookie-team-cup": {
                order: 101
            },
            "faction-team-cup-1": {
                order: 200
            }
        };
    sc.ArenaPlus = sc.ArenaAL.extend({
        init: function() {
            this.parent();
            sc.Model.addObserver(sc.timers, this);
        },
        isTrial: function(a) {
            a = a ? a : sc.arena.runtime.cup;
            return sc.arena.cups[a] && sc.arena.cups[a].isTrial;
        },
        isRoundEncore: function(a, b) {
            a = a ? a : sc.arena.runtime.cup;
            return sc.arena.cups[a] && sc.arena.getCupData(a).rounds[b].isEncore;
        },
        isRoundConditionSatisfied: function(a, b) {
            a = a ? a : sc.arena.runtime.cup;
            return sc.arena.cups[a] && (!sc.arena.getCupData(a).rounds[b].condition || (new ig.VarCondition(sc.arena.getCupData(a).rounds[b].condition)).evaluate());
        },
        startRound: function() {
            var a = this.runtime,
                b = this.getCurrentRound();
            a.scoreStats = {};
            this.addGui();
            if (this.isTrial()) {
                this.cachedHarderEnemies = !!sc.newgame.options["harder-enemies"];
                this.cachedNewgameActive = sc.newgame.active;
                sc.newgame.setActive(true);
                this.cachedHarderEnemies !== this.exMode && sc.newgame.toggle("harder-enemies");
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
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent();
        },
        endRound: function() {
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent();
        },
        startNextRound: function(a) {
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.removeTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent(a);
        },
        restartCup: function(a) {
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.removeTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent(a);
        },
        prepareLobbyReturn: function(a) {
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.removeTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent(a);
        },
        exitArenaMode: function() {
            if (this.isTrial()) {
                sc.newgame.setActive(this.cachedNewgameActive);
                this.cachedHarderEnemies != sc.newgame.options["harder-enemies"] && sc.newgame.toggle("harder-enemies");
                sc.timers.stopTimer("trialTimer");
                sc.timers.removeTimer("trialTimer");
                sc.timers.timers.trialTimerSixty && sc.timers.stopTimer("trialTimerSixty");
                sc.timers.timers.trialTimerTen && sc.timers.stopTimer("trialTimerTen");
                sc.timers.timers.trialTimerThirty && sc.timers.stopTimer("trialTimerThirty");
            }
            this.parent();
        },
        modelChanged: function(b, a) {
            if (b == sc.timers && a == sc.TIMER_EVENT.COUNTDOWN_DONE) {
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
                                firstClearBonus: 0,
                                exFirstClearBonus: 0
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
                firstClearBonus: 0,
                exFirstClearBonus: 0
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
                h = 0,
                i = this.getCupRounds(c.cup)[c.currentRound].exFirstClearBonus;
            if (g) {
                if (this.isTrial() && !d.firstClearBonus) {
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
                if (this.isTrial() && this.exMode && !d.exFirstClearBonus) {
                    d.exFirstClearBonus = 1;
                    for (h = 0; h < i.length; h++) {
                        sc.model.player.addItem(i[h].item, i[h].count);
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
            var cupName = a;
            if ((a = this.cups[a]) && a.progress) {
                var b = a.progress;
                var d = !this.isTrial(a);
                var a = d ? 1 : 0;
                c = d && b.rush.medal >= sc.ARENA_MEDALS_TROPHIES.GOLD ?
                    1 : 0;
                if (b) {
                    for (var b = b.rounds, d = b.length; d--;) {
                        if (!this.isRoundEncore(cupName, d)) {
                            b[d].medal >= sc.ARENA_MEDALS_TROPHIES.GOLD && c++;
                            a++
                        }
                    }
                    if (c == a && a == 0) {
                        return 0;
                    }
                    return c / a
                }
            }
            return 0
        },
        getTotalArenaCompletion: function() {
            var a = 0,
                c = 0,
                d;
            for (d in b) {
                a = a + this.getCupCompletion(d);
                c++
            }
            for (d in moddedCups) {
                a = a + this.getCupCompletion(d);
                c++
            }
            return a / c
        },
        getCupTrophy: function(a) {
            var cupName = a;
            if (this.cups[a]) {
                var f = a;
                if (!this.hasMedalsForTrophy(a)) return 0;
                for (var a = this.cups[a].progress, b = 0, c = a.rounds.length; c--;) {
                    if (!this.isRoundEncore(cupName, c)) {
                        b = b + a.rounds[c].medal;
                    }
                }
                b = b / a.rounds.filter((_, idx) => !this.isRoundEncore(cupName, idx)).length;
                c = ~~b;
                var d = b > c ? b - c >= sc.ARENA_TROPHY_QUOTA ? Math.round(b) : c : c;
                if (d >= 4 && ((this.isTrial(f) && b >= 4) || a.rush.medal == 4)) {
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
            return !this.cups[b] || !this.cups[b].progress ? false :
                !this.cups[b].progress.rounds[c].firstClearBonus || (this.exMode && !this.cups[b].progress.rounds[c].exFirstClearBonus);
        },
        hasFirstCleared: function(b, c) {
            b = b || this.runtime.cup;
            c = c === 0 || !!c ? c : this.runtime.currentRound;
            return !this.cups[b] || !this.cups[b].progress ? false :
                (!this.exMode && this.cups[b].progress.rounds[c].firstClearBonus == 1) || (this.exMode && this.cups[b].progress.rounds[c].exFirstClearBonus == 1);
        },
        hasFirstClearedAtAll: function(b, c) {
            b = b || this.runtime.cup;
            c = c === 0 || !!c ? c : this.runtime.currentRound;
            return !this.cups[b] || !this.cups[b].progress ? false :
                this.cups[b].progress.rounds[c].firstClearBonus == 1 || this.cups[b].progress.rounds[c].exFirstClearBonus == 1;
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
                        firstClearBonus: d.rounds[f].firstClearBonus,
                        exFirstClearBonus: d.rounds[f].exFirstClearBonus
                    });
                    b.cupData[c] = e;
                    b.cupData[c].name = ig.copy(this.cups[c].name);
                    b.cupData[c].condition = ig.copy(this.cups[c].condition)
                } else b.cupData[c] = {};
            b.coins = this.coins || 0;
            b.coinsSpend = this.coinsSpend || 0;
            b.exMode = this.exMode || false;
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
                                firstClearBonus: d.rounds[f].firstClearBonus || 0,
                                exFirstClearBonus: d.rounds[f].exFirstClearBonus || 0
                            });
                            this.cups[c].progress = e;
                            this.cups[c].name = d.name || null;
                            this.cups[c].condition = d.condition || null
                        }
                    }
                this.coins = a.arena.coins || 0;
                this.coinsSpend = a.arena.coinsSpend || 0;
                this.exMode = a.arena.exMode || false;
            }
        },
        onVarAccess: function(a, b) {
            if (b[0] == "arena" && b[1]) {
                if (b[1] == "ex-mode") {
                    return !!this.exMode;
                } else if (this.cups[b[1]] && b[2] == "progress") {
                    return this.getCupProgress(b[1])
                        && this.getCupProgress(b[1]).rounds
                        && this.getCupProgress(b[1]).rounds.filter(round => !!round.medal).length;
                } else {
                    return this.parent(a, b);
                }
            }
            throw Error("Unsupported var access path: " + a);
        },
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
            if (sc.arena.getCupProgress(a) === undefined) {
                this.registerCup(a, moddedCups[a]);
            }
            return b <= 0 || sc.arena.getCupProgress(a).rounds[b].cleared >= 1 ? true : sc.arena
                .getCupProgress(a).rounds[b - 1].cleared >= 1
        },
        resolveCupRounds: function(a) {
            if (this.cups[a]) {
                var b = this.getCupProgress(a);
                for (var c = b.rounds.length; c < this.getCupRounds(a).length; c++) {
                    b.rounds.push({
                        medal: 0,
                        points: 0,
                        time: 0,
                        cleared: 0,
                        firstClearBonus: 0
                    });
                }
            }
        },
        onPreDamageApply: function(a, b, c, d, e) {
            console.log(e.hasHint("ARENA_SCORE"));
            if (this.active && !(c == sc.SHIELD_RESULT.PERFECT || (d.getCombatantRoot().party != sc.COMBATANT_PARTY.PLAYER && !e.hasHint("ARENA_SCORE")) || this.isEnemyBlocked(a))) {
                c = 1;
                if (d.params.buffs.length >
                    0)
                    for (var d = d.params.buffs, f = 0, g = d.length; f < g; f++)
                        if (d[f] instanceof sc.ActionBuff && d[f].name == "sergeyHax") {
                            c = e.attackerParams.getStat("attack", true) / e.attackerParams.getStat("attack", false);
                            break
                        } a = Math.min(Math.max(0, a.params.currentHp), Math.floor(b.damage * c));
                if (a > 0) {
                    this.addScore("DAMAGE_DONE", a);
                    b = Math.floor(a - a / b.defensiveFactor);
                    if (b > 0) {
                        sc.stats.addMap("arena", "effectiveDamage", b);
                        this.addScore("DAMAGE_DONE_EFFECTIVE", b)
                    }
                }
            }
        }
    });
    ig.addGameAddon(function() {
        return sc.arena = new sc.ArenaPlus;
    });
});