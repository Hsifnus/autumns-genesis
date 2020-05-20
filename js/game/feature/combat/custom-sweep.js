ig.module("game.feature.combat.custom-sweep").requires("game.feature.combat.combat-sweep").defines(function() {
    sc.COMBAT_SWEEPS.APE = {
        sheet: new ig.EffectSheet("enemies.ape-boss-ex"),
        keys: ["apeSweepHeat", "apeSweepHeat", "apeSweepHeat", "apeSweepHeat", "apeSweepHeat"],
        fxDuration: 0.3,
        force: {
            radius: 0,
            zHeight: 24,
            centralAngle: 0.6,
            duration: 0.3,
            attack: {
                type: "NONE",
                fly: "LIGHT",
                damageFactor: 0,
                spFactor: 0,
                skillBonus: "MELEE_DMG"
            },
            checkCollision: true
        }
    };
    sc.COMBAT_SWEEPS.COQUELICOT = {
        sheet: new ig.EffectSheet("combat.coquelicot"),
        keys: ["sweepNeutralFar", "sweepHeatFar", "sweepColdFar", "sweepShockFar", "sweepWaveFar"],
        fxDuration: -1,
        force: {
            radius: 75,
            zHeight: 24,
            centralAngle: 0.44,
            duration: 0.2,
            attack: {
                type: "HEAVY",
                visualType: "MEDIUM",
                fly: "HEAVY",
                damageFactor: 1.5,
                spFactor: 1,
                skillBonus: "MELEE_DMG",
                stunSteps: [{
                    type: "BLOCK_FALL",
                    duration: 0.15
                }]
            },
            checkCollision: true
        }
    };
    sc.COMBAT_SWEEPS.PHANTOM = {
        sheet: new ig.EffectSheet("enemies.shockboss-ex"),
        keys: ["phantomSweep", "phantomSweep", "phantomSweep", "phantomSweep", "phantomSweep"],
        fxDuration: 0.25,
        force: {
            radius: 192,
            zHeight: 24,
            centralAngle: 0.7,
            duration: 0.1,
            attack: {
                type: "HEAVY",
                fly: "HEAVY",
                damageFactor: 1.4,
                spFactor: 1,
                element: "SHOCK",
                guardable: "",
                hitInvincible: true,
                skillBonus: "MELEE_DMG",
                limiter: "NO_HIT_PROXY"
            },
            checkCollision: false
        }
    };
    sc.COMBAT_SWEEPS.PHANTOM_PLAYER = {
        sheet: new ig.EffectSheet("enemies.shockboss-ex"),
        keys: ["phantomSweep", "phantomSweep", "phantomSweep", "phantomSweep", "phantomSweep"],
        fxDuration: 0.25,
        force: {
            radius: 192,
            zHeight: 24,
            centralAngle: 0.7,
            duration: 0.1,
            attack: {
                type: "MASSIVE",
                fly: "HEAVY",
                damageFactor: 1.4,
                spFactor: 1,
                element: "SHOCK",
                guardable: "",
                hitInvincible: true,
                skillBonus: "MELEE_DMG",
                limiter: "",
                stunSteps: [{
                        type: "START_LOCK"
                    },
                    {
                        type: "BLOCK_XY"
                    }
                ]
            },
            checkCollision: false
        }
    };
});