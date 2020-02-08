ig.module("game.feature.arena.trial-cup-overview").requires("game.feature.arena.gui.arena-trophy-gui").defines(function(){
	sc.ArenaCupOverview.inject({
        init: function(b, a) {
            this.parent();

            // remove hooks
            if (sc.arena.isTrial(this.cup)) {
                this.content.removeChildGui(this.rushTime);
                this.content.removeChildGui(this.rushChain);
                this.content.setSize(280, 126);
            }

            this.hookSize();
        },
        hookSize: function() {
            let val = this.medals.hook.size.y;
            this.metalsY = -Infinity;
            Object.defineProperty(this.medals.hook.size, 'y', {
                set: (value) => {
                    if (this.metalsY > -Infinity) {
                        val = this.metalsY;
                    } else {
                        val = value;
                    }
                },
                get: () => {
                    return val;
                }
            });
        },
        update: function() {
            const doCheck = !(this.blockTimer > 0);
            // save it temporarily
            let dot = this.scoreDotSound;
            let callParent = true;
            const currentEntry = this.entries[this.currentIndex];
            if (doCheck) {
                if (this.addEntries) {
                    if (this.currentIndex > 0 && (sc.arena.isTrial(this.cup) || currentEntry.isRush)) {
                        // change the behavior to do nothing
                        this.scoreDotSound = {
                            play: function() {}
                        };
                        if (this.timer <= 0) {
                            if (sc.arena.isTrial(this.cup) && currentEntry.isRush) {
                                this.currentIndex++;
                                callParent = false;
                            } else {
                                const d =  ~~((currentEntry.id - 1)/ 10);
                                this.medalsY = 2 + (d + 1) * 18;
                            }
                        }
                    }
                }

            }

            if (callParent) {
                this.parent();
            }
            // recover it
            this.scoreDotSound = dot;

            if (callParent && sc.arena.isTrial(this.cup)) {
                const children = this.medals.hook.children;
                // the target of interest
                const medal = children[children.length - 1].gui;
                const d = ~~((id - 1) / 10);
                medal.setPos(1 + (id - 1) % 10 * 18, 2 + d * 18);
            }
            this.medalsY = -Infinity;
        },
        skip: function() {
            if (!this.done) {
                let currentIndex = Math.max(this.currentIndex, 0);
                let savedArr = [];
                let finalIndex = currentIndex;
                while (finalIndex < this.entries.length) {
                    const entry = this.entries[finalIndex];
                    if (sc.arena.isTrial(this.cup) && entry.isRush) {
                        savedArr = this.entries.splice(finalIndex);
                        break;
                    } else {
                        entry.id -= 1;
                        finalIndex++;
                    }
                }
                this.parent();
                for (; currentIndex < this.entries.length; currentIndex++) {
                    const entry = this.entries[currentIndex];
                    entry.id += 1;
                }
                this.entries.push(...savedArr);
            }
        }
    });
});