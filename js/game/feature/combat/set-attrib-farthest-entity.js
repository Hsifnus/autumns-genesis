ig.module("game.feature.combat.set-attrib-farthest-entity").requires(
    "game.feature.combat.combat-action-steps",
    "game.feature.combat.entities.combat-proxy"
).defines(function() {
	var e = {
        TARGET_DISTANCE: 1,
        SELF_DISTANCE: 2
    };
    ig.ACTION_STEP.SET_ATTRIB_FARTHEST_ENTITY = ig.ActionStepBase.extend({
        _wm: new ig.Config({
            attributes: {
                entityAttrib: {
                    _type: "String",
                    _info: "Name of attrib to store entity",
                    _optional: true
                },
                indexAttrib: {
                    _type: "String",
                    _info: "Name of attrib to store entity index",
                    _optional: true
                },
                entities: {
                    _type: "Array",
                    _info: "List of entities. Will move to one of those",
                    _sub: {
                        _type: "Entity"
                    }
                },
                selectBy: {
                    _type: "String",
                    _info: "How entity is selected",
                    _select: e
                }
            }
        }),
        init: function(a) {
            this.entityAttrib = a.entityAttrib;
            this.indexAttrib = a.indexAttrib;
            this.entities = a.entities;
            this.selectBy = e[a.selectBy]
        },
        start: function(a) {
        	!a.getTarget() && (this.selectBy = 2);
            var b;
            b = this.entities;
            for (var c = -1, d = 0, f = b.length, g = this.selectBy == e.TARGET_DISTANCE ? a.getTarget() : a; f--;) {
                var h = ig.Event.getEntity(b[f]);
                if (h) {
                    h = ig.CollTools.getGroundDistance(g.coll, h.coll);
                    if (c == -1 || h > d) {
                        c = f;
                        d = h
                    }
                }
            }
            b = c;
            this.indexAttrib && a.setAttribute(this.indexAttrib, b);
            this.entityAttrib && a.setAttribute(this.entityAttrib, this.entities[b])
        }
    });
})