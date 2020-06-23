ig.module("game.feature.combat.part-hit-proxy-fix").requires(
    "game.feature.combat.combat-action-steps",
    "game.feature.combat.entities.combatant",
    "game.feature.combat.model.proxy"
).defines(function() {
    sc.ProxyCache = {};
    ig.ACTION_STEP.SET_HIT_PROXY.inject({
        init: function(a) {
            this.parent(a);
            this.oncePerEntity = a.oncePerEntity || false;
        },
        start: function(a) {
            var b = sc.ProxyTools.getProxy(this.proxySrc, a);
            if (b) {
                b.hitProxyRef = this.proxySrc;
                !sc.ProxyCache[a.id] && (sc.ProxyCache[a.id] = {})
                sc.ProxyCache[a.id][b.hitProxyRef] = [];
            }
            this.parent(a);
            a.setHitProxy(b, this.posType, this.align, this.offset, this.oncePerEntity);
        }
    });
    sc.BasicCombatant.inject({
        setHitProxy: function(a, b, c, d, e) {
            this.parent(a, b, c, d);
            this.combo.hitProxy = new sc.HitProxyConnect(a, b, c, d, e || false, a.hitProxyRef || "");
        },
        spawnHitProxy: function(a, b, c) {
            if (this.combo.hitProxy) {
                if (!this.combo.hitProxy.oncePerEntity) {
                    this.parent(a, b, c);
                } else {
                    var d = a instanceof sc.CombatantAnimPartEntity ? a.getCombatantRoot() : a;
                    if (d && sc.ProxyCache[this.id] && !sc.ProxyCache[this.id][this.combo.hitProxy.hitProxyRef].includes(d)) {
                        sc.ProxyCache[this.id][this.combo.hitProxy.hitProxyRef].push(d);
                        this.combo.hitProxy.spawn(a, this, this.face, b, c);
                    }
                }
            }
        }
    });
    sc.HitProxyConnect.inject({
        oncePerEntity: false,
        hitProxyRef: "",
        init: function(b, a, d, c, e, f) {
            this.parent(b, a, d, c);
            this.oncePerEntity = e;
            this.hitProxyRef = f;
        }
    });
});