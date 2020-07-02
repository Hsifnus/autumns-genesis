ig.module("game.feature.combat.model.enemy-tracker-access")
    .requires("game.feature.combat.model.enemy-tracker",
        "game.feature.combat.entities.enemy",
        "impact.base.actor-entity")
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
        });
        ig.ActorEntity.inject({
            stashed: {
                action: [],
                step: [],
                timer: [],
                data: []
            },
            stashAction: function(a) {
                if (this.currentAction) {
                    !this.stashed.action && (this.stashed.action = []);
                    this.stashed.action.push(this.currentAction);
                    !this.stashed.step && (this.stashed.step = []);
                    this.stashed.step.push(this.currentActionStep);
                    !this.stashed.timer && (this.stashed.timer = []);
                    this.stashed.timer.push(this.stepTimer);
                    !this.stashed.data && (this.stashed.data = []);
                    this.stashed.data.push(ig.copy(this.stepData));
                    !this.stashed.inlineStack && (this.stashed.inlineStack = []);
                    this.stashed.inlineStack.push(ig.copy(this.inlineActionStack || []));
                    this.cancelAction(a);
                }
            },
            hasStashedAction: function() {
                return !!this.stashed.action && this.stashed.action.length > 0;
            },
            clearStashedAction: function() {
                this.stashed.action = [];
                this.stashed.inlineStack = [];
            },
            resumeStashedAction: function(a) {
                if (this.stashed.action && this.stashed.action.length > 0) {
                    this.setAction(this.stashed.action.pop(), false, a);
                    this.currentActionStep = this.stashed.step.pop();
                    this.stepTimer = this.stashed.timer.pop();
                    this.stepData = this.stashed.data.pop();
                    this.inlineActionStack.length = 0;
                    var nextInlineStack = this.stashed.inlineStack.pop();
                    this.stashed.inlineStack && nextInlineStack.length > 0 && this.inlineActionStack.push.apply(this.inlineActionStack, nextInlineStack);
                }
            }
        });
        ig.ACTION_STEP.DO_ATTRIB_ACTION.inject({
            start: function(a) {
                var b = a.getAttribute(this.attrib);
                this.resumeStashed && a.stashed.action[0] == b ? a.resumeStashedAction(this.noStateReset) : a.setAction(b, false, this.noStateReset)
            }
        });
    });