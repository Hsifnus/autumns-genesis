ig.module("game.feature.player.coquelicot-player").requires(
    "game.feature.player.entities.player",
    "game.feature.player.player-config").defines(function() {
    sc.PLAYER_CLASSES.SPIRIT = Object.keys(sc.PLAYER_CLASSES).length;
    ig.ENTITY.Player.inject({
        initIdleActions: function() {
            this.parent();
            if (this.model.name == "Coquelicot") {
                var a = new ig.Action("PLAYER_IDLE", [{
                        type: "SET_FACE",
                        face: "SOUTH",
                        rotate: true
                    }, {
                        type: "SHOW_ANIMATION",
                        anim: "idleBob",
                        wait: false
                    }, {
                        time: 6,
                        type: "WAIT"
                    }, {
                        type: "SHOW_ANIMATION",
                        anim: "preIdle",
                        wait: true
                    }], false, false);
                this.idle.actions.push(a)
            }
        }
    });
});