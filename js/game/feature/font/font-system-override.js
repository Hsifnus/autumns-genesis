ig.module("game.feature.font.font-system-override").requires("game.feature.font.font-system").defines(function() {
    sc.FONT_COLORS = {
        RED: 1,
        GREEN: 2,
        PURPLE: 3,
        GREY: 4,
        ORANGE: 5
    };
    sc.ICON_BINDINGS = {
        o: [0, 0],
        x: [0, 1],
        "<": [0, 2],
        ">": [0, 3],
        tech: [0, 4],
        general: [0, 7],
        "interface": [0, 8],
        video: [0, 9],
        audio: [0, 10],
        assists: [0, 117],
        gamepad: [0, 81],
        controls: [0, 11],
        arena: [0, 139],
        lea: [0, 12],
        lea2: [0, 15],
        li: [0, 13],
        "item-news": [0, 14],
        lea3: [0, 16],
        quest: [0, 17],
        "quest-solve": [0, 18],
        "quest-fav": [0, 19],
        "quest-all": [0,
            20
        ],
        "quest-elite": [0, 78],
        "quest-elite-solve": [0, 79],
        exp: [0, 21],
        cp: [0, 92],
        credit: [0, 22],
        landmark: [0, 23],
        lore: [0, 24],
        loreNew: [0, 25],
        "lore-story": [0, 26],
        "lore-people": [0, 27],
        "lore-cross-lore": [0, 28],
        "lore-earth-lore": [0, 29],
        "lore-memories": [0, 30],
        "lore-others": [0, 31],
        "enemy-mecha": [0, 33],
        "enemy-avatars": [0, 32],
        "enemy-animals": [0, 34],
        "enemy-abstract": [0, 35],
        "enemy-mecha-boss": [0, 37],
        "enemy-avatars-boss": [0, 36],
        "enemy-animals-boss": [0, 38],
        "enemy-abstract-boss": [0, 39],
        "enemy-boss": [0, 40],
        "social-close": [0,
            42
        ],
        "social-contacts": [0, 41],
        "social-3": [0, 43],
        "stats-general": [0, 44],
        "stats-combat": [0, 45],
        "stats-items": [0, 46],
        "stats-exploration": [0, 47],
        "stats-arena": [0, 139],
        "stats-misc": [0, 48],
        "stats-quests": [0, 49],
        "arrow-percent": [0, 50],
        "element-neutral": [0, 51],
        "element-heat": [0, 52],
        "element-cold": [0, 53],
        "element-shock": [0, 54],
        "element-wave": [0, 55],
        "element-all": [0, 93],
        slash: [0, 56],
        "slash-highlight": [0, 57],
        "stats-log": [0, 58],
        "logs-TROPHY": [0, 59],
        "logs-LANDMARK": [0, 60],
        "logs-LORE": [0, 64],
        "logs-TRADER": [0, 62],
        "logs-QUEST": [0, 61],
        "logs-DROP": [0, 80],
        "area-rookie-harbor": [0, 67],
        "area-autumn-area": [0, 68],
        "area-autumn-fall": [0, 69],
        "area-bergen": [0, 71],
        "area-bergen-trails": [0, 70],
        "area-heat-area": [0, 72],
        "area-heat-village": [0, 73],
        "area-rhombus-sqr": [0, 74],
        "area-jungle": [0, 76],
        "area-jungle-city": [0, 77],
        "area-cold-dng": [0, 94],
        "area-forest": [0, 99],
        "area-arid": [0, 100],
        "area-other": [0, 31],
        "toggle-item-off": [0, 101],
        "toggle-item-on": [0, 102],
        "toggle-item-off-grey": [0, 141],
        "toggle-item-on-grey": [0, 142],
        "toggle-item-off-radio": [0,
            114
        ],
        "toggle-item-on-radio": [0, 115],
        "toggle-item-off-radio-grey": [0, 143],
        "toggle-item-on-radio-grey": [0, 144],
        "save-star": [0, 145],
        "trophies-GENERAL": [0, 96],
        "trophies-COMBAT": [0, 97],
        "trophies-EXPLORATION": [0, 98],
        "party-TARGET-0": [0, 82],
        "party-TARGET-1": [0, 83],
        "party-TARGET-2": [0, 84],
        "party-BEHAVIOUR-0": [0, 85],
        "party-BEHAVIOUR-1": [0, 86],
        "party-BEHAVIOUR-2": [0, 87],
        "party-BEHAVIOUR-2-grey": [0, 140],
        "party-ARTS-0": [0, 88],
        "party-ARTS-1": [0, 89],
        "party-ARTS-2": [0, 90],
        "questHub-open": [0, 17],
        "questHub-active": [0,
            95
        ],
        "questHub-finished": [0, 18],
        "help-icon": [0, 91],
        "status-stun-1": [0, 107],
        "status-stun-2": [0, 108],
        "status-cond-0": [0, 146],
        "status-cond-1": [0, 103],
        "status-cond-2": [0, 104],
        "status-cond-3": [0, 105],
        "status-cond-4": [0, 106],
        "ancient-code-1": [0, 109],
        "ancient-code-2": [0, 110],
        "ancient-code-3": [0, 111],
        "ancient-code-4": [0, 112],
        "ancient-code-5": [0, 113],
        "arena-solo": [0, 27],
        "arena-team": [0, 41],
        "arena-medal-0": [0, 118],
        "arena-medal-1": [0, 119],
        "arena-medal-2": [0, 120],
        "arena-medal-3": [0, 121],
        "arena-medal-4": [0, 122],
        "arena-trophy-1": [0, 123],
        "arena-trophy-2": [0, 124],
        "arena-trophy-3": [0, 125],
        "arena-trophy-4": [0, 126],
        "arena-trophy-5": [0, 138],
        "diff-0": [0, 127],
        "diff-1": [0, 128],
        "diff-2": [0, 129],
        "diff-3": [0, 130],
        "diff-4": [0, 131],
        "diff-5": [0, 132],
        "diff-6": [0, 133],
        "arena-bolt-left": [0, 135],
        "arena-bolt-right": [0, 136],
        twitter: [0, 116]
    };
    sc.SMALL_ICON_BINDINGS = {
        "arrow-n": [0, 0],
        "arrow-e": [0, 1],
        "arrow-s": [0, 2],
        "arrow-w": [0, 3],
        "arrow-ne": [0, 4],
        "arrow-se": [0, 5],
        "arrow-sw": [0, 6],
        "arrow-nw": [0, 7],
        "quest-no": [0, 8],
        "quest-ok": [0, 9],
        "quest-mini-no": [0, 10],
        "quest-mini-ok": [0, 11],
        "break": [0, 12],
        "rank-up": [0, 13],
        lore: [0, 14],
        loreNew: [0, 15],
        insetArrow: [0, 16],
        burn: [0, 17],
        chill: [0, 18],
        jolt: [0, 19],
        mark: [0, 20],
        "stun-cancel": [0, 21],
        "star-icon": [0, 22],
        "diff-0": [0, 23],
        "diff-1": [0, 24],
        "diff-2": [0, 25],
        "diff-3": [0, 26],
        "diff-4": [0, 27],
        "diff-5": [0, 28],
        "diff-6": [0, 29],
        slash: [0, 30],
        "slash-highlight": [0, 31],
        times: [0, 32],
        timesRed: [0, 33],
        daze: [0, 34]
    };
    var d = {};
    d[ig.KEY.BACKSPACE] = 4;
    d[ig.KEY.TAB] = 93;
    d[ig.KEY.ESC] = 10;
    d[ig.KEY.SPACE] = 16;
    d[ig.KEY.MINUS] = 40;
    d[ig.KEY.ENTER] = 41;
    d[ig.KEY.PAUSE] = 42;
    d[ig.KEY.CAPS] = 43;
    d[ig.KEY.SHIFT] = 44;
    d[ig.KEY.PAGE_UP] = 45;
    d[ig.KEY.PAGE_DOWN] = 46;
    d[ig.KEY.END] = 47;
    d[ig.KEY.HOME] = 48;
    d[ig.KEY.ALT] = 49;
    d[ig.KEY.PERIOD] = 50;
    d[ig.KEY.DECIMAL] = 51;
    d[ig.KEY.COMMA] = 51;
    d[ig.KEY.DELETE] = 65;
    d[ig.KEY.INSERT] = 66;
    d[ig.KEY.CTRL] = 81;
    d[ig.KEY.ADD] = 82;
    d[ig.KEY.SUBSTRACT] = 83;
    d[ig.KEY.DIVIDE] = 84;
    d[ig.KEY.MULTIPLY] = 85;
    d[ig.KEY.UP_ARROW] = 77;
    d[ig.KEY.RIGHT_ARROW] = 78;
    d[ig.KEY.LEFT_ARROW] = 79;
    d[ig.KEY.DOWN_ARROW] = 80;
    d[ig.KEY._0] = 55;
    d[ig.KEY._1] = 56;
    d[ig.KEY._2] = 57;
    d[ig.KEY._3] = 58;
    d[ig.KEY._4] = 59;
    d[ig.KEY._5] =
        60;
    d[ig.KEY._6] = 61;
    d[ig.KEY._7] = 62;
    d[ig.KEY._8] = 63;
    d[ig.KEY._9] = 64;
    d[ig.KEY.NUMPAD_0] = 67;
    d[ig.KEY.NUMPAD_1] = 68;
    d[ig.KEY.NUMPAD_2] = 69;
    d[ig.KEY.NUMPAD_3] = 70;
    d[ig.KEY.NUMPAD_4] = 71;
    d[ig.KEY.NUMPAD_5] = 72;
    d[ig.KEY.NUMPAD_6] = 73;
    d[ig.KEY.NUMPAD_7] = 74;
    d[ig.KEY.NUMPAD_8] = 75;
    d[ig.KEY.NUMPAD_9] = 76;
    d[ig.KEY.BRACKET_CLOSE] = 87;
    d[ig.KEY.BACKSLASH] = 88;
    d[ig.KEY.EQUAL] = 89;
    d[ig.KEY.BRACKET_OPEN] = 86;
    d[ig.KEY.SINGLE_QUOTE] = 90;
    d[ig.KEY.SEMICOLON] = 52;
    d[ig.KEY.GRAVE_ACCENT] = 91;
    d[ig.KEY.SLASH] = 92;
    d[ig.KEY.A] = 0;
    d[ig.KEY.B] =
        13;
    d[ig.KEY.C] = 17;
    d[ig.KEY.D] = 2;
    d[ig.KEY.E] = 12;
    d[ig.KEY.F] = 18;
    d[ig.KEY.G] = 19;
    d[ig.KEY.H] = 14;
    d[ig.KEY.I] = 20;
    d[ig.KEY.J] = 21;
    d[ig.KEY.K] = 22;
    d[ig.KEY.L] = 23;
    d[ig.KEY.M] = 24;
    d[ig.KEY.N] = 25;
    d[ig.KEY.O] = 26;
    d[ig.KEY.P] = 27;
    d[ig.KEY.Q] = 11;
    d[ig.KEY.R] = 28;
    d[ig.KEY.S] = 1;
    d[ig.KEY.T] = 29;
    d[ig.KEY.U] = 30;
    d[ig.KEY.V] = 31;
    d[ig.KEY.W] = 3;
    d[ig.KEY.X] = 32;
    d[ig.KEY.Y] = 33;
    d[ig.KEY.Z] = 34;
    var c = {},
        e;
    for (e in d) c["keyCode-" + e] = [1, d[e]];
    var f = {
            "key-left": [1, 0],
            "key-down": [1, 1],
            "key-right": [1, 2],
            "key-up": [1, 3],
            "key-throw": [1, 5],
            "key-dash": [1,
                6
            ],
            mousewheel: [1, 7],
            "key-menu": [1, 9],
            "key-pause": [1, 10],
            "key-melee": [1, 31],
            "mouse-guard": [1, 6]
        },
        g = {
            left: [1, 0],
            down: [1, 1],
            right: [1, 2],
            up: [1, 3],
            aim: [1, 5],
            "throw": [1, 5],
            dash: [1, 6],
            guard: [1, 6],
            pause: [1, 7],
            back: [1, 4],
            special: [1, 16],
            select: [0, 0],
            help: [1, 14],
            help2: [1, 13],
            help3: [1, 17],
            help4: [1, 19],
            menu: [1, 9],
            quick: [1, 44],
            cold: [1, 56],
            shock: [1, 57],
            heat: [1, 58],
            wave: [1, 59],
            "arrow-left": [0, 5],
            "arrow-right": [0, 6],
            "arrow-left-off": [0, 65],
            "arrow-right-off": [0, 66],
            "circle-left": [1, 11],
            "circle-right": [1, 12],
            "list-up": [1,
                0
            ],
            "list-down": [1, 2],
            "page-left": [1, 0],
            "page-right": [1, 2],
            "skip-cutscene": [1, 19]
        },
        h = {
            "left-stick": [2, 0],
            "right-stick": [2, 1],
            "gamepad-left": [2, 8],
            "gamepad-down": [2, 9],
            "gamepad-right": [2, 10],
            "gamepad-up": [2, 11],
            "gamepad-l1": [2, 2],
            "gamepad-r1": [2, 3],
            "gamepad-l2": [2, 4],
            "gamepad-r2": [2, 5],
            "gamepad-pause": [2, 7],
            "gamepad-select": [2, 6],
            "gamepad-a": [2, 12],
            "gamepad-b": [2, 13],
            "gamepad-x": [2, 14],
            "gamepad-y": [2, 15],
            "left-stick-left": [2, 16],
            "left-stick-right": [2, 17],
            "left-stick-press": [2, 18],
            "right-stick-press": [2,
                19
            ],
            "gamepad-l1-off": [2, 20],
            "gamepad-r1-off": [2, 21]
        },
        i = {
            "left-stick": [2, 24],
            "right-stick": [2, 25],
            "gamepad-left": [2, 32],
            "gamepad-down": [2, 33],
            "gamepad-right": [2, 34],
            "gamepad-up": [2, 35],
            "gamepad-l1": [2, 26],
            "gamepad-r1": [2, 27],
            "gamepad-l2": [2, 28],
            "gamepad-r2": [2, 29],
            "gamepad-pause": [2, 31],
            "gamepad-select": [2, 30],
            "gamepad-a": [2, 36],
            "gamepad-b": [2, 37],
            "gamepad-x": [2, 38],
            "gamepad-y": [2, 39],
            "left-stick-left": [2, 40],
            "left-stick-right": [2, 41],
            "left-stick-press": [2, 42],
            "right-stick-press": [2, 43],
            "gamepad-l1-off": [2,
                44
            ],
            "gamepad-r1-off": [2, 45]
        },
        j = {},
        k = {
            left: "gamepad-left",
            down: "gamepad-down",
            right: "gamepad-right",
            up: "gamepad-up",
            aim: "right-stick",
            "throw": "gamepad-r1",
            dash: "gamepad-l1",
            guard: "gamepad-l1",
            pause: "gamepad-pause",
            back: "gamepad-b",
            special: "gamepad-r2",
            help: "gamepad-pause",
            help2: "gamepad-x",
            help3: "gamepad-y",
            help4: "right-stick-press",
            menu: "gamepad-select",
            quick: "gamepad-l2",
            heat: "gamepad-down",
            shock: "gamepad-right",
            cold: "gamepad-up",
            wave: "gamepad-left",
            "arrow-left": "gamepad-l1",
            "arrow-right": "gamepad-r1",
            "arrow-left-off": "gamepad-l1-off",
            "arrow-right-off": "gamepad-r1-off",
            "circle-left": "gamepad-l1",
            "circle-right": "gamepad-r1",
            "page-left": "gamepad-left",
            "page-right": "gamepad-right",
            "list-up": "gamepad-l2",
            "list-down": "gamepad-r2",
            "skip-cutscene": "gamepad-y"
        },
        l = {};
    sc.ITEMS_ICONS_MAPPING = {
        "item-default": [3, 0],
        "item-helm": [3, 1],
        "item-sword": [3, 2],
        "item-belt": [3, 3],
        "item-shoe": [3, 4],
        "item-items": [3, 5],
        "item-key": [3, 6],
        "item-trade": [3, 7],
        "item-toggle": [3, 8]
    };
    sc.FEAT_ICONS_MAPPING = {
        "feat-default": [3, 0]
    };
    sc.ITEMS_ICONS_MAPPING_RARITY = {};
    for (e = 0; e < 5; e++) {
        var o = (e + 1) * 9,
            m = "";
        switch (e) {
            case 0:
                m = "normal";
                break;
            case 1:
                m = "rare";
                break;
            case 2:
                m = "legend";
                break;
            case 3:
                m = "unique";
                break;
            case 4:
                m = "backer"
        }
        sc.ITEMS_ICONS_MAPPING_RARITY["item-default-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-helm-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-sword-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-belt-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-shoe-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-items-" +
            m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-key-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-trade-" + m] = [3, o++];
        sc.ITEMS_ICONS_MAPPING_RARITY["item-toggle-" + m] = [3, o++]
    }
    sc.GAMEPAD_ICON_STYLE = {
        XBOX: 0,
        PS3: 1
    };
    sc.LANGUAGE_ICON_MAPPING = {
        "language-0": [5, 1],
        "language-1": [5, 0],
        "language-2": [5, 3],
        "language-3": [5, 2],
        "language-4": [5, 4]
    };
    sc.FontSystem = ig.GameAddon.extend({
        gamepadIcons: false,
        icons: {
            global: new ig.Font("media/font/icons.png", 16, ig.MultiFont.ICON_START),
            globalSmall: new ig.Font("media/font/icons-small.png",
                14, ig.MultiFont.ICON_START),
            keyboard: new ig.Font("media/font/icons-keyboard.png", 16, ig.MultiFont.ICON_START),
            gamepad: new ig.Font("media/font/icons-gamepad.png", 16, ig.MultiFont.ICON_START),
            items: new ig.Font("media/font/icons-items.png", 16, ig.MultiFont.ICON_START),
            stats: new ig.Font("media/font/icons-buff.png", 8, ig.MultiFont.ICON_START),
            stats_large: new ig.Font("media/font/icons-buff-large.png", 16, ig.MultiFont.ICON_START),
            langs: new ig.Font("media/font/languages.png", 16, ig.MultiFont.ICON_START)
        },
        colors: {
            red: new ig.Image("media/font/colors/hall-fetica-bold-red.png",
                16),
            green: new ig.Image("media/font/colors/hall-fetica-bold-green.png", 16),
            purple: new ig.Image("media/font/colors/hall-fetica-bold-purple.png", 16),
            grey: new ig.Image("media/font/colors/hall-fetica-bold-grey.png", 16),
            orange_mid: new ig.Image("media/font/colors/hall-fetica-small-orange.png", 13),
            orange_tiny: new ig.Image("media/font/colors/tiny-orange.png", 7),
            purple_mid: new ig.Image("media/font/colors/hall-fetica-small-purple.png", 13),
            grey_mid: new ig.Image("media/font/colors/hall-fetica-small-grey.png",
                13),
            grey_tiny: new ig.Image("media/font/colors/tiny-grey.png", 7),
            red_mid: new ig.Image("media/font/colors/hall-fetica-small-red.png", 13),
            red_tiny: new ig.Image("media/font/colors/tiny-red.png", 7),
            green_mid: new ig.Image("media/font/colors/hall-fetica-small-green.png", 13),
            green_tiny: new ig.Image("media/font/colors/tiny-green.png", 7)
        },
        font: new ig.MultiFont("media/font/hall-fetica-bold.png", 16, 0),
        smallFont: new ig.MultiFont("media/font/hall-fetica-small.png", 13, 1),
        tinyFont: new ig.MultiFont("media/font/tiny.png",
            7, 2, "#cccccc"),
        switchIndex: 1,
        gamepadIconStyle: sc.GAMEPAD_ICON_STYLE.XBOX,
        init: function() {
            this.parent("FontSystem");
            this.font.pushIconSet(this.icons.global);
            this.font.pushIconSet(this.icons.keyboard);
            this.font.pushIconSet(this.icons.gamepad);
            this.font.pushIconSet(this.icons.items);
            this.font.pushIconSet(this.icons.stats_large);
            this.font.pushIconSet(this.icons.langs);
            this.tinyFont.pushIconSet(this.icons.stats);
            this.smallFont.pushIconSet(this.icons.globalSmall);
            this.updateGamepadSwapMap();
            this.font.setMapping(sc.ICON_BINDINGS);
            this.font.setMapping(f);
            this.font.setMapping(j);
            this.font.setMapping(g);
            this.font.setMapping(c);
            this.font.setMapping(sc.ITEMS_ICONS_MAPPING);
            this.font.setMapping(sc.ITEMS_ICONS_MAPPING_RARITY);
            this.font.setMapping(sc.STAT_CHANGE_ICONS_LARGE);
            this.font.setMapping(sc.LANGUAGE_ICON_MAPPING);
            this.smallFont.setMapping(sc.SMALL_ICON_BINDINGS);
            this.tinyFont.setMapping(sc.STAT_CHANGE_ICONS);
            this.font.pushColorSet(sc.FONT_COLORS.RED, this.colors.red, "#ff6969");
            this.font.pushColorSet(sc.FONT_COLORS.GREEN, this.colors.green, "#65ff89");
            this.font.pushColorSet(sc.FONT_COLORS.PURPLE, this.colors.purple, "#ffe430");
            this.font.pushColorSet(sc.FONT_COLORS.GREY, this.colors.grey, "#808080");
            this.smallFont.pushColorSet(sc.FONT_COLORS.GREY, this.colors.grey_mid, "#808080");
            this.smallFont.pushColorSet(sc.FONT_COLORS.RED, this.colors.red_mid, "#ff6969");
            this.smallFont.pushColorSet(sc.FONT_COLORS.GREEN, this.colors.green_mid, "#65ff89");
            this.smallFont.pushColorSet(sc.FONT_COLORS.PURPLE, this.colors.purple_mid, "#ffe430");
            this.smallFont.pushColorSet(sc.FONT_COLORS.ORANGE,
                this.colors.orange_mid, "#ff8932");
            this.tinyFont.pushColorSet(sc.FONT_COLORS.GREY, this.colors.grey_tiny, "#808080");
            this.tinyFont.pushColorSet(sc.FONT_COLORS.RED, this.colors.red_tiny, "#ff6969");
            this.tinyFont.pushColorSet(sc.FONT_COLORS.GREEN, this.colors.green_tiny, "#65ff89");
            this.tinyFont.pushColorSet(sc.FONT_COLORS.PURPLE, this.colors.orange_tiny, "#ffe430");
            this.gamepadIcons = false
        },
        changeKeyCodeIcon: function(a, b) {
            var c = f["key-" + a];
            c && (c[1] = d[b]);
            (c = g[a]) && (c[1] = d[b]);
            this.font.setMapping(d);
            this.gamepadIcons ||
                this.font.setMapping(g);
            this.font.callChangeListeners()
        },
        changeGamepadIcon: function(a, b) {
            k[a] = b;
            this.updateGamepadSwapMap();
            this.font.setMapping(j);
            this.gamepadIcons && this.font.setMapping(l);
            this.font.callChangeListeners()
        },
        setGamepadIconStyle: function(a) {
            this.gamepadIconStyle = a;
            this.updateGamepadSwapMap()
        },
        updateGamepadSwapMap: function() {
            var a = this.gamepadIconStyle ? i : h,
                b;
            for (b in a) j[b] = sc.SMALL_ICON_BINDINGS[b];
            for (b in k) l[b] = sc.SMALL_ICON_BINDINGS[k[b]]
        },
        hasIcon: function(a) {
            return sc.ICON_BINDINGS[a]
        },
        onVarsChanged: function() {
            var a = ig.input.currentDevice ==
                ig.INPUT_DEVICES.GAMEPAD;
            if (this.gamepadIcons != a)(this.gamepadIcons = a) ? this.font.setMapping(l) : this.font.setMapping(g)
        }
    });
    sc.fontsystem = new sc.FontSystem;
});