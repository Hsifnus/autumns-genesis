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
});