// hacky code just to include the master trial test cup for now
ig.module("game.feature.arena.arena-patch").requires("game.feature.arena.arena").defines(function() {
	var moddedCups = {
    "master-trial-test-cup": {
      order: 1002
    }
	};
	sc.Arena.inject({
		loadModdedCups: false,
    registerCup: function(a, b) {
    	console.log(a, b);
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
	})
});