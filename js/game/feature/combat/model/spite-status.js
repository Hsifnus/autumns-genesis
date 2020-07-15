ig.module("game.feature.combat.model.spite-status").requires("game.feature.combat.combat-action-steps").defines(function() {
    sc.SpiteStatus = ig.Class.extend({
        init: function() {
            this.level = 0;
            this.effects = {
                sheet: new ig.EffectSheet("enemies.autumn-dng")
            };
            this.cooldownTimer = 0;
            this.fxHandles = [];
            this.spiteOffsets = [{
                x: 45,
                y: -15,
                z: 12
            }, {
                x: 28,
                y: 38,
                z: 12
            }, {
                x: -28,
                y: 38,
                z: 12
            }, {
                x: -45,
                y: -15,
                z: 12
            }, {
                x: 0,
                y: -48,
                z: 12
            }]
        },
        reset: function() {
            this.level = 0;
            this.fxHandles = [];
        },
        increment: function(owner) {
            var player = ig.game.playerEntity;
            if (owner.getTarget(true) !== player) {
                return;
            }
            if (this.level >= 5 || this.cooldownTimer > 0) {
                return;
            }
            this.cooldownTimer = 1;
            this.fxHandles.push(this.effects.sheet.spawnOnTarget('spiteRingFlame', player, {
                offset: this.spiteOffsets[this.level],
                align: "BOTTOM",
                group: "spite",
                duration: -1
            }));
            this.level++;
        },
        consume: function(proxy, owner) {
            var player = ig.game.playerEntity;
            if (owner.getTarget(true) !== player) {
                return;
            }
            if (proxy) {
                this.cooldownTimer = 1;
                for (var b = this.level - 1; b >= 0; b--) {
                    this.fxHandles[b].stop();
                    var proxyPos = player.getCenter(Vec3.create());
                    proxyPos.x += this.spiteOffsets[b].x;
                    proxyPos.y += this.spiteOffsets[b].y;
                    proxyPos.z += player.coll.pos.z + this.spiteOffsets[b].z;
                    proxy.spawn(proxyPos.x, proxyPos.y, proxyPos.z, owner, owner.face)
                }
                this.fxHandles = [];
                this.level = 0;
            }
        },
        update: function() {
            this.cooldownTimer > 0 && (this.cooldownTimer = this.cooldownTimer - ig.system.tick);
        }
    });
    ig.spiteStatus = new sc.SpiteStatus();
    ig.ACTION_STEP.ADD_PLAYER_SPITE = ig.ActionStepBase.extend({
        run: function(adder) {
            ig.game.playerEntity && ig.spiteStatus.increment(adder);
            return true;
        }
    });
    ig.ACTION_STEP.SHOOT_PROXY_PLAYER_SPITE = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                proxy: {
                    _type: "ProxyRef",
                    _info: "Proxy to shoot out of the spite flames."
                }
            }
        }),
        init: function(args) {
            this.proxySrc = sc.ProxyTools.prepareSrc(args.proxy);
        },
        run: function(shooter) {
            var proxy = sc.ProxyTools.getProxy(this.proxySrc, shooter);
            ig.game.playerEntity && ig.spiteStatus.consume(proxy, shooter.getCombatantRoot());
            return true;
        }
    });
    sc.COMBAT_CONDITION.SPITE_LEVEL = ig.Class.extend({
        value: 0,
        _wm: new ig.Config({
            attributes: {
                min: {
                    _type: "Number",
                    _info: "Minimum spite level. Inclusive. Possible levels are 0-5."
                },
                max: {
                    _type: "Number",
                    _info: "Maximum spite level. Inclusive. Possible levels are 0-5."
                }
            }
        }),
        init: function(a) {
            this.min = a.min || 0;
            this.max = a.max || 5;
        },
        check: function(a) {
            return this.min <= ig.spiteStatus.level && this.max >= ig.spiteStatus.level;
        }
    });
    ig.Game.inject({
        update: function() {
            this.parent();
            !this.paused && ig.spiteStatus.update();
        }
    });
    sc.MapModel.inject({
        onLevelLoaded: function() {
            this.parent();
            ig.spiteStatus.reset();
        }
    });
});