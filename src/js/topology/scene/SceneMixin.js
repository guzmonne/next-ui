(function (nx, util, global) {
    nx.define("nx.graphic.Topology.SceneMixin", {
        events: [],
        properties: {
            /**
             * @property scenes
             */
            scenes: {
                value: function () {
                    return {};
                }
            },
            /**
             * @property scenesQueue
             */
            scenesQueue: {
                value: function () {
                    return [];
                }
            },
            currentSceneName: {}
        },
        methods: {
            initScene: function () {
                this.watch("mode", function (prop, value) {
                    this.activateScene(value || "default");
                }, this);


                this.registerScene("default", "nx.graphic.Topology.DefaultScene");
                this.registerScene("selection", "nx.graphic.Topology.SelectionScene");
                this.registerScene("threeD", "nx.graphic.Topology.ThreeDLayer");
                this.registerScene("selectionNode", "nx.graphic.Topology.SelectionNodeScene");
                this.registerScene("zoomBySelection", "nx.graphic.Topology.ZoomBySelection");

            },
            /**
             * Register a scene to topology
             * @method registerScene
             * @param name {String} for reference to a certain scene
             * @param inClass <String,Class> A scene class name or a scene class instance, which is subclass of nx.graphic.Topology.Scene
             */
            registerScene: function (name, inClass) {
                var cls;
                if (name && inClass) {
                    var scene;
                    var scenes = this.scenes();
                    var scenesQueue = this.scenesQueue();
                    if (!util.isString(inClass)) {
                        scene = inClass;
                    } else {
                        cls = util.getByPath(inClass, global);
                        scene = new cls();
                    }
                    if (scene && scene.$type) {
                        scene.topology(this);
                        scenes[name] = {
                            content: scene,
                            index: scenesQueue.length
                        };
                        scenesQueue.push(scene);
                    }
                }
            },
            /**
             * Activate a scene, topology only has one active scene.
             * @method activateScene
             * @param name {String} Scene name which be passed at registerScene
             */
            activateScene: function (name) {
                var scenes = this.scenes();
                var sceneName = name || 'default';
                var scene = scenes[sceneName] || scenes["default"];
                //
                this.deactivateScene();
                this.currentScene = scene;
                this.currentSceneName(sceneName);

                scene.content.activate();
                this.fire("switchScene", {
                    name: name,
                    scene: scene
                });
            },
            /**
             * Deactivate a certain scene
             * @method deactivateScene
             */
            deactivateScene: function () {
                if (this.currentScene && this.currentScene.content.deactivate) {
                    this.currentScene.content.deactivate();

                }
                this.currentScene = null;
//                var sceneEventMaps = this.sceneEventMaps();
//                nx.each(sceneEventMaps, function (eve) {
//                    if (eve.owner == this) {
//
//                    } else {
//                        eve.owner.off(eve.name, eve.handler, eve.context);
//                    }
//                }, this);
//                //
//                this.sceneEventMaps([]);
            },
            /**
             * Show 3D topology view
             * @method show3DTopology
             */
            show3DTopology: function () {
                if (this.topologyDataCollection().length() != 1 && this.show3D() && THREE && window.WebGLRenderingContext) {
                    this.activateScene("threeD");
                }
            }
        }
    });
})(nx, nx.graphic.util, nx.global);