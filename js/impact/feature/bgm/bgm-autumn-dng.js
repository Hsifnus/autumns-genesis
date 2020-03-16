ig.module("impact.feature.bgm.bgm-autumn-dng").requires("impact.feature.bgm.bgm").defines(function() {
    ig.BGM_DEFAULT_TRACKS.autumnsGenesis = {
        field: {
            track: "autumnsGenesis",
            volume: 1
        },
        battle: {
            track: "tutorial-battle",
            volume: 1
        },
        rankBattle: {
            track: "fieldBattle",
            volume: 1
        },
        sRankBattle: {
            track: "s-rank",
            volume: 1
        }
    };
});