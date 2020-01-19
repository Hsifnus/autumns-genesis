ig.module("game.feature.combat.model.stun-status").requires(
	"game.feature.combat.model.combat-status",
	"game.feature.combat.gui.status-bar",
	"game.feature.combat.entities.combatant",
	"game.feature.combat.model.combat-params",
	"game.feature.player.modifiers",
	"game.feature.menu.gui.item.item-status-equip",
	"game.feature.menu.gui.menu-misc",
	"game.feature.menu.gui.status.status-misc")
.defines(function() {
	sc.MODIFIERS.WIND_MELEE = {
		altSheet: "media/gui/stun-status.png",
        offX: 96,
        offY: 0,
        icon: -1,
        order: 100
    };
    sc.StunStatus = sc.COMBAT_STATUS[4] = sc.CombatStatusBase.extend({
        id: 4,
        label: "daze",
        statusBarEntry: "DAZED",
        offenseModifier: "COND_EFFECT_ALL",
        defenseModifier: "STUN_THRESHOLD",
        maxDuration: 10,
        duration: 10,
        minDuration: 2,
        stunTimer: 0,
        targetFixed: false,
        activate: function(b, a, d) {
            this.charge = 1;
            this.active = true;
            this.duration = (2 * d.damageFactor).limit(this.minDuration, this.maxDuration);
            this.effectiveness = a.getStat("statusEffect")[this.id] * this._getOffensiveFactor(d);
            sc.combat.showCombatantLabel(b, this.getLabel(), 1.5);
            if (this.onActivate) this.onActivate(b);
            this.initEntity(b)
        },
        onActivate: function(b) {
        	this.stallAction = new ig.Action("stallAction", [
    			{
                    type: "WAIT_UNTIL",
                    condition: "0",
                    maxTime: this.duration
                }
            ]);
            this.stallAction.hint = "battle";
            this.targetFixed = b instanceof ig.ENTITY.Enemy && b.targetFixed;
            b instanceof ig.ENTITY.Enemy && (b.targetFixed = true);
            this.stunTimer = 0;
        },
        cancelStun: function(b, a) {
        	if (this.stunTimer < this.minDuration) {
        		return;
        	}
        	if (a.fly == "MASSIVE"
        		|| a.fly == "MASSIVE+"
        		|| a.fly == "MASSIVE++"
        		|| a.fly == "MASSIVE+++") {
        		this.charge = 0;
        	} else {
        		this.charge -= 0.1 * (a.damageFactor * 0.2).limit(0.25, 1);
        	}
        },
        onClear: function(b) {
        	b.params.endLock(b);
        	b.cancelAction(this.stallAction);
        	b instanceof ig.ENTITY.Enemy && (b.targetFixed = this.targetFixed);
        },
        onUpdate: function(b) {
        	this.stunTimer = this.stunTimer +
                ig.system.ingameTick;
            if (!b.currentAction && b.actionAttached.indexOf(b.params) == -1) {
            	b.setAction(this.stallAction);
            	b.params.startLock(b);
            }
        },
        initEntity: function(b) {
            if (this.active) {
                this.fxHandle && this.fxHandle.stop();
                b.statusGui && b.statusGui.setStatusEntryStick(this.statusBarEntry, true);
                this.fxHandle = this.effects.spawnOnTarget(this.label, b, {
                    duration: -1,
                    align: ig.ENTITY_ALIGN.TOP
                });
                if (this.onInitEntity) this.onInitEntity(b)
            }
        }
    });
    sc.STATUS_BAR_ENTRY.DAZED = {
    	icon: 0,
    	isStun: true,
    	init: null,
    	barY: 0,
    	barX: 0,
    	half: true
    }
	ig.GUI.StatusBar.inject({
		stunGfx: new ig.Image("media/gui/stun-status.png"),
        drawStatusEntry: function(b, c, e, f) {
            var g = this.statusEntries[f],
                f = sc.STATUS_BAR_ENTRY[f],
                h = 1;
            g.timer < 0.1 && (h = g.timer / 0.1);
            h != 1 && b.addTransform().setPivot(c, e + 2).setScale(1, h);
            var i = 24,
                j = 0;
            if (f.half) j = i = i / 2;
            if (f.isStun) {
	            if (g.stick) b.addGfx(this.stunGfx, c - 6, e - 2, 24, 0, 8, 8);
	            else {
	                if (g.timer > 1.7) var l =
	                    Math.sin(Math.PI * 8 * (2 - g.timer) / 0.3),
	                    c = c + l;
	                g = 1 + Math.floor(g.value * (i - 2));
	                l = i - 1 - g;
	                c = c + j;
	                b.addGfx(this.stunGfx, c, e, f.barX, f.barY, g, 4);
	                l && b.addGfx(this.gfx, c + g, e, 216 + g, 12, l, 4);
	                b.addGfx(this.stunGfx, c + (i - 1), e - 2, 25, 0, 7, 8)
	            }
            } else {
	            var k = this.barIconTiles.getTileSrc(a, f.icon);
	            if (g.stick) b.addGfx(this.gfx, c - 6, e - 2, k.x, k.y, 8, 8);
	            else {
	                if (g.timer > 1.7) var l =
	                    Math.sin(Math.PI * 8 * (2 - g.timer) / 0.3),
	                    c = c + l;
	                g = 1 + Math.floor(g.value * (i - 2));
	                l = i - 1 - g;
	                c = c + j;
	                b.addGfx(this.gfx, c, e, 216, f.barY, g, 4);
	                l && b.addGfx(this.gfx, c + g, e, 216 + g, 12, l, 4);
	                b.addGfx(this.gfx, c + (i - 1), e - 2, k.x + 1, k.y, 7, 8)
	            }
            }
            h != 1 && b.undoTransform()
        }
	});

    var b = Vec2.create(),
        a = Vec2.create(),
        d = Vec3.create(),
        c = Vec3.create(),
        e = {},
        f = {
            damageResult: void 0,
            attackType: void 0,
            flyLevel: void 0,
            hitStable: void 0,
            damageFactor: void 0,
            weakness: false,
            alignFace: false,
            ignoreHit: false
        };
	ig.ENTITY.Combatant.inject({
		onDamage: function(a, c, g) {
            var k = this.hitStable,
                l, o = c.type,
                m = c.visualType,
                n = c.fly,
                p = c.reverse,
                r = g || this,
                v = this.hitIgnore;
            e.hitStable = k;
            e.damageFactor = 1;
            var q = this.isShielded(a, c, g, e),
                k = e.hitStable;
            l = e.damageFactor;
            var s = a.getHitCenter(r, d),
                u = a.getCombatant(),
                y = u.getCombatantRoot();
            if (this.params && this.params.isDefeated() || !this.statusGui) return false;
            var t;
            if (q == sc.SHIELD_RESULT.NEUTRALIZE) {
                sc.combat.showHitEffect(r, s, sc.ATTACK_TYPE.NONE, c.element, q);
                return true
            }
            if (!c.damageFactor || c.limiter.onlyHitProxy) {
                c.limiter.noHitProxy || (a.spawnHitProxy ? a.spawnHitProxy(r, null, s) : u.spawnHitProxy(r, null, s));
                return true
            }
            this.params && c.attackerParams && (t = this.params.getDamage(c, l, u, q, v));
            f.weakness = false;
            f.alignFace = false;
            f.ignoreHit = false;
            f.survive = false;
            f.damageFactor = l;
            var z = q;
            l = false;
            this.stunData.lastHitElement = c.element;
            if (this.onPreDamageModification(f,
                    a, c, g, t, q, v)) {
                k = f.hitStable == void 0 ? k : f.hitStable;
                f.hitStable == sc.ATTACK_TYPE.NONE && (z = false);
                if (f.attackType != void 0) m = o = f.attackType;
                if (f.damageResult && t) t = f.damageResult;
                if (f.survive && t) t.damage = this.params.currentHp - 1;
                n = f.flyLevel || n;
                f.damageResult = void 0;
                f.attackType = void 0;
                f.flyLevel = void 0;
                f.hitStable = void 0;
                l = f.alignFace;
                v = this.hitIgnore
            } else if (f.ignoreHit) return false;
            sc.combat.isDamageIgnore() && (t = null);
            c.limiter.noHitProxy || (a.spawnHitProxy ? a.spawnHitProxy(r, t, s) : u.spawnHitProxy(r, t, s));
            if (v && o < sc.ATTACK_TYPE.BREAK) {
                sc.combat.showHitEffect(r, s, sc.ATTACK_TYPE.NONE, c.element);
                return true
            }
            f.weakness && this.statusGui.setStatusEntry("BREAK", f.weakness);
            if (u != r) {
                u.combo.hitCombatants.erase(r);
                u.combo.hitCombatants.push(r)
            }
            if (t && !c.limiter.noDmg) {
                g = Math.max(1, this.params.getStat("hp") * this.stunThreshold * sc.combat.getGlobalDmgFactor(this.party));
                k > sc.ATTACK_TYPE.NONE && (t.damage <= g && !c.noIronStance) && (k = sc.ATTACK_TYPE.MASSIVE);
                if (this.party == sc.COMBATANT_PARTY.ENEMY && y.isPlayer && this.params.getHpFactor() ==
                    1 && t.damage >= this.params.getStat("hp")) {
                    sc.stats.addMap("combat", "oneHitKills", 1);
                    sc.arena.onHitKill(this)
                }
				if (this.params.statusStates[4].active) {
					this.params.statusStates[4].cancelStun(this, c);
				}
                sc.arena.onPreDamageApply(this, t, q, u);
                this.params.applyDamage(t, c, u);
                u.combo.dmgSum = u.combo.dmgSum + t.damage;
                y.addSpikeDamage(t, this.spikeDmg.baseFactor + this.spikeDmg.tmpFactor, this, q, a);
                this.onDamageTaken && this.onDamageTaken(t.damage, q);
                if (y) y.onTargetHit(this, c, t, q, a);
                sc.options.get("damage-numbers") && (sc.options.get("damage-numbers-crit") ? t.critical && ig.ENTITY.HitNumber.spawnHitNumber(s, this,
                    t.damage, t.baseOffensiveFactor, t.defensiveFactor, q, t.critical, f.weakness) : ig.ENTITY.HitNumber.spawnHitNumber(s, this, t.damage, t.baseOffensiveFactor, t.defensiveFactor, q, t.critical, f.weakness))
            }
            k = k >= o && (!this.params || !this.params.isLocked());
            o = this.params && this.params.isLocked();
            if (!k) {
                this.stunCombatant = u;
                for (u = c.stunSteps.length; u--;) {
                    q = c.stunSteps[u];
                    q.preHit && q.preHit(this, this.stunCombatant)
                }
            }
            if (o && !this.params.isLocked() && y.charging && y.charging.executeLevel >= 1) sc.arena.onLockEnd(this, c, t, y.charging.executeLevel);
            if (this.params && this.params.isDefeated()) {
                this._onDeathHit(y);
                m = sc.ATTACK_TYPE.BREAK;
                y = t ? t.damage / this.params.getStat("hp") : 0;
                y = y >= 2 ? "MASSIVE+++" : y >= 1 ? "MASSIVE++" : y >= 0.5 ? "MASSIVE+" : "MASSIVE";
                if (!n || sc.COMBAT_FLY_LEVEL[n].vel < sc.COMBAT_FLY_LEVEL[y].vel) n = y;
                k = false
            }
            if (!c.limiter.noDmg) {
                sc.combat.showHitEffect(r, s, m, c.element, z, t && t.critical);
                t && (t.damage > 1E12 ? sc.combat.effects.hit.spawnOnTarget("hitExtra4", this) : t.damage > 1E9 ? sc.combat.effects.hit.spawnOnTarget("hitExtra3", this) : t.damage > 1E7 ? sc.combat.effects.hit.spawnOnTarget("hitExtra2",
                    this) : t.damage > 1E5 && sc.combat.effects.hit.spawnOnTarget("hitExtra1", this))
            }
            r = a.getHitVel(this, b);
            if (l) {
                Vec2.assign(this.face, r);
                Vec2.flip(this.face)
            }
            k || this.cancelAction();
            if (!n) switch (m) {
                case sc.ATTACK_TYPE.LIGHT:
                    n = "LIGHT";
                    break;
                case sc.ATTACK_TYPE.MEDIUM:
                    n = "MEDIUM";
                    break;
                case sc.ATTACK_TYPE.HEAVY:
                    n = "HEAVY";
                    break;
                case sc.ATTACK_TYPE.MASSIVE:
                case sc.ATTACK_TYPE.BREAK:
                    n = "MASSIVE"
            }
            m = m == sc.ATTACK_TYPE.BREAK;
            s = 0;
            a.isBall && c.hasHint("CHARGED") && (s = c.attackerParams.getModifier("KNOCKBACK"));
            a = this.doDamageMovement(r,
                n, m, k, s, false, p, 1);
            this.damageTimer = Math.max(this.damageTimer, a);
            if (!k && this.stunCombatant) {
                this.stunData.hits++;
                this.stunData.damage = this.stunData.damage + (t && t.damage || 0);
                this.stunData.resetTimer = 0.5;
                if (this.stunSteps.length > 0) this.stunSteps.length = 0;
                for (u = c.stunSteps.length; u--;) {
                    q = c.stunSteps[u];
                    q.start && q.start(this, this.stunCombatant);
                    q.run(this, this.stunCombatant) || this.stunSteps.push(q)
                }
            }
            return true
		}
	});
	var aConst = 0.25,
        dConst = 1.5,
        cConst = 3;
    var funcs = {
        LINEAR: function(a, b) {
            return a * 2 - b
        },
        PERCENTAGE: function(a, b) {
            return a > b ? a * (1 + Math.pow(1 - b / a, 0.5) * 0.2) : a * Math.pow(a / b, 1.5)
        }
    };
	sc.CombatParams.inject({
		init: function(a) {
            if (a)
                for (var b in this.baseParams) this.baseParams[b] = a[b] || this.baseParams[b];
            this.currentHp = this.getStat("hp");
            for (b = 0; b < 5; ++b) this.statusStates[b] = new sc.COMBAT_STATUS[b]
        },
    	getDamage: function(e, g, h, i, j) {
            var k = e.damageFactor,
                l = e.noHack || false,
                o = h.getCombatantRoot(),
                h = h.combo || o.combo;
            if (h.damageCeiling) {
                var m = Math.max(1 - (h.damageCeiling.sum[this.combatant.id] || 0) / h.damageCeiling.max, 0);
                m < 0.5 && (k = Math.max(k * 2 * m, 0.01))
            }
            h = k;
            if (!ig.perf.skipDmgModifiers) {
                e.skillBonus && (k = k * (1 + e.attackerParams.getModifier(e.skillBonus)));
                var n = e.attackerParams.getModifier("BERSERK");
                n && e.attackerParams.getHpFactor() <= sc.HP_LOW_WARNING && (k = k * (1 + n));
                (n = e.attackerParams.getModifier("MOMENTUM")) && (o.isPlayer && o.dashAttackCount) && (k = k * (1 + o.dashAttackCount * n));
                !e.element && (n = e.attackerParams.getModifier("WIND_MELEE")) && e.skillBonus == "MELEE_DMG" && (e.statusInflict = e.statusInflict + 3*n) && (k = k + n * k);
                !ig.vars.get("g.newgame.ignoreSergeyHax") &&
                    (o.isPlayer && !this.combatant.isPlayer && sc.newgame.get("sergey-hax")) && (k = k * 4096);
            }
            var g = this.damageFactor * (g === void 0 ? 1 : g),
                p = 1,
                r = e.attackerParams.getStat("focus", l) / this.getStat("focus", l),
                n = (Math.pow(r, 0.35) - 0.9) * e.critFactor,
                n = Math.random() <= n;
            if (!ig.perf.skipDmgModifiers) {
                e.element && (p = this.getStat("elemFactor")[e.element - 1] * this.tmpElemFactor[e.element - 1]);
                g = g * p;
                e.ballDamage && (g = g * (this.ballFactor + this.statusStates[3].getValue(this)));
                (m = e.attackerParams.getModifier("CROSS_COUNTER")) && sc.EnemyAnno.isCrossCounterEffective(this.combatant) &&
                    (g = g * (1 + m));
                (m = e.attackerParams.getModifier("BREAK_DMG")) && sc.EnemyAnno.isWeak(this.combatant) && (g = g * (1 + m));
                n && (k = k * e.attackerParams.criticalDmgFactor)
            }
            o = sc.combat.getGlobalDmgFactor(o.party);
            m = 0;
            if (e.statusInflict && g > 0 && !j) 
            	var idx = e.element - 1,
                m = h * e.statusInflict;
                var v = (Math.pow(1 + (r >= 1 ? r - 1 : 1 - r) * cConst, aConst) - 1) * dConst;
                r = r >= 1 ? 1 + v : Math.max(0, 1 - v);
                if (idx >= 0) {
                	m = m * r * this.getStat("statusInflict")[idx] * this.tmpStatusInflict[idx] * p;
                	m = this.statusStates[idx].getInflictValue(m, this, e, i);
                } else {
                	m = m * r * p;
                	m = this.statusStates[4].getInflictValue(m, this, e, i);
                }
            i = e.attackerParams.getStat("attack", l);
            l = e.defenseFactor *
                this.getStat("defense", l);
            l = Math.max(1, funcs.PERCENTAGE(i, l));
            l = l * g;
            i = funcs.PERCENTAGE(i, 0) - l;
            l = l * k * o;
            i = i * k * o;
            if (!ig.perf.skipDmgModifiers) {
                l = l * (0.95 + Math.random() * 0.1);
                i = i * (0.95 + Math.random() * 0.1)
            }
            if (e.limiter.noDmg) i = l = 0;
            l = Math.round(l);
            return {
                damage: l,
                defReduced: i,
                offensiveFactor: k,
                baseOffensiveFactor: h,
                defensiveFactor: g,
                critical: n,
                status: m
            }
        },
		applyDamage: function(a, b, c) {
            var d = c.getCombatantRoot(),
                c = c.combo || d.combo;
            if (c.damageCeiling) {
                d = this.combatant.id;
                c.damageCeiling.sum[d] || (c.damageCeiling.sum[d] =
                    0);
                c.damageCeiling.sum[d] = c.damageCeiling.sum[d] + a.baseOffensiveFactor
            }
            a.status && this.statusStates[!!b.element ? b.element - 1 : 4].inflict(a.status, this, b);
            this.reduceHp(a.damage)
        }
	});
	sc.StatusViewCombatArtsEntry.inject({
		init: function(a, b) {
			this.parent(a, b);
            this.setSize(512, 41);
            this.info = b;
            this.addText("lvl", 9, 2);
            this.icon = new ig.ImageGui(this.skillIcons, b.icon % 10 * 24, Math.floor(b.icon / 10) * 24, 24, 24);
            this.icon.setPos(3, 12);
            this.addChildGui(this.icon);
            this.level = new sc.NumberGui(9, {
                size: sc.NUMBER_SIZE.LARGE
            });
            this.level.setNumber(a);
            this.level.setPos(25,
                3);
            this.addChildGui(this.level);
            this.name = new sc.TextGui("\\c[3]" + b.name + "\\c[0]");
            this.name.setPos(40, -1);
            this.addChildGui(this.name);
            this.description = new sc.TextGui(b.description, {
                maxWidth: 460,
                font: sc.fontsystem.smallFont,
                linePadding: -3
            });
            this.description.setPos(40, 17);
            this.addChildGui(this.description);
            var c = 168,
                c = c + (this.addText("sp", c, 2).x + 3);
            this.sp = new sc.NumberGui(9);
            this.sp.setNumber(sc.PLAYER_SP_COST[a - 1]);
            this.sp.setPos(c, 3);
            this.addChildGui(this.sp);
            c = c + 13;
            c = c + (this.addText("dmgType",
                c, 2).x + 3);
            this.dmgType = new sc.TextGui(this.getDamageType(b.dmgType));
            this.dmgType.setPos(c, -1);
            this.addChildGui(this.dmgType);
            c = c + (this.dmgType.hook.size.x + 5);
            if (b.stunType || b.status && sc.menu.statusElement != 0) c = c + (this.addText("effects", c, 2).x + 2);
            if (b.stunType) {
                this.stunType = new sc.TextGui(this.getStunType(b.stunType));
                this.stunType.setPos(c, -1);
                this.addChildGui(this.stunType);
                c = c + (this.stunType.hook.size.x + 6)
            }
            if (b.status && sc.menu.statusElement == 0) {
                this.condition = new sc.TextGui("\\i[status-cond-0]" + ig.lang.get("sc.gui.menu.status.inflicts") + " " + ig.lang.get("sc.gui.menu.status.conditions")[0]);
                this.condition.setPos(c, -1);
                this.addChildGui(this.condition)
            }
        }
	});
	sc.SimpleStatusDisplay = sc.SimpleStatusDisplay.extend({
		init: function(a, b, c, d, i, j, k, l, x, y, z) {
            if (x) {
            	this.newGfx = new ig.Image(x);
            	this.offX = y || 0;
            	this.offY = z || 0;
            }
            this.parent(a, b, c, d, i, j, k, l);
        },
		updateDrawables: function(b) {
            var c = 0,
                d = this.lineID * 12;
            if (this.noPercentMode) {
                a.x =
                    this.simpleMode ? 144 : 0;
                a.y = (this.simpleMode ? 408 : 329) + d;
                b.addGfx(this.gfx, 0, 0, a.x, a.y, 72, 11);
                b.addGfx(this.gfx, 72, 0, a.x + 11, a.y, 9, 11);
                b.addGfx(this.gfx, 81, 10, a.x + 81, a.y, this.simpleMode ? 46 : 89, 11)
            } else b.addGfx(this.gfx, 0, 0, this.simpleMode ? 144 : 0, (this.simpleMode ? 408 : 329) + d, this.width, 11);
            if (!!this.offX) {
				b.addGfx(this.newGfx, 0, 0, this.offX, this.offY, sc.MODIFIER_ICON_DRAW.SIZE, sc.MODIFIER_ICON_DRAW.SIZE)
            } else {
            	c = this.iconIndex.x * (sc.MODIFIER_ICON_DRAW.SIZE + 1);
            	d = this.iconIndex.y * (sc.MODIFIER_ICON_DRAW.SIZE + 1);
            	b.addGfx(this.gfx, 0, 0, sc.MODIFIER_ICON_DRAW.X + c, sc.MODIFIER_ICON_DRAW.Y + d, sc.MODIFIER_ICON_DRAW.SIZE, sc.MODIFIER_ICON_DRAW.SIZE)
            }
        }
	});
	sc.ItemEquipModifier.inject({
        _createStatusDisplay: function(b, a, d, c, e, f, g, h, i, j) {
        	var x = "",
        		y = 0,
        		z = 0
        	if (d.length > 9 && d.slice(0, 9) == "modifier." && e == -1) {
        		var modifier = sc.MODIFIERS[d.slice(9)];
	        	x = modifier.altSheet,
	        		y = modifier.offX,
	        		z = modifier.offY;
        	}
            d = new sc.SimpleStatusDisplay(ig.lang.get("sc.gui.menu.equip." + d), c, e, f, g, true, 126, h, x, y, z);
            d.setPos(b, a);
            d.annotation = {
                type: "INFO",
                content: {
                    title: "sc.gui.menu.equip.modifier." + i,
                    description: "sc.gui.menu.equip.descriptions." +
                        i
                },
                offset: {
                    x: -1,
                    y: -1
                },
                index: {
                    x: 0,
                    y: j + 8
                }
            };
            this.addChildGui(d);
            return d
        }
	});
	sc.EquipStatusContainer.inject({
        _createStatusDisplay: function(a, b, c, e, f, g, h, i, j, k, l, o) {
        	var x = "",
        		y = 0,
        		z = 0
        	if (c.length > 9 && c.slice(0, 9) == "modifier." && f == -1) {
        		var modifier = sc.MODIFIERS[c.slice(9)];
        		x = modifier.altSheet;
        		y = modifier.offX;
        		z = modifier.offY;
        	}
            g = new sc.SimpleStatusDisplay(ig.lang.get("sc.gui.menu.equip." + c), e, f, g, h, null, null, j, x, y, z);
            g.setPos(a, b);
            g.setCurrentValue(i);
            if (c == "res") {
                e == 1 && (c = "heat");
                e == 2 && (c = "cold");
                e == 3 && (c = "shock");
                e == 4 && (c = "wave")
            }
            l || (l = c);
            g.annotation = {
                type: "INFO",
                content: {
                    title: "sc.gui.menu.equip." + c,
                    description: "sc.gui.menu.equip.descriptions." + l
                },
                offset: {
                    x: -1,
                    y: -1
                },
                index: {
                    x: 0,
                    y: o != void 0 ? o + 8 : f
                }
            };
            k ? k.addChildGui(g) : this.addChildGui(g);
            return g
        }
	});
	ig.lang = new ig.Lang;
	sc.StatusViewModifiersContainer.inject({
		createLine: function(b, a, d, c, e) {
            var f = ig.lang.get("sc.gui.menu.equip.modifier." + b),
                g = ig.lang.get("sc.gui.menu.equip.descriptions." + b),
                a = new sc.StatusParamBar(f, g, 513, a, d, true, true, e, null, b);
            c && a.hideValues(true);
            this.entries[b] = a;
            this.list.addEntry(a,
                0);
            return a
        }
	});
	sc.StatusParamBar = sc.StatusParamBar.extend({
        init: function(a, b, c, e, f, g, h, i, j, k) {
            if (!!sc.MODIFIERS[k] && f == -1) {
        		var modifier = sc.MODIFIERS[k];
        		this.newGfx = new ig.Image(modifier.altSheet),
	        		this.offX = modifier.offX,
	        		this.offY = modifier.offY;
        	}
        	this.parent(a, b, c, e, f, g, h, i, j);
        },
        updateDrawables: function(a) {
            this.parent(a);
            var d = 0,
                c = this.lineID * 12,
                d = this.hook.size.x;
            if (this._hideAll) {
                a.addColor(b[this.lineID], 0,
                    10, 152, 1);
                a.addGfx(this.gfx, 152, 0, 71, 389, 13, 11);
                a.addColor(b[this.lineID], 165, 0, d - 244, 1)
            } else {
                a.addGfx(this.gfx, 0, 0, 0, 329 + c, 90, 11);
                a.addColor(b[this.lineID], 90, 0, d - 90 - 79, 1)
            }
            a.addGfx(this.gfx, d - 79, 0, 90, 329 + c, 79, 1);
            this.skipVertLine || a.addColor(b[this.lineID], 209 - (this._skillHidden ? 44 : 0), 0, 1, this.hook.size.y);
            if (this.usePercent && !this._hideAll) {
                a.addGfx(this.gfx, 107, 3, this._baseRed ? 9 : 0, 407, 8, 8);
                a.addGfx(this.gfx, 151, 3, this._equipRed ? 9 : 0, 407, 8, 8);
                this._skillHidden || a.addGfx(this.gfx, 195, 3, this._skillsRed ?
                    9 : 0, 407, 8, 8);
                if (sc.menu.statusDiff) {
                    a.addGfx(this.gfx, 151, 13, 0, 416, 8, 8);
                    this._skillHidden || a.addGfx(this.gfx, 195, 13, 0, 416, 8, 8)
                }
            }
            if (this.newGfx) {
            	a.addGfx(this.newGfx, 0, 0, this.offX, this.offY, 11, 11)
            } else {
	            d = this.iconIndex.x * 12;
	            c = this.iconIndex.y * 12;
	            a.addGfx(this.gfx, 0, 0, sc.MODIFIER_ICON_DRAW.X + d, sc.MODIFIER_ICON_DRAW.Y + c, 11, 11)
            }
        }
	});
});