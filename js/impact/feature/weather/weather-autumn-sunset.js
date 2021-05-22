ig.module("impact.feature.weather.weather-autumn-sunset").requires("impact.feature.weather.weather").defines(function() {
    ig.WEATHER_TYPES.LAB_STORAGE = {
        blackCorners: {
            alpha: 0.3,
            time: 2,
            blinkAlpha: 0.5
        },
        glowColor: "#302313",
        particles: [{
            type: "BLUE_SQUARES",
            quantity: 15
        }],
        outside: false
    };
    ig.WEATHER_TYPES.AUTUMN_SUNSET = {
        blackCorners: {
            alpha: 0.3,
            time: 2,
            blinkAlpha: 0.5
        },
        lightMapDarkness: 0.3,
        darkness: 0.15,
        glowColor: "#230000",
        particles: [{
            type: "LEAVES",
            quantity: 8
        }],
        outside: true
    };
    ig.WEATHER_TYPES.AUTUMN_SUNSET_RAIN_WEAK = {
        blackCorners: {
            alpha: 0.3,
            time: 2,
            blinkAlpha: 0.5
        },
        clouds: {
            density: 0.3,
            vel: {
                x: 90,
                y: 36
            },
            alpha: 0.24
        },
        rain: ig.RAIN_STRENGTH.WEAK,
        fog: {
            alpha: 0.3,
            vel: {
                x: 100,
                y: 40
            }
        },
        lightMapDarkness: 0.4,
        darkness: 0.3,
        glowColor: "#1d0000",
        particles: [{
            type: "LEAVES",
            quantity: 10
        }],
        outside: true
    };
    ig.WEATHER_TYPES.AUTUMN_SUNSET_RAIN_MEDIUM = {
        blackCorners: {
            alpha: 0.3,
            time: 2,
            blinkAlpha: 0.5
        },
        clouds: {
            density: 0.3,
            vel: {
                x: 90,
                y: 36
            },
            alpha: 0.24
        },
        darkness: 0.45,
        rain: ig.RAIN_STRENGTH.MEDIUM,
        fog: {
            alpha: 0.7,
            vel: {
                x: 100,
                y: 40
            }
        },
        lightMapDarkness: 0.5,
        glowColor: "#130000",
        particles: [{
            type: "LEAVES",
            quantity: 10
        }],
        outside: true
    };
    ig.RAIN_STRENGTH.WIND_LEFT_WEAK = {
        pattern: 7,
        windPattern: 1,
        move: {
            x: -150,
            y: 50
        },
        duration: 0.5,
        wait: 0.2,
        dropsPerSecond: 0,
        sound: null,
        alpha: 0.8,
        fade: 0.1
    };
    ig.RAIN_STRENGTH.WIND_LEFT_MEDIUM = {
        pattern: 7,
        windPattern: 3,
        move: {
            x: -250,
            y: 45
        },
        duration: 0.5,
        wait: 0.2,
        dropsPerSecond: 0,
        sound: null,
        alpha: 0.8,
        fade: 0.1
    };
    ig.RAIN_STRENGTH.WIND_RIGHT_WEAK = {
        pattern: 7,
        windPattern: 2,
        move: {
            x: 150,
            y: 50
        },
        duration: 0.5,
        wait: 0.2,
        dropsPerSecond: 0,
        sound: null,
        alpha: 0.8,
        fade: 0.1
    };
    ig.RAIN_STRENGTH.WIND_RIGHT_MEDIUM = {
        pattern: 7,
        windPattern: 4,
        move: {
            x: 250,
            y: 45
        },
        duration: 0.5,
        wait: 0.2,
        dropsPerSecond: 0,
        sound: null,
        alpha: 0.8,
        fade: 0.1
    };
    ig.WEATHER_TYPES.FINAL_DNG_SPECIAL = {
        blackCorners: {
            alpha: 0.45,
            time: 2,
            blinkAlpha: 0.5
        },
        fog: {
            alpha: 0.6,
            vel: {
                x: 0,
                y: -30
            },
            zoom: 1
        },
        darkness: 0.3,
        lightMapDarkness: 0.3,
        glowColor: "#101210",
        particles: [{
            type: "FINAL_STAR",
            quantity: 7
        }, {
            type: "FINAL_WHIRL",
            quantity: 10
        }, {
            type: "FINAL_GLOW",
            quantity: 15
        }]
    };
    ig.WEATHER_TYPES.FINAL_DNG_SPECIAL_BATTLE = {
        blackCorners: {
            alpha: 0.45,
            time: 2,
            blinkAlpha: 0.5
        },
        fog: {
            alpha: 0.6,
            vel: {
                x: 0,
                y: -30
            },
            zoom: 1
        },
        darkness: 0.2,
        lightMapDarkness: 0.3,
        glowColor: "#1F1A24",
        particles: [{
            type: "FINAL_STAR",
            quantity: 7
        }, {
            type: "FINAL_WHIRL_FAST",
            quantity: 20
        }, {
            type: "FINAL_GLOW",
            quantity: 15
        }]
    };
    ig.ENV_PARTICLES.FINAL_STAR = {
        animSheet: {
            sheet: {
                "src": "media/entity/enemy/boss/gynthar-spear.png",
                "xCount": 1,
                "offX": 112,
                "offY": 32,
                "width": 16,
                "height": 16
            },
            renderMode: "lighter",
            SUB: [{
                name: "big",
                frames: [0, 1, 2, 1],
                time: 0.2,
                repeat: true,
            }, {
                name: "medium",
                frames: [0, 1, 2, 1],
                time: 0.18,
                repeat: true,
            }, {
                name: "small",
                frames: [0, 1, 2, 1],
                time: 0.16,
                repeat: true,
            }]
        },
        speed: 13,
        speedVariance: 10,
        dir: {
            x: -1,
            y: -1
        },
        rotateToDir: 0.25,
        randomFlip: {
            x: true,
            y: true
        },
        randomRotate: 0.12,
        time: 5,
        timeVariance: 0,
        fadeTime: 0.5,
        levels: [{
            scale: 0.2,
            anim: "small"
        }, {
            scale: 0.4,
            anim: "medium"
        }, {
            scale: 0.6,
            anim: "big"
        }]
    };
});