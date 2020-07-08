ig.module("impact.feature.bgm.bgm-autumn-dng").requires("impact.feature.bgm.bgm").defines(function() {

    ig.merge(ig.BGM_TRACK_LIST, {
        autumnsGenesis: {
            "path": "media/bgm/muAutumnsgenesis.ogg",
            "loopEnd": 195.602,
            "volume": 2.5
        },
        titleAutumn: {
            "path": "media/bgm/muTitleautumn.ogg",
            "loopEnd": 37.419,
            "volume": 1
        },
        strikeHarder: {
            "introPath": "media/bgm/muStrikeharder-i.ogg",
            "path": "media/bgm/muStrikeharder.ogg",
            "introEnd": 19.209,
            "loopEnd": 180.006,
            "volume": 1.8
        },
        windwardSpirit: {
            "path": "media/bgm/muWindwardspirit.ogg",
            "loopEnd": 171,
            "volume": 1.8
        },
        autumnBoss: {
            "introPath": "media/bgm/muAutumnboss-i.ogg",
            "path": "media/bgm/muAutumnboss.ogg",
            "introEnd": 16,
            "loopEnd": 163,
            "volume": 2.2
        }
    });

    ig.merge(ig.BGM_DEFAULT_TRACKS, {
        autumnsGenesis: {
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
        }
    });
});