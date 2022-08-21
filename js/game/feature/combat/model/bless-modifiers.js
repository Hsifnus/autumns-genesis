ig.module("game.feature.combat.model.bless-modifiers").requires(
    "game.feature.combat.model.combat-status",
    "game.feature.combat.gui.status-bar",
    "game.feature.combat.entities.combatant")
  .defines(function() {
  	const getElementMode = (combatant) => combatant && combatant.model ? combatant.model.currentElementMode || 0 : 0;
  	sc.CombatParams.inject({
  		getModifier: function(a) {
  			const result = this.parent(a);
  			if (this.combatant && (!this.combatant.isPlayer || sc.model.player.getCore(sc.PLAYER_CORE.MODIFIER)) && this.modifiers) {
				if (this.modifiers["TRI_SPECIAL"] >= 1 && getElementMode(this.combatant) === sc.ELEMENT.HEAT && a === "GUARD_STRENGTH") {
	        		return result - 0.3;
	        	}
	        	if (this.modifiers["QUADRO_SPECIAL"] >= 1 && getElementMode(this.combatant) === sc.ELEMENT.COLD && a === "MOMENTUM") {
	        		return result - 0.1;
	        	}
	        	if (this.modifiers["PENTA_SPECIAL"] >= 1 && getElementMode(this.combatant) === sc.ELEMENT.SHOCK && a === "AIM_STABILITY") {
	        		return result - 0.3;
	        	}
	        	if (this.modifiers["HEXA_SPECIAL"] >= 1 && getElementMode(this.combatant) === sc.ELEMENT.WAVE && a === "CRITICAL_DMG") {
	        		return result - 0.3;
	        	}
	        	if (this.modifiers["GYNTHAR_SPECIAL"] >= 1 && (a === "COND_HEALING" || a === "OVERHEAT_REDUCTION")) {
	        		return result + 0.3;
	        	}
  			}
        	return result;
        }
  	})
  	ig.ENTITY.Combatant.inject({
  		isShielded: function(a, b, c, d) {
          const shieldConnections = this.shieldsConnections.map(shieldConnection => ig.copy(shieldConnection));
          for (var c = c && c.partName, e = shieldConnections.length, f = sc.SHIELD_RESULT.NONE; e--;) {
            var g = shieldConnections[e],
              n = g.shield;
            if (this.params.getModifier("QUADRO_SPECIAL") >= 1 && getElementMode(this) === sc.ELEMENT.COLD) {
              if (g.isPerfect()) {
                n.strength = sc.SHIELD_STRENGTH.BLOCK_ALL;
              }
              n.hitResist = sc.ATTACK_TYPE.MASSIVE;
              n.stableOverride = sc.ATTACK_TYPE.MASSIVE;
            }
            if (n.strength != sc.SHIELD_STRENGTH.BLOCK_ALL && b.guardable != sc.GUARDABLE.ALWAYS) {
              if (b.guardable == sc.GUARDABLE.NEVER) continue;
              if (b.guardable ==
                sc.GUARDABLE.FROM_ABOVE && n.strength != sc.SHIELD_STRENGTH.BLOCK_ABOVE) continue;
              if (n.hitResist < b.type) continue
            }
            if (n.isActive(this, a, b, c, g.isPerfect()) && n.getDamageFactor(b, this) < 1) {
              if (n.neutralize) return sc.SHIELD_RESULT.NEUTRALIZE;
              if (d) {
                  if (n.stableOverride > d.hitStable) d.hitStable = n.stableOverride;
                  d.damageFactor = g.isPerfect() ? 0 : d.damageFactor * n.getDamageFactor(b, this)
              }
              f = Math.max(f, g.isPerfect() ? sc.SHIELD_RESULT.PERFECT : sc.SHIELD_RESULT.REGULAR)
            }
          }
          return f
        },
        onTargetHit: function(a, b, c) {
        	if (b.spFactor && this.params.getModifier("PENTA_SPECIAL") >= 1 && getElementMode(this) === sc.ELEMENT.SHOCK && this.isPlayer && this.dashAttackCount) {
        		b.spFactor *= 1.35;
        	}
        	this.parent(a, b, c);
        }
  	});
  	sc.STAT_CHANGE_SETTINGS["ATTACK-TRI"] = {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.ATTACK,
        value: 1.4,
        icon: "stat-attack",
        grade: "stat-rank-3"
    };
  	sc.Combat.inject({
        triBuffEffects: null,
        init: function() {
        	this.triBuffEffects = {
	            sheet: new ig.EffectSheet("specials.master")
	        };
        	this.parent();
        },
        onCombatantDeathHit: function(a, b) {
            if (b.party == sc.COMBATANT_PARTY.ENEMY && a && a.getCombatantRoot) {
            	const root = a.getCombatantRoot();
  				if (root.params.getModifier("TRI_SPECIAL") >= 1 && getElementMode(root) === sc.ELEMENT.HEAT) {
                	const newBuff = new sc.ItemBuffPlus(["ATTACK-TRI"], 10, -1, "triBuff");
	                var d = root.params.buffs.filter(e => e.name === "triBuff");
	                if (d.length > 0) {
	                	root.params.removeBuff(d[0]);
	                    root.params.addBuff(newBuff);
	                } else {
	                    root.params.addBuff(newBuff);
	                }
	                this.triBuffEffects.sheet.spawnOnTarget('triAttackBuff', root, {
		                offset: {
                			x: 0,
			                y: 0,
			                z: 0
			            },
		                align: "BOTTOM",
		                group: "triAttackBuff",
		                duration: 1
		            });
                }
  			}
            this.parent(a, b);
        },
  	});
  	sc.ENEMY_REACTION.HIT_REACTION.inject({
        triBuffEffects: null,
        init: function(a, b) {
        	this.triBuffEffects = {
	            sheet: new ig.EffectSheet("specials.master")
	        };
        	this.parent(a, b);
        },
  		hitApply: function(a, b, c, e, f) {
  			var root;
  			if ((root = b.getCombatantRoot()) && root.party == sc.COMBATANT_PARTY.PLAYER && this.dramaticEffect && this.dramaticEffect.break) {
                if (root.params.getModifier("TRI_SPECIAL") >= 1 && getElementMode(root) === sc.ELEMENT.HEAT) {
                	const newBuff = new sc.ItemBuffPlus(["ATTACK-TRI"], 10, -1, "triBuff");
	                var d = root.params.buffs.filter(e => e.name === "triBuff");
	                if (d.length > 0) {
	                	root.params.removeBuff(d[0]);
	                    root.params.addBuff(newBuff);
	                } else {
	                    root.params.addBuff(newBuff);
	                }
	                this.triBuffEffects.sheet.spawnOnTarget('triAttackBuff', root, {
		                offset: {
                			x: 0,
			                y: 0,
			                z: 0
			            },
		                align: "BOTTOM",
		                group: "triAttackBuff",
		                duration: 1
		            });
                }
            }
            this.parent(a, b, c, e, f);
        }
  	});
  	sc.ENEMY_TRACKER.HIT.inject({
		onConditionEval: function(b, a, d, c) {
            if (d && d.damagingEntity) {
            	const damager = d.damagingEntity.getCombatantRoot();
            	if (damager && damager.params && damager.params.getModifier("HEXA_SPECIAL") >= 1 && getElementMode(damager) === sc.ELEMENT.WAVE) {
            		if (this.scaleDmgFactor) {
            			if (d.damageResult) {
            				d.damageResult.baseOffensiveFactor *= 1.3;
            			}
            		} else {
            			this.current = this.current + 0.5;
            		}
            	}
            }
            return this.parent(b, a, d, c);
        }
  	});
  	sc.ENEMY_TRACKER.HP.inject({
		onConditionEval: function(b, a, d, c) {
            if (d && d.damagingEntity) {
            	const damager = d.damagingEntity.getCombatantRoot();
            	if (damager && damager.params && damager.params.getModifier("HEXA_SPECIAL") >= 1 && getElementMode(damager) === sc.ELEMENT.WAVE) {
            		if (d.damageResult) {
        				d.damageResult.damage *= 1.3;
        			}
            	}
            }
            return this.parent(b, a, d, c);
        }
  	});
});