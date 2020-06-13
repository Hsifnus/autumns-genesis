ig.module("game.feature.gui.screen.title-screen-autumn").requires("game.feature.gui.screen.title-screen", "impact.feature.bgm.bgm-autumn-dng").defines(function() {
    ig.Bgm.preloadStartTrack("titleAutumn");
    sc.TitleScreenGui.inject({
        init: function() {
            this.parent();
            this.hook.zIndex = 1E3;
            this.hook.size.x = ig.system.width;
            this.hook.size.y = ig.system.height;
            this.screenInteract =
                new sc.ScreenInteractEntry(this);
            this.bgGui = new ig.ParallaxGui({
                parallax: "title-autumn"
            }, this._bgCallback.bind(this));
            this.addChildGui(this.bgGui);
            this.startGui = new sc.TitleScreenStartGui;
            this.addChildGui(this.startGui);
            this.buttons = new sc.TitleScreenButtonGui;
            this.addChildGui(this.buttons);
            this.versionGui = new sc.TextGui(sc.version.toString(), {
                font: sc.fontsystem.tinyFont
            });
            this.versionGui.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
            this.versionGui.setPos(2, 0);
            this.versionGui.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.EASE
                },
                HIDDEN: {
                    state: {
                        alpha: 0
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.versionGui.doStateTransition("HIDDEN", true);
            this.addChildGui(this.versionGui);
            this.introGui = new ig.GUI.IntroScreen(this._introDone.bind(this));
            this.addChildGui(this.introGui);
            sc.Model.addObserver(sc.model, this);
            sc.Model.addObserver(sc.menu, this);
            this.doStateTransition("HIDDEN", true)
        }
    });
});
