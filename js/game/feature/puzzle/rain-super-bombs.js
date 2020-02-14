ig.module("game.feature.puzzle.rain-super-bombs").requires("game.feature.puzzle.puzzle-steps").defines(function() {
    var b = Vec3.create(),
        a = Vec3.create(),
        c = [],
        d = Vec2.create();
    sc.SUPER_BOMB_TYPES = {
        "FLARE": "trial/flare-bomb",
        "FROST": "trial/frost-bomb"
    };
    ig.ACTION_STEP.RAIN_SUPER_BOMB = ig.ActionStepBase.extend({
        gfx: null,
        count: null,
        offset: null,
        align: null,
        area: null,
        zVary: null,
        _wm: new ig.Config({
            attributes: {
                count: {
                    _type: "Integer",
                    _info: "Number of bombs"
                },
                offset: {
                    _type: "Offset",
                    _info: "Offset relative to entity ground center from which to shoot"
                },
                align: {
                    _type: "String",
                    _info: "Alignment relative to entity from which to shoot",
                    _select: ig.ENTITY_ALIGN
                },
                bombType: {
                    _type: "String",
                    _info: "Type of super bomb to shoot",
                    _select: sc.SUPER_BOMB_TYPES
                },
                shield: {
                    _type: "Boolean",
                    _info: "Whether to spawn shielded bombs or not"
                },
                area: {
                    _type: "Vec2",
                    _info: "Area on which to rain the bombs randomly"
                },
                zVary: {
                    _type: "Number",
                    _info: "Value to +- vary the z height"
                }
            }
        }),
        init: function(a) {
            this.count = a.count;
            this.offset = a.offset;
            this.align = a.align;
            this.area = a.area;
            this.zVary = a.zVary || 0;
            this.enemyInfo = {
                type: sc.SUPER_BOMB_TYPES[a.bombType || "FLARE"],
                attribs: {shield: a.shield || false},
                targetOnSpawn: true
            };
            this.enemyInfo = new sc.EnemyInfo(this.enemyInfo);
            this.gfx = new ig.Image("media/entity/effects/trial-bosses.png");
        },
        clearCached: function() {
            this.gfx.decreaseRef()
        },
        start: function(a) {
            a = a.getAlignedPos(this.align, b);
            this.offset && Vec3.add(a, this.offset);
            for (var e = this.count; e--;) {
                var h = 10;
                do {
                    var i = false,
                        j = Vec2.assignC(d,
                            0, 0);
                    j.x = (Math.random() - 0.5) * this.area.x;
                    j.y = (Math.random() - 0.5) * this.area.y;
                    for (var k = c.length; k--;)
                        if (Vec2.distance(c[k], j) < 52) {
                            i = true;
                            break
                        }
                } while (h-- && i);
                c.push(Vec2.create(j)); 
                h = (Math.random() - 0.5) * this.zVary;
                j = ig.game.spawnEntity(ig.ENTITY.Enemy, a.x + j.x - 24, a.y + j.y - 24, a.z + h,
                    {
                        enemyInfo: this.enemyInfo.getSettings(), 
                        manualKill: "tmp.superBombDeath"
                    }
                );
            }
            c.length = 0
        }
    });
});