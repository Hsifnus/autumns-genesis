ig.module("game.feature.combat.model.proxy-nearby").requires("game.feature.combat.model.combat-condition").defines(function() {
    sc.COMBAT_CONDITION.PROXY_NEARBY = ig.Class.extend({
        value: 0,
        _wm: new ig.Config({
            attributes: {
                max: {
                    _type: "Number",
                    _info: "Maximum ground distance between considered proxy"
                },
                align: {
                    _type: "String",
                    _info: "Alignment of test point relative to entity",
                    _select: ig.ENTITY_ALIGN
                },
                offset: {
                    _type: "Offset",
                    _info: "Offset to position",
                    _optional: true
                },
                groups: {
                    _type: "Array",
                    _info: "Groups of proxies to search for. Considers any proxy if no groups are given.",
                    _sub: {
                        _type: "String"
                    },
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.align = ig.ENTITY_ALIGN[a.align] || ig.ENTITY_ALIGN.BOTTOM;
            this.offset = a.offset;
            this.max = a.max;
            this.groups = !a.groups || a.groups.length == 0 ? null : a.groups;
        },
        check: function(a, b, d) {
            var pos = a.getAlignedPos(this.align);
            this.offset && Vec3.add(pos, this.offset);
            var minDist = 9999999;
            for (var entities = ig.game.entities, i = entities.length; i--;) {
                var e = entities[i];
                if (!this.groups || (e && (e instanceof sc.CombatProxyEntity && this.groups.some(g => e.group == g)))) {
                    var x = e.coll.pos.x + e.coll.size.x / 2 - pos.x;
                    var y = e.coll.pos.y + e.coll.size.y / 2 - pos.y;
                    var dist = Math.sqrt(x * x + y * y);
                    minDist > dist && (minDist = dist);
                    if (dist <= this.max) {
                        return true;
                    }
                }
            }
            return false;
        }
    });
});