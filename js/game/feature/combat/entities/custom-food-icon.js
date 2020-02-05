ig.module("game.feature.combat.entities.custom-food-icon").requires(
	"game.feature.combat.entities.food-icon", "game.feature.player.player-steps").defines(function() {
	const customFoods = ["GENESIS_APPLE"];
	for (var a = 0; a < customFoods.length; ++a) sc.FOOD_SPRITE[customFoods[a]] = -1;
	sc.CUSTOM_FOOD_SPRITE = {};
	for (var a = 0; a < customFoods.length; ++a) sc.CUSTOM_FOOD_SPRITE[customFoods[a]] = a;
	ig.ACTION_STEP.SHOW_FOOD_ICON = ig.ActionStepBase.extend({
        icon: null,
        _wm: new ig.Config({
            attributes: {
                icon: {
                    _type: "String",
                    _info: "The icon to display",
                    _select: sc.FOOD_SPRITE
                },
                offset: {
                    _type: "Vec2",
                    _info: "Offset position of sprite",
                    _optional: true
                }
            }
        }),
        init: function(a) {
            this.icon = sc.FOOD_SPRITE[a.icon] || 0;
            this.customIcon = sc.CUSTOM_FOOD_SPRITE[a.icon] || 0;
            this.offset = a.offset || null
        },
        start: function(a) {
            a = ig.game.spawnEntity(sc.FoodIconEntity, 0, 0, 0, {
                icon: this.icon,
                customIcon: this.customIcon,
                combatant: a
            });
            this.offset && a.setState(sc.FOOD_ICON_STATE.HOLD, this.offset)
        }
    });
	var d = {};
	sc.FoodIconEntity.inject({
        customFoodSheet: new ig.TileSheet("media/entity/player/item-hold-custom.png", 16, 16, 0, 0),
        customIcon: 0,
        init: function(a, b, d, g) {
            this.parent(a, b, d, g);
            this.coll.type = ig.COLLTYPE.NONE;
            this.coll.friction.ground = 0;
            this.coll.time.globalStatic = true;
            this.coll.setSize(0, 0, 0);
            this.icon = g.icon;
            this.customIcon = g.customIcon;
            this.combatant = g.combatant;
            this.combatant.addActionAttached(this);
            this.timer = 0.1
        },
        updateSprites: function() {
            var a = this.timer / 0.1;
            this.state != sc.FOOD_ICON_STATE.DONE && (a = 1 - a);
            var b, f = 0,
                g = 0;
            if (this.state != sc.FOOD_ICON_STATE.HOLD) {
                this.setSpriteCount(2, true);
                b = this.sprites[0];
                b.setPos(this.coll.pos.x -
                    12 + this.offset.x, this.coll.pos.y + 2, this.coll.pos.z + 28 + 2 + this.offset.y);
                b.setSize(24, 0, 32);
                b.setPivot(12, 16);
                b.setImageSrc(this.bubbleGfx, 0, 288);
                b.setAlpha(0.8);
                b.setTransform(a, a, 0);
                b = this.sprites[1];
                f = 0;
                g = 38
            } else {
                this.setSpriteCount(1);
                b = this.sprites[0];
                f = -10;
                g = 17
            }
            f = f + this.offset.x;
            g = g + this.offset.y;
            b.setPos(this.coll.pos.x + f - 8, this.coll.pos.y + 4, this.coll.pos.z + g + 4);
            b.setSize(16, 0, 16);
            b.setPivot(8, 8);
            f = this.icon >= 0 ? this.foodSheet.getTileSrc(d, this.icon) : this.customFoodSheet.getTileSrc(d, this.customIcon);
            b.setImageSrc(this.icon >= 0 ? this.foodSheet.image : this.customFoodSheet.image, f.x, f.y);
            b.setTransform(a,
                a, 0)
        }
    });
});