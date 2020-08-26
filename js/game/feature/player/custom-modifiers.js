ig.module("game.feature.player.custom-modifiers").requires(
    "game.feature.player.modifiers").defines(function() {
    sc.MODIFIERS.MOTH_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 0,
        offY: 24,
        icon: -1,
        order: 200,
        noPercent: true
    };
    sc.MODIFIERS.DRILLER_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 36,
        offY: 24,
        icon: -1,
        order: 201,
        noPercent: true
    };
    sc.MODIFIERS.PHANTOM_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 24,
        offY: 24,
        icon: -1,
        order: 202,
        noPercent: true
    };
    sc.MODIFIERS.BLOB_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 12,
        offY: 24,
        icon: -1,
        order: 203,
        noPercent: true
    };
    sc.MODIFIERS.APE_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 48,
        offY: 24,
        icon: -1,
        order: 204,
        noPercent: true
    };
    sc.MODIFIERS.WHALE_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 60,
        offY: 24,
        icon: -1,
        order: 205,
        noPercent: true
    };
    sc.MODIFIERS.ARTIST_SPECIAL = {
        altSheet: "media/gui/master-arts.png",
        offX: 72,
        offY: 24,
        icon: -1,
        order: 206,
        noPercent: true
    };
    sc.MODIFIERS.WIND_MELEE = {
        altSheet: "media/gui/stun-status.png",
        offX: 96,
        offY: 0,
        icon: -1,
        order: 190
    };
    sc.MODIFIERS.STATUS_PUNISHER = {
        altSheet: "media/gui/extra-modifiers.png",
        offX: 0,
        offY: 0,
        icon: -1,
        order: 191
    };
});