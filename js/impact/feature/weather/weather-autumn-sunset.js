ig.module("impact.feature.weather.weather-autumn-sunset").requires("impact.feature.weather.weather").defines(function() {
	ig.WEATHER_TYPES.AUTUMN_SUNSET = {
    blackCorners: {
      alpha: 0.3,
      time: 2,
      blinkAlpha: 0.5
    },
    lightMapDarkness: 0.3,
    darkness:0.15,
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
    darkness:0.3,
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
    darkness:0.45,
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
  }
});