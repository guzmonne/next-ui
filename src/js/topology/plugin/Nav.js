(function (nx, util, global) {

    var timer;
    var firstTimeShowTooltip = true;
    /**
     * Topology navigation element class
     * @class nx.graphic.Topology.Nav
     * @extend nv.ui.Component
     */
    nx.ui.define("nx.graphic.Topology.Nav", {
        /**
         * @event fit
         */
        /**
         * @event show3DTopology
         */
        /**
         * @event enterFullScreen
         */
        /**
         * @event leaveFullScreen
         */
        events: ['fit', 'show3DTopology', 'enterFullScreen', 'leaveFullScreen'],
        properties: {
            maxScale: {
                value: 8
            },
            minScale: {
                value: 0.5
            },
            /**
             * Get/set is topology show zoom rate
             */
            showZoomRate: {
                value: false
            },
            scale: {
                set: function (value) {
                    if (value != this._scale) {
                        var maxScale = this.maxScale();
                        var minScale = this.minScale();
                        var scale = this._scale = Math.max(Math.min(maxScale, value), minScale);
                        this.notify("scale");
                        var navBall = this.resolve("zoomball");
                        var step = 73 / (maxScale - minScale);
                        navBall.setStyles({
                            top: 21 + (maxScale - scale) * step
                        });

                        var tooltip = this.scaleTootip;
                        if (tooltip) {
                            var bound = this.getBound();
                            tooltip.setContent((scale + "").substr(0, 4));
                            if (this.showZoomRate()) {
                                tooltip.open({
                                    target: {x: 20 + bound.left, y: 121 + (maxScale - scale) * step + bound.top}
                                });
                            }

                            if (firstTimeShowTooltip) {
                                firstTimeShowTooltip = false;
                                tooltip.close();
                            } else {
                                clearTimeout(timer);
                                timer = setTimeout(function () {
                                    tooltip.close();
                                }, 300);
                            }

                        }
                    }
                },
                get: function () {
                    return this._scale || 1;
                }
            },
            show3D: {
                value: false
            },
            mode: {
                value: null
            },
            showModeSwitch: {
                value: true
            },
            showIcon: {
                value: true
            },
            theme: {

            },
            topology: {}
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
                            name: 'search',
                            props: {
                                'class': 'n-topology-nav-search',
                                title: "Search"
                            },
                            events: {
                                click: "{#_openSearchPopover}"
                            },
                            content: {
                                name: 'searchPanel',
                                type: 'nx.graphic.Topology.Search',
                                props: {
                                    topology: '{#topology}'
                                },
                                events: {
                                    'openSearchPanel': '{#_openSearchPanel}',
                                    'closeSearchPanel': '{#_closeSearchPanel}',
                                    'changeSearch': '{#_changeSearch}',
                                    'executeSearch': '{#_executeSearch}'
                                }
                            }

                        },
                        {
                            tag: 'li',
                            content: {
                                name: 'mode',
                                tag: 'ul',
                                props: {
                                    'class': 'n-topology-nav-mode',
                                    visible: '{#showModeSwitch}'
                                },
                                content: [
                                    {
                                        tag: 'li',

                                        content: {
                                            props: {
                                                'class': 'n-icon-select-node',
                                                title: "Select node mode"
                                            },
                                            tag: 'span'
                                        },
                                        events: {
                                            'mousedown': '{#_selectionMode}',
                                            'touchstart': '{#_selectionMode}'
                                        }

                                    },
                                    {
                                        tag: 'li',
                                        props: {
                                            'class': 'n-topology-nav-mode-selected'
                                        },
                                        content: {
                                            props: {
                                                'class': 'n-icon-move-mode',
                                                title: "Move mode"

                                            },
                                            tag: 'span'
                                        },
                                        events: {
                                            'mousedown': '{#_moveMode}',
                                            'touchstart': '{#_moveMode}'
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
                                    name: 'zoomout',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-out',
                                        title: "Zoom out"
                                    },
                                    events: {
                                        'click': '{#_out}'
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
                                    name: 'zoomin',
                                    tag: 'span',
                                    props: {
                                        'class': 'n-topology-nav-zoom-in',
                                        title: "Zoom in"
                                    },
                                    events: {
                                        'click': '{#_in}'
                                    }
                                }

                            ]
                        },
                        {
                            tag: 'li',
                            name: 'zoomselection',
                            props: {
                                'class': 'n-icon-zoom-by-selection-x22 n-topology-nav-zoom-selection',
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
                                'class': 'n-topology-nav-fit',
                                title: "Fit stage"
                            },
                            events: {
                                'click': '{#_fit}'
                            }
                        },

                        {
                            tag: 'li',
                            name: 'agr',
                            props: {
                                'class': 'n-icon-thumbnail-collapse-x16 n-topology-nav-agr',
                                title: "Aggregation",
                                visible: false
                            },
                            events: {
                                'click': '{#_agr}'
                            }
                        },

                        {
                            tag: 'li',
                            name: 'fullscreen',
                            props: {
                                'class': 'n-topology-nav-full',
                                title: 'Enter full screen mode'
                            },
                            events: {
                                'click': '{#_full}'
                            }
                        },
                        {
                            tag: 'li',
                            name: 'topo3d',
                            props: {
                                'class': 'n-topology-nav-topo3d n-topology-nav-topo3d-show-{#show3D}',
                                title: 'Show 3D topology',
                                visible: '{#show3D}'
                            },
                            events: {
                                'click': '{#_show3d}'
                            }
                        },
                        {
                            tag: 'li',
                            name: 'setting',
                            content: [
                                {
                                    tag: 'i',
                                    props: {
                                        'class': 'n-topology-nav-setting-icon'
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
                                        lazyClose: true,
                                        'class': 'n-topology-setting'
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
                                                        // name: 'viewsetting',
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
                                                        // name: 'viewsetting',
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
                                                    content: "Transformers"
                                                },
                                                {
                                                    tag: 'button',
                                                    props: {
                                                        'class': 'btn btn-default',
                                                        value: 'darkblue'
                                                    },
                                                    content: "Avatar"
                                                }

                                            ],
                                            events: {
                                                'click': '{#_switchTheme}'
                                            }
                                        },
                                        {
                                            name: 'customize'
                                        }
                                    ]
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
            onInit: function () {
                this.watch("mode", function (prop, value) {
                    if (value == "selectionNode") {
                        this.resolve("mode").childAt(1).removeClass("n-topology-nav-mode-selected");
                        this.resolve("mode").childAt(0).addClass("n-topology-nav-mode-selected");
                    } else {
                        this.resolve("mode").childAt(0).removeClass("n-topology-nav-mode-selected");
                        this.resolve("mode").childAt(1).addClass("n-topology-nav-mode-selected");
                    }
                }, this);

                this.mode(this.mode());
                this.resolve("setting").on("mouseenter", this._enterSetting, this);
                this.resolve("setting").on("mouseleave", this._leaveSetting, this);


                this.scaleTootip = new nx.ui.Tooltip({
                    direction: "right"
                });


                if (window.top.frames.length) {
                    this.resolve("fullscreen").visible(false);
                }
            },
            onAppend: function () {
                var topo = this.owner();

                this.topology(topo);

                topo.selectedNodes().watch("length", function (prop, value) {
                    this.resolve("agr").visible(nx.DEBUG && value > 1);
                }, this);

            },
            _fit: function (sender, event) {
                this.fire("fit");
                event.stop();
            },
            _out: function (sender, event) {
                //var maxScale = this.maxScale();
                //var minScale = this.minScale();
                //this.scale(this.scale() + (maxScale - minScale) / 8);
                this.scale(this.scale() + 1);
                event.stop();
            },
            _in: function (sender, event) {
                var maxScale = this.maxScale();
                var minScale = this.minScale();
                this.scale(this.scale() - (maxScale - minScale) / 8);

                event.stop();
            },
            _full: function () {
                this.toggleFull();
            },
            _selectionMode: function (sender, event) {
                this.resolve("mode").childAt(1).removeClass("n-topology-nav-mode-selected");
                this.resolve("mode").childAt(0).addClass("n-topology-nav-mode-selected");
                this.mode("selectionNode");
                event.stop();
            },
            _moveMode: function (sender, event) {
                this.resolve("mode").childAt(0).removeClass("n-topology-nav-mode-selected");
                this.resolve("mode").childAt(1).addClass("n-topology-nav-mode-selected");
                this.mode("move");
                event.stop();
            },
            _show3d: function (sender, event) {
                this.fire("show3DTopology");
                event.stop();
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

            /**
             * Let topology enter full screen mode
             * @param el
             * @returns {boolean}
             * @method requestFullScreen
             */
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
                return false
            },
            /**
             * Toggle topology's full screen mode
             * @returns {boolean}
             * @method toggleFull
             */

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
            _zoombyselection: function () {
                this.mode("zoomBySelection");
            },
            _openPopover: function (sender, event) {
                this.resolve("settingPopover").open({
                    target: sender._element
                })
            },
            _closePopover: function () {
                this.resolve("settingPopover").close();
            },
            _agr: function () {
                this.mode("move");

                var topo = this.owner();

                var nodes = topo.selectedNodes().toArray();

                nx.each(nodes, function (node) {
                    node.selected(false);
                });


                topo.aggregationNodes(nodes);


            },
            _openSearchPopover: function (sender, event) {

                this.resolve('searchPanel').open({
                    target: sender,
                    direction: 'right',
                    offsetX: 12,
                    offsetY: -6
                })
            },
            _closeSearchPopover: function () {
                //this.resolve('searchPopup').close();
            },
            _switchTheme: function (sender, event) {
                this.theme(event.target.value);
            },
            _openSearchPanel: function () {
                this.resolve("search").addClass('n-topology-nav-search-active');

                this.topology().fire("openSearchPanel");

            },
            _closeSearchPanel: function () {
                this.resolve("search").removeClass('n-topology-nav-search-active');

                this.topology().fire("closeSearchPanel");
            },
            _changeSearch: function () {
                this.topology().fire("changeSearch");

            },
            _executeSearch: function () {
                this.topology().fire("executeSearch");

            }
        }
    });
})(nx, nx.graphic.util, nx.global);