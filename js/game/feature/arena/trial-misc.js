ig.module("game.feature.arena.trial-misc").requires("game.feature.menu.gui.arena.arena-misc",
    "game.feature.new-game.new-game-model").defines(function() {
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
});