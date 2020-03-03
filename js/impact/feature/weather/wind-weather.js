ig.module("impact.feature.weather.wind-weather").requires(
	"impact.feature.weather.wind",
	"impact.feature.weather.rain",
	"impact.feature.weather.weather"
	).defines(function() {
	var m = 0,
        n = 0;
    ig.Rain.inject({
        windGfx: new ig.ImagePatternSheet("media/map/wind.png", ig.ImagePattern.OPT.REPEAT_X_AND_Y, 128, 128),
        draw: function() {
            if (ig.perf.weather && sc.options.get("weather")) {
                var a = ig.system.context.globalAlpha;
                ig.system.context.globalCompositeOperation = "lighter";
                for (var b = this.entries.length; b--;) {
                    var e = this.entries[b],
                        f = this.gfx.getPattern(e.pattern),
                        g = 1;
                    e.timer < e.fade ? g = e.timer / e.fade : e.timer > e.maxTime - e.fade && (g = (e.maxTime - e.timer) / e.fade);
                    g = g * e.alpha;
                    ig.system.context.globalAlpha = a * g;
                    f.draw(0, 0, -e.pos.x +
                        ig.game.screen.x, -e.pos.y + ig.game.screen.y, ig.system.width, ig.system.height);
                    e.windPattern && this.windGfx.getPattern(e.windPattern-1).draw(0, 0, -e.pos.x +
                        ig.game.screen.x, -e.pos.y + ig.game.screen.y, ig.system.width, ig.system.height);
                }
                ig.system.context.globalAlpha = a;
                ig.system.context.globalCompositeOperation = "source-over"
            }
        },
        spawnRain: function() {
            var d = Math.random() * 0.75 + 0.25;
            n = n + d * 128;
            m = m + (1 - d) * 128;
            this.entries.push({
                timer: this.strength.duration,
                maxTime: this.strength.duration,
                pos: {
                    x: n,
                    y: m
                },
                move: this.strength.move,
                alpha: this.strength.alpha || 0.2,
                fade: this.strength.fade || 0.025,
                pattern: this.strength.pattern,
                windPattern: this.strength.windPattern
            })
        },
    });
    ig.Weather.inject({
        onLevelLoadStart: function(b) {
            this.levelWeather && this.levelWeather.decreaseRef();
            this.levelWeather = b.attributes && b.attributes.weather ? new ig.WeatherInstance(b.attributes.weather || "NONE") : new ig.WeatherInstance("NONE");
            this.levelWeather.config.glowColor ? ig.light.setMainGlowColor(this.levelWeather.config.glowColor) :
                ig.light.setMainGlowColor(null);
            sc.WindData.victims.length && new ig.EVENT_STEP.SET_WIND_ON_ENTITIES({
                entities: [],
                strength: "NONE",
                immediately: true
            }).start();
        }
    });
});