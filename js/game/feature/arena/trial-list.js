ig.module("game.feature.arena.trial-list").requires("game.feature.menu.gui.arena.arena-list",
    "game.feature.new-game.new-game-model").defines(function() {
    sc.ArenaRoundList.inject({
        onCreateListEntries: function(a, b) {
            var c = sc.arena.getCupRounds(this.currentCup).filter((_, idx) => sc.arena.isRoundConditionSatisfied(this.currentCup, idx));
            sc.arena.resolveCupRounds(this.currentCup);
            a.clear();
            b.clear();
            if (!sc.arena.isTrial(this.currentCup)) {
                var e = "\\i[arena-bolt-left]\\c[0]" + ig.lang.get("sc.gui.arena.menu.rush") + "\\c[0]\\i[arena-bolt-right]",
                    e = new sc.ArenaRoundEntryButton(e, this.currentCup, -1, sc.arena.getCupMedal(this.currentCup, -1), c.length, null, sc.arena.isTrial(this.currentCup));
                a.addButton(e);
            }
            for (var f = 0; f < c.length; f++) {
                e = c[f].altName && sc.arena.exMode ? ig.LangLabel.getText(c[f].altName) : ig.LangLabel.getText(c[f].name);
                e = sc.arena.isRoundEncore(this.currentCup, sc.arena.getCupRounds(this.currentCup).indexOf(c[f])) ? '\\c[3]Encore:\\c[0] ' + e : e
                e = new sc.ArenaRoundEntryButton(e, this.currentCup, f, sc.arena.getCupMedal(this.currentCup, f), c.length, null, sc.arena.isTrial(this.currentCup));
                e.setActive(sc.arena.isTrial(this.currentCup) || ig.perf.enableArenaRound || this.isRoundActive(this.currentCup, f));
                a.addButton(e)
            }
        },
        onListEntryPressed: function(a) {
            this.submitSound.play();
            var b = a.key,
                c = a.index,
                a = null;
            if (sc.arena.isTrial(this.currentCup)) {
                var round = sc.arena.getCupRounds(b)[c];
                a = ig.lang.get("sc.gui.arena.menu.startTrial").replace("[TRIAL_NAME]", ig.LangLabel.getText(round.altName && sc.arena.exMode ? round.altName : round.name));
            } else {
                a = c == -1 ?
                    ig.lang.get("sc.gui.arena.menu.startRushMode").replace("[CUP_NAME]", sc.arena.getCupName(b)) :
                    ig.lang.get("sc.gui.arena.menu.startAtRound").replace("[CUP_NAME]", sc.arena.getCupName(b)).replace("[ROUND_INDEX]", c + 1);
            }
            sc.Dialogs.showYesNoDialog(a, sc.DIALOG_INFO_ICON.QUESTION,
                (a) => {
                    if (a.data == 0) {
                        sc.arena.enterArenaMode(b, c);
                        this.submit.play();
                        sc.model.enterPrevSubState()
                    } else a.data > 0 && sc.BUTTON_SOUND.submit.play()
                }, true)
        }
    });
});