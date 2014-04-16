(function (nx, global) {


    nx.define("nx.graphic.Topology.Nav", nx.ui.Component, {
        properties: {
            topology: {
                get: function () {
                    return this.owner();
                }
            },
            scale: {},
            showIcon: {
                value: false
            },
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    this.resolve('@root').setStyle("display", value ? "" : "none");
                    this.resolve('@root').setStyle("pointer-events", value ? "all" : "none");
                    this._visible = value;
                }
            }
        },

        view: {
            props: {
                'class': 'n-topology-nav'
            },
            content: [
                {
                    tag: "ul",
                    content: [
                        {
                            tag: 'li',
                            content: {
                                name: 'mode',
                                tag: 'ul',
                                props: {
                                    'class': 'n-topology-nav-mode'
                                },
                                content: [
                                    {
                                        name: 'selectionMode',
                                        tag: 'li',
                                        content: {
                                            props: {
                                                'class': 'icon-toolbar_selectnode',
                                                style: '-webkit-transform: rotate(90deg)',
                                                title: "Select node mode"
                                            },
                                            tag: 'span'
                                        },
                                        events: {
                                            'mousedown': '{#_switchSelectionMode}',
                                            'touchstart': '{#_switchSelectionMode}'
                                        }

                                    },
                                    {
                                        name: 'moveMode',
                                        tag: 'li',
                                        props: {
                                            'class': 'n-topology-nav-mode-selected'
                                        },
                                        content: {
                                            props: {
                                                'class': 'icon-toolbar_movemode',
                                                title: "Move mode"

                                            },
                                            tag: 'span'
                                        },
                                        events: {
                                            'mousedown': '{#_switchMoveMode}',
                                            'touchstart': '{#_switchMoveMode}'
                                        }

                                    }
                                ]
                            }
                        },
                        {
                            tag: 'li',
                            props: {
                                'class': 'n-topology-nav-zoom'
                            },
                            content: [
                                {
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-bar'
                                    }
                                },
                                {
                                    name: 'zoomin',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-in icon-toolbar_zoomin',
                                        title: "Zoom out"
                                    },
                                    events: {
                                        'click': '{#_in}'
                                    }
                                },
                                {
                                    name: 'zoomball',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-ball',
                                        style: {
                                            top: 90
                                        }
                                    }
                                },
                                {
                                    name: 'zoomout',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-out icon-toolbar_zoomout',
                                        title: "Zoom in"
                                    },
                                    events: {
                                        'click': '{#_out}'
                                    }
                                }

                            ]
                        },
                        {
                            tag: 'li',
                            name: 'zoomselection',
                            props: {
                                'class': 'n-topology-nav-zoom-selection icon-toolbar_zoombyselection',
                                title: "Zoom by selection"
                            },
                            events: {
                                'click': '{#_zoombyselection}'
                            }
                        },
                        {
                            tag: 'li',
                            name: 'fit',
                            props: {
                                'class': 'n-topology-nav-fit icon-toolbar_fitstage',
                                title: "Fit stage"
                            },
                            events: {
                                'click': '{#_fit}'
                            }
                        },
//                        {
//                            tag: 'li',
//                            name: 'agr',
//                            props: {
//                                'class': 'n-icon-thumbnail-collapse-x16 n-topology-nav-agr',
//                                title: "Aggregation",
//                                visible: false
//                            },
//                            events: {
//                                'click': '{#_agr}'
//                            }
//                        },

                        {
                            tag: 'li',
                            name: 'fullscreen',
                            props: {
                                'class': 'n-topology-nav-full icon-toolbar_fullview',
                                title: 'Enter full screen mode'
                            },
                            events: {
                                'click': '{#_full}'
                            }
                        },
                        {
                            tag: 'li',
                            name: 'setting',
                            content: [
                                {
                                    name: 'icon',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-setting-icon icon-toolbar_viewsetting'
                                    },
                                    events: {
                                        mouseenter: "{#_openPopover}",
                                        mouseleave: "{#_closePopover}"
                                    }
                                },
                                {
                                    name: 'settingPopover',
                                    type: 'nx.ui.Popover',
                                    props: {
                                        title: 'Topology Setting',
                                        direction: "right",
                                        lazyClose: true
                                    },
                                    content: [
                                        {
                                            tag: 'h5',
                                            content: "Display icons as dots :"
                                        },
                                        {
                                            tag: 'label',
                                            content: [
                                                {
                                                    tag: 'input',
                                                    props: {
                                                        type: 'radio',
                                                        checked: '{#showIcon,converter=inverted,direction=<>}'
                                                    }
                                                },
                                                {
                                                    tag: 'span',
                                                    content: "Always"
                                                }
                                            ],
                                            props: {
                                                'class': 'radio-inline'
                                            }
                                        },
                                        {
                                            tag: 'label',
                                            content: [
                                                {
                                                    tag: 'input',
                                                    props: {
                                                        type: 'radio',
                                                        checked: '{#showIcon,direction=<>}'
                                                    }
                                                },
                                                {
                                                    tag: 'span',
                                                    content: "Auto-resize"
                                                }
                                            ],
                                            props: {
                                                'class': 'radio-inline'
                                            }
                                        },
                                        {
                                            tag: 'h5',
                                            content: [
                                                {
                                                    tag: 'span',
                                                    content: 'Display Label : '
                                                },
                                                {
                                                    tag: 'input',
                                                    props: {
                                                        'class': 'toggleLabelCheckBox',
                                                        type: 'checkbox',
                                                        checked: true
                                                    },
                                                    events: {
                                                        click: '{#_toggleNodeLabel}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            tag: 'h5',
                                            content: "Theme :"
                                        },
                                        {

                                            props: {
                                                'class': 'btn-group'
                                            },
                                            content: [
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'blue'
                                                    },
                                                    content: "Blue"
                                                },
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'green'
                                                    },
                                                    content: "Green"
                                                },
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'dark'
                                                    },
                                                    content: "Dark"
                                                },
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'slate'
                                                    },
                                                    content: "Slate"
                                                },
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'yellow'
                                                    },
                                                    content: "Yellow"
                                                }

                                            ],
                                            events: {
                                                'click': '{#_switchTheme}'
                                            }
                                        },
                                        {
                                            name: 'customize'
                                        }
                                    ],
                                    events: {
                                        'open': '{#_openSettingPanel}',
                                        'close': '{#_closeSettingPanel}'
                                    }
                                }
                            ],
                            props: {
                                'class': 'n-topology-nav-setting'
                            }
                        }
                    ]
                }
            ]
        },
        methods: {
            init: function (args) {
                this.inherited(args);


                this.view('settingPopover').view().dom().addClass('n-topology-setting-panel');


                if (window.top.frames.length) {
                    this.view("fullscreen").style().set("display", 'none');
                }
            },
            attach: function (args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('scale', function (prop, scale) {
                    var maxScale = topo.maxScale();
                    var minScale = topo.minScale();
                    var navBall = this.resolve("zoomball").resolve('@root');
                    var step = 65 / (maxScale - minScale);
                    navBall.setStyles({
                        top: 72 - (scale - minScale) * step + 14
                    });
                }, this);
                topo.notify('scale');
            },
            _switchSelectionMode: function (sender, event) {
                this.view("selectionMode").dom().addClass("n-topology-nav-mode-selected");
                this.view("moveMode").dom().removeClass("n-topology-nav-mode-selected");

                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'selection') {
                    topo.activateScene('selection');
                    this._prevSceneName = currentSceneName;
                }


            },
            _switchMoveMode: function (sender, event) {
                this.view("selectionMode").dom().removeClass("n-topology-nav-mode-selected");
                this.view("moveMode").dom().addClass("n-topology-nav-mode-selected");

                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName == 'selection') {
                    topo.activateScene(this._prevSceneName || 'default');
                    this._prevSceneName = null;
                }
            },
            _fit: function (sender, event) {
                this.topology().fit();
            },
            _zoombyselection: function (sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                var scene = topo.activateScene('zoomBySelection');
                var icon = sender;
                scene.upon('finish', function fn(sender, bound) {
                    if (bound) {
                        topo.zoomByBound(topo.getInsideBound(bound));
                    }
                    topo.activateScene(currentSceneName);
                    icon.dom().removeClass('n-topology-nav-zoom-selection-selected');
                    scene.off('finish', fn, this);

                }, this);
                icon.dom().addClass('n-topology-nav-zoom-selection-selected');
            },
            _in: function (sender, event) {
                var topo = this.topology();
                topo.zoom(topo.scale() + 0.5);
                event.preventDefault();
            },
            _out: function (sender, event) {
                var topo = this.topology();
                topo.zoom(topo.scale() - 0.5);
                event.preventDefault();
            },
            _full: function () {
                this.toggleFull();
            },
            _enterSetting: function (event) {
                this.resolve("setting").addClass("n-topology-nav-setting-open");
            },
            _leaveSetting: function (event) {
                this.resolve("setting").removeClass("n-topology-nav-setting-open");
            },
            cancelFullScreen: function (el) {
                var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
                if (requestMethod) { // cancel full screen.
                    requestMethod.call(el);
                } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            requestFullScreen: function (el) {
                // Supports most browsers and their versions.
                var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

                if (requestMethod) { // Native full screen.
                    requestMethod.call(el);
                } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
                return false;
            },
            toggleFull: function () {
                var elem = document.body; // Make the body go full screen.
                var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);

                if (isInFullScreen) {
                    this.cancelFullScreen(document);
                    this.fire("leaveFullScreen");
                } else {
                    this.requestFullScreen(elem);
                    this.fire("enterFullScreen");
                }
                return false;
            },

            _openPopover: function (sender, event) {
                this.view("settingPopover").open({
                    target: sender.dom(),
                    offsetY: 3
                });
                this.view('icon').dom().addClass('n-topology-nav-setting-icon-selected');
            },
            _closePopover: function () {
                this.view("settingPopover").close();
            },
            _closeSettingPanel: function () {
                this.view('icon').dom().removeClass('n-topology-nav-setting-icon-selected');
            },
            _switchTheme: function (sender, event) {
                this.topology().theme(event.target.value);
            },
            _toggleNodeLabel: function (sender, events) {
                var checked = sender.get('checked');
                this.topology().eachNode(function (node) {
                    node.labelVisibility(checked);
                });
            }
        }
    });


})(nx, nx.global);