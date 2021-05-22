ig.module("game.feature.combat.ball-attack-radius").requires(
    "game.feature.combat.entities.ball"
).defines(function() {
    const ballSpawnerForces = [];
    ig.ENTITY.Ball.inject({
        attackRadius: 0,
        attackDuration: 0,
        spawnerForce: null,
        focusOnTarget: false,
        otherTargetAttackInfo: null,
        baseAttackInfo: null,
        setBallInfo: function(b, c) {
            this.parent(b, c);
            this.attackInfo && (this.baseAttackInfo = this.attackInfo);
            b.attackRadius > 0 && (this.attackRadius = b.attackRadius);
            b.attackDuration > 0 && (this.attackDuration = b.attackDuration);
            if (b.otherTargetAttack) {
                var d = new sc.AttackInfo(this.params, b.otherTargetAttack, true);
                if (c && this.otherTargetAttackInfo) {
                    d.damageFactor = this.otherTargetAttackInfo.damageFactor;
                    d.defenseFactor = this.otherTargetAttackInfo.defenseFactor;
                    d.spFactor = this.otherTargetAttackInfo.spFactor
                }
                this.otherTargetAttackInfo = d;
            }
            this.focusOnTarget = !!b.focusOnTarget;
            if (!!this.attackRadius && !!this.attackDuration && !!this.attackInfo) {
                var pos = Vec3.create();
                pos.x = this.coll.pos.x + this.coll.size.x/2;
                pos.y = this.coll.pos.y + this.coll.size.y/2;
                pos.z = this.coll.pos.z;
                this.spawnerForce = new sc.CircleHitForce(this.combatant, {
                    attack: this.attackInfo,
                    pos,
                    radius: this.attackRadius,
                    zHeight: this.coll.size.z || 8,
                    duration: this.attackDuration,
                    alwaysFull: true,
                    party: this.combatant.party || "ENEMY",
                    centralAngle: 1,
                    repeat: true
                });
                sc.combat.addCombatForce(this.spawnerForce);
                ballSpawnerForces.push(this.spawnerForce);
            }
        },
        collideWith: function(b) {
            var a = b.coll.parentColl ? b.coll.parentColl.entity : b;
            if (!this.focusOnTarget || this.combatant.getTarget(true) === a) {
                this.attackInfo = this.baseAttackInfo;
                this.parent(b);
            } else if (!this.alreadyCollided.includes(a.id)) {
                var attack = this.otherTargetAttackInfo ? this.otherTargetAttackInfo : this.attackInfo;
                if (!!this.focusOnTarget && attack && a.party != this.party) {
                    if (a.damage) {
                        a.damage(this, attack);
                    } else if (a.ballHit) {
                        this.attackInfo = attack;
                        a.ballHit(
                            this,
                            this.coll._collData && this.coll._collData.blockDir
                        );
                    }
                }
                this.alreadyCollided.push(a.id)
            }
        },
        onProjectileHit: function(a, b) {
            return !this.spawnerForce && this.parent(a, b);
        },
        onProjectileKill: function(a, b, c) {
            if (!!this.spawnerForce) {
                this.spawnerForce.onActionEndDetach();
                ballSpawnerForces.splice(ballSpawnerForces.indexOf(this.spawnerForce), 1);
            }
            this.parent(a, b, c);
        },
        update: function() {
            if (!!this.spawnerForce) {
                var pos = Vec3.create();
                pos.x = this.coll.pos.x + this.coll.size.x/2;
                pos.y = this.coll.pos.y + this.coll.size.y/2;
                pos.z = this.coll.pos.z;
                this.spawnerForce.pos = pos;
            }
            this.parent();
        }
    });
    sc.MapModel.inject({
        onLevelLoaded: function() {
            this.parent();
            for (var i = 0; i < ballSpawnerForces.length; i++) {
                ballSpawnerForces[i].onActionEndDetach();
            }
            ballSpawnerForces.splice(0, ballSpawnerForces.length);
        }
    });
});