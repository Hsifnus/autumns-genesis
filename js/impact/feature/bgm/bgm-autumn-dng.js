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
        strikeTruer: {
            "introPath": "media/bgm/muStriketruer-i.ogg",
            "path": "media/bgm/muStriketruer.ogg",
            "introEnd": 10.105,
            "loopEnd": 176.842,
            "volume": 1.8
        },
        monkBoss: {
            "path": "media/bgm/muMonkboss.ogg",
            "loopEnd": 180.699,
            "volume": 1.7
        },
        monkBoss2: {
            "introPath": "media/bgm/muMonkboss2-i.ogg",
            "path": "media/bgm/muMonkboss2.mp3",
            "introEnd": 21.2,
            "loopEnd": 180,
            "volume": 1.7
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
            "volume": 1.8
        },
        hazelTheme: {
            "path": "media/bgm/muHazeltheme.ogg",
            "loopEnd": 180,
            "volume": 1.8
        },
        crasher: {
            "introPath": "media/bgm/muCrasher-i.ogg",
            "path": "media/bgm/muCrasher.ogg",
            "introEnd": 58.445,
            "loopEnd": 147.661, 
            "volume": 1.8
        },
        godBossIntroOnly: {
            "path": "media/bgm/muGodBattle-i.mp3",
            "loopEnd": 1E10,
            "volume": 0.5
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