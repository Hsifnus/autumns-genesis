import "./js/game/feature/arena/trial.js";

import "./js/game/feature/arena/trial-cup-overview.js";

import "./js/game/feature/arena/trial-gui.js";

import "./js/game/feature/arena/trial-list.js";

import "./js/game/feature/arena/trial-misc.js";

import "./js/game/feature/arena/trial-round-page.js";

import "./js/game/feature/arena/trial-start-gui.js";

import "./js/game/feature/arena/trial-steps.js";

import "./js/game/feature/combat/custom-sweep.js";

import "./js/game/feature/combat/entities/combat-proxy-move-rotate.js";

import "./js/game/feature/combat/entities/custom-food-icon.js";

import "./js/game/feature/combat/fancy-aim-fix.js";

import "./js/game/feature/combat/item-buffs-plus.js";

import "./js/game/feature/combat/manual-combatant-kill-dead.js";

import "./js/game/feature/combat/part-hit-proxy-fix.js";

import "./js/game/feature/combat/set-attrib-closest-entity-fix.js";

import "./js/game/feature/combat/true-target.js";

import "./js/game/feature/combat/model/enemy-tracker-access.js";

import "./js/game/feature/combat/model/is-elemental-weakness.js";

import "./js/game/feature/combat/model/proxy-nearby.js";

import "./js/game/feature/combat/model/spite-status.js";

import "./js/game/feature/combat/model/stun-status.js";

import "./js/game/feature/font/font-system-override.js";

import "./js/game/feature/gui/hud/special-party.js";

import "./js/game/feature/gui/screen/title-screen-autumn.js";

import "./js/game/feature/map-content/cave-map-style.js";

import "./js/game/feature/party/entities/party-member-entity-enhancements.js";

import "./js/game/feature/player/coquelicot-player.js";

import "./js/game/feature/player/custom-modifiers.js";

import "./js/game/feature/player/food-velocity-exploit-fix.js";

import "./js/game/feature/puzzle/entities/wind-bubble.js";

import "./js/game/feature/puzzle/rain-super-bombs.js";

import "./js/game/feature/skills/master-skills.js";

import "./js/impact/feature/bgm/bgm-autumn-dng.js";

import "./js/impact/feature/influencer/pressure-status.js";

import "./js/impact/feature/weather/weather-autumn-sunset.js";

import "./js/impact/feature/weather/wind.js";

import "./js/impact/feature/weather/wind-aim.js";

import "./js/impact/feature/weather/wind-weather.js";

class Coquelicot {
    constructor() {
        this._init();
    }

    _init() {
        this._addPartyMember();
    }

    _addPartyMember() {
        /*
         * The idea here is to add a new entry to the list of party members,
         * and then call the functions that reference that list to reinit the
         * list of data. The way I've implemented this *should* allow for
         * multiple concurrent new party member mods to exist and work correctly
         * with each other.
         */
        sc.PARTY_OPTIONS.push("Coquelicot");
    }
}

new Coquelicot();