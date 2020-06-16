ig.module("game.feature.combat.model.enemy-tracker-access")
.requires("game.feature.combat.model.enemy-tracker", "game.feature.combat.entities.enemy")
.defines(function() {
	sc.EnemyTracker.inject({
		onVarAccess: function(b, a) {}
	});
	sc.ENEMY_TRACKER.TIME.inject({
		OnVarAccess: function(b, a) {
			if (a[3] == "progress") return this.target ? (this.current / this.target) : 0;
		},
	});
	sc.ENEMY_TRACKER.HIT.inject({
		target: 0,
		onConditionEval: function(b, a, d, c) {
			this.target = this._getTarget(b);
			return this.parent(b, a, d, c);
		},
		onVarAccess: function(b, a) {
			var t = this.target;
			if (a[3] == "progress") return t ? (this.current / t) : 0;
			throw Error("Unsupported var access path: " + b);
		}
	});
	sc.ENEMY_TRACKER.HP.inject({
		progress: 0,
		showWeakness: true,
		init: function(b, a) {
            this.parent(b, a);
            if (a.showWeakness !== undefined)
            	this.showWeakness = a.showWeakness;
        },
		onConditionEval: function(b, a, d, c) {
			var result = this.parent(b, a, d, c);
			this.progress = this.hpReduced / b.params.getStat("hp") / this.target;
			d.weakness = this.showWeakness ? this.progress : 0;
			return result;
		},
		onVarAccess: function(b, a) {
			if (a[3] == "progress") return this.progress;
			throw Error("Unsupported var access path: " + b);
		}
	});
	ig.ENTITY.Enemy.inject({
		onVarAccess: function(a, b) {
            return b[1] == "tracker" ? this.trackers[b[2]].onVarAccess(a, b) : this.parent(a, b);
        }
	})
});