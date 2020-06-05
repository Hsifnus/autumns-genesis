ig.module("game.feature.party.entities.party-member-entity-enhancements")
    .requires(
        "game.feature.party.entities.party-member-entity",
        "game.feature.party.party-member-model",
        "game.feature.player.player-config"
    ).defines(function() {
        sc.PartyMemberEntity.inject({
            lastAction: "",
            getBestElement: function() {
                if (this.model.preferredElement > 0) {
                    return this.model.preferredElement - 1;
                }
                if (!this.target ||
                    !this.model || !sc.model.player.getCore(sc.PLAYER_CORE.ELEMENT_CHANGE)) return sc.ELEMENT.NEUTRAL;
                var a = 0,
                    b = 1,
                    c = 1;
                if (Math.random() <= sc.EnemyAnno.getUnderstandFactor(this.target, this, 1))
                    for (var d = sc.EnemyAnno.getElement(this.target), e = this.target.params && this.target.params.getStat("elemFactor"), f = sc.ELEMENT_MAX + 1; f--;)
                        if (this.hasElement(f)) {
                            if (f == d || this.target.elementFilter && this.target.elementFilter == f) return f;
                            if (f && e && e[f - 1] >= b) {
                                if (e[f - 1] == b) {
                                    c++;
                                    if (Math.random() < 1 / c) continue
                                } else c = 1;
                                a = f;
                                b = e[f - 1]
                            }
                        } return a
            },
            doCombatArt: function() {
                if (this.currentCombatArt && this.currentCombatArt.actionKey === "GUARD_SPECIAL") {
                    this.timer.dodge = 1e6;
                    console.log("guard started");
                }
                this.parent();
            },
            update: function() {
                this.parent();
                if (this.lastAction) {
                    if ((this.currentAction && this.currentAction.name !== this.lastAction)
                        || !this.currentAction) {
                        var substrA = this.lastAction.substring(0, 12);
                        var substrB = this.lastAction.substring(0, 13);
                        var substrC = this.lastAction.substring(0, 14);
                        if (substrA === "DASH_SPECIAL"
                                || substrB === "GUARD_SPECIAL"
                                || substrB === "THROW_SPECIAL"
                                || substrC === "ATTACK_SPECIAL") {
                            this.timer.dodge = 0;
                        }
                    }
                }
                this.currentAction && (this.lastAction = this.currentAction.name);
            },
            setActionBlocked: function(a) {
                this.parent(a);
                if (!this.currentAction || !this.currentAction.name || this.currentAction.name.substring(0, 13) !== "GUARD_SPECIAL") {
                    this.timer.dodge = a.dash !== -1 ? (a.dash || 0) : 1e6;
                }
            }
        });
        sc.PartyMemberModel.inject({
            onLoadableComplete: function() {
                var a = this.config;
                this.name = a.name;
                this.clazz = a.clazz;
                this.combatStyle = a.combatStyle;
                this.walkAnims = a.walkAnims;
                this.character = a.character;
                this.defaultExpression = new sc.CharacterExpression(a.character.name, "DEFAULT");
                this.animSheet = a.animSheet;
                this.proxies = a.proxies;
                this.stats = a.stats;
                this.baseConfig = a.baseConfig;
                this.elementConfigs = a.elementConfigs;
                this.skillRanking = a.skillRanking;
                this.updateStats();
                this.preferredElement = sc.ELEMENT[a.preferredElement] != undefined ? sc.ELEMENT[a.preferredElement] + 1 : 0;
            }
        });
        sc.PlayerConfig.inject({
            preferredElement: 0,
            onload: function(a) {
                var b;
                b = ig.jsonTemplate.resolve(a);
                if (!b) throw Error("Can't find data of player '" + f + "'");
                this.preferredElement = b.preferredElement;
                this.parent(a);
            }
        });
        ig.EVENT_STEP.SET_PARTY_MEMBER_PREFERRED_ELEMENT = ig.EventStepBase.extend({
            member: null,
            level: null,
            exp: null,
            updateEquipment: false,
            _wm: new ig.Config({
                attributes: {
                    member: {
                        _type: "String",
                        _info: "Party member to add",
                        _select: sc.PARTY_OPTIONS
                    },
                    element: {
                        _type: "String",
                        _info: "Element to set preference to",
                        _select: sc.ELEMENT
                    },
                    noPreference: {
                        _type: "Boolean",
                        _info: "Whether to not express any preference at all"
                    }
                }
            }),
            init: function(a) {
                this.member = a.member;
                this.element = a.element;
                this.noPreference = a.noPreference;
            },
            start: function() {
                var member = sc.party.getPartyMemberModel(this.member);
                member.preferredElement = this.noPreference ? 0 : sc.ELEMENT[this.element] + 1;
            }
        });
    });