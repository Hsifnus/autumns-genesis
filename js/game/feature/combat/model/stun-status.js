ig.module("game.feature.combat.model.stun-status").requires(
        "game.feature.combat.model.combat-status",
        "game.feature.combat.gui.status-bar",
        "game.feature.combat.entities.combatant",
        "game.feature.combat.model.modifier-apply")
    .defines(function() {
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
                this.stallAction = new ig.Action("stallAction", [{
                    type: "WAIT_UNTIL",
                    condition: "0",
                    maxTime: this.duration
                }]);
                this.stallAction.hint = "battle";
                this.targetFixed = b instanceof ig.ENTITY.Enemy && b.targetFixed;
                b instanceof ig.ENTITY.Enemy && (b.targetFixed = true);
                this.stunTimer = 0;
            },
            cancelStun: function(b, a) {
                if (this.stunTimer < this.minDuration) {
                    return;
                }
                if (a.fly == "MASSIVE" ||
                    a.fly == "MASSIVE+" ||
                    a.fly == "MASSIVE++" ||
                    a.fly == "MASSIVE+++") {
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
            gfx: "media/gui/stun-status.png",
            init: null,
            barY: 0,
            barX: 0,
            half: true
        }

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
        sc.DAMAGE_MODIFIER_FUNCS.WIND_MELEE = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
            var n, applyDamageCallback,
                l = attackInfo.noHack || false,
                r = attackInfo.attackerParams.getStat("focus", l) / params.getStat("focus", l),
                v = (Math.pow(1 + (r >= 1 ? r - 1 : 1 - r) * cConst, aConst) - 1) * dConst;
            r = r >= 1 ? 1 + v : Math.max(0, 1 - v);
            !attackInfo.element && attackInfo.skillBonus == "MELEE_DMG" &&
                (n = attackInfo.attackerParams.getModifier("WIND_MELEE")) &&
                (attackInfo.statusInflict = attackInfo.statusInflict + r * 2 * n) &&
                (damageFactor = damageFactor + damageFactor * n);
            return {
                attackInfo,
                damageFactor,
                applyDamageCallback
            };
        };
    });