ig.module("game.feature.combat.model.arts-invinc").requires(
        "game.feature.skills.master-skills")
    .defines(function() {
        ig.ENTITY.Player.inject({
            forceInvincibleTimer: 0,
            artsInvincSheet: new ig.EffectSheet("enemies.hazel"),
            getChargeAction: function(a, b) {
                console.log("getChargeAction");
                if (this.dashAttackCount && this.params.getModifier("ARTS_INVINC")) {
                    this.forceInvincibleTimer = this.dashAttackCount * this.params.getModifier("ARTS_INVINC");
                    console.log(this.forceInvincibleTimer);
                    this.artsInvincSheet.spawnOnTarget('leafTrail', this, {
                        align: "BOTTOM",
                        rotateFace: -1,
                        group: "arts-invinc",
                        duration: this.dashAttackCount * this.params.getModifier("ARTS_INVINC")
                    });
                }
                return this.parent(a, b);
            },
            damage: function(a, b, c) {
                if (this.forceInvincibleTimer > this.invincibleTimer && this.invincibleTimer >= 0) {
                    this.invincibleTimer = this.forceInvincibleTimer;
                }
                return this.parent(a, b, c);
            },
            update: function() {
                if (this.forceInvincibleTimer > 0) {
                    this.forceInvincibleTimer = this.forceInvincibleTimer - ig.system.actualTick * ig.slowMotion.getNonInvertSlowDown();
                    if (this.forceInvincibleTimer < 0) this.forceInvincibleTimer = 0;
                }
                this.parent();
            }
        })
    });