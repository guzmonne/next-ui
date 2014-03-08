(function (nx) {
    var global = nx.global;
    var Document = nx.dom.Document;

    nx.define('nx.ui.Application', nx.ui.AbstractComponent, {
        methods: {
            init: function () {
                this.inherited();
                var startFn = this.start;
                var stopFn = this.stop;
                var self = this;
                this.start = function (options) {
                    Document.ready(function () {
                        nx.app = self;
                        startFn.call(self, options);
                    });
                    return this;
                };

                this.stop = function () {
                    nx.app = null;
                    stopFn.call(self);
                };

                this._globalListeners = {};
            },
            start: function () {
                throw new Error('Method "start" is not implemented');
            },
            stop: function () {
                throw new Error('Method "stop" is not implemented');
            },
            getContainer: function () {
                return Document.body();
            },
            on: function (name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            upon: function (name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            _attachGlobalListeners: function (name) {
                var globalListeners = this._globalListeners;
                if (!(name in globalListeners)) {
                    var self = this;
                    var listener = globalListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    window.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);
