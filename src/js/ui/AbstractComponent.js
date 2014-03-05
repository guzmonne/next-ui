(function (nx) {
    var global = nx.global;
    var Binding = nx.Binding;
    var Collection = nx.data.Collection;
    var Document = nx.dom.Document;
    var rpatt = /(?={)\{([^{}]*?)\}(?!})/;

    function setProperty(target, name, value, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, nx.extend(value.gets(), {
                bindingType: 'property'
            }));
        }
        else if (nx.is(value, 'String') && rpatt.test(value)) {
            var expr = RegExp.$1 + ',bindingType=property';
            if (expr[0] === '#') {
                target.setBinding(name, 'owner.' + expr.slice(1), owner || target);
            }
            else {
                target.setBinding(name, expr ? 'model.' + expr : 'model', owner || target);
            }
        }
        else {
            target.set(name, value);
        }
    }

    function setEvent(target, name, value, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, value.gets());
        }
        else if (nx.is(value, 'String') && rpatt.test(value)) {
            var expr = RegExp.$1 + ',bindingType=event';
            if (expr[0] === '#') {
                target.setBinding(name, 'owner.' + expr.slice(1), owner || target);
            }
            else {
                target.setBinding(name, expr ? 'model.' + expr : 'model', owner || target);
            }
        }
        else {
            target.on(name, value, owner || target);
        }
    }

    function createComponent(view, owner) {
        if (view) {
            var comp;
            if (nx.is(view, 'Array')) {
                comp = new DOMComponent('fragment');

                nx.each(view, function (child) {
                    createComponent(child, owner).attach(comp);
                });
            }
            else if (nx.is(view, 'Object')) {
                var type = view.type;
                if (type) {
                    var clazz = nx.is(type, 'String') ? nx.path(global, type) : type;
                    if (nx.is(clazz, 'Function')) {
                        comp = new clazz();
                    }
                    else {
                        throw new Error('Component "' + type + '" is not defined.');
                    }
                }
                else {
                    comp = new DOMComponent(view.tag || 'div');
                }

                var name = view.name;
                var props = view.props;
                var events = view.events;
                var content = view.content;

                if (name) {
                    comp.register('@name', name);
                }

                if (owner) {
                    comp.owner(owner);
                }

                nx.each(props, function (value, name) {
                    setProperty(comp, name, value);
                });

                nx.each(events, function (value, name) {
                    setEvent(comp, name, value);
                });

                if (content !== undefined) {
                    setProperty(comp, 'content', content);
                }
            }
            else if (view !== undefined) {
                comp = new DOMComponent('text', view);
            }

            return comp;
        }

        return null;
    }

    var AbstractComponent = nx.define('nx.ui.AbstractComponent', nx.Observable, {
        abstract: true,
        statics: {
            createComponent: createComponent
        },
        events: ['enter', 'leave'],
        properties: {
            content: {
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    nx.each(this._content.toArray(), function (c) {
                        c.destroy();
                    });
                    if (nx.is(value, AbstractComponent)) {
                        value.attach(this);
                    }
                    else if (value) {
                        createComponent(value, this.owner()).attach(this);
                    }
                }
            },
            model: {
                get: function () {
                    return this._model || this._inheritedModel;
                },
                set: function (value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    }
                    else {
                        this._model = value;
                    }

                    this._content.each(function (c) {
                        if (!nx.is(c, 'String')) {
                            c.model(value, true);
                        }
                    });
                }
            },
            owner: {
                value: null
            },
            parent: {
                value: null
            }
        },
        methods: {
            init: function () {
                this.inherited();
                this._resources = {};
                this._content = new Collection();
            },
            attach: function (parent, index) {
                this.detach();

                if (nx.is(parent, AbstractComponent)) {
                    var container = parent.getContainer(this);

                    if (container) {
                        var name = this.resolve('@name');
                        var owner = this.owner() || parent;

                        if (name) {
                            owner.register(name, this);
                        }

                        this.onAttach(parent, index);

                        if (index >= 0) {
                            parent.content().insert(this, index);
                        }
                        else {
                            parent.content().add(this);
                        }

                        this.parent(parent);
                        this.owner(owner);
                        this.fire('enter', {
                            parent: parent,
                            owner: owner
                        });

                        this._attached = true;
                    }
                    else {
                        throw new Error(parent.__type__ + ' can not be used as a container.');
                    }
                }
            },
            detach: function () {
                if (this._attached) {
                    var name = this.resolve('@name');
                    var owner = this.owner();
                    var parent = this.parent();

                    if (name) {
                        owner.unregister(name);
                    }

                    this.onDetach(parent);
                    parent.content().remove(this);
                    this.parent(null);
                    this.owner(null);
                    this.fire('leave', {
                        parent: parent,
                        owner: owner
                    });
                    this._attached = false;
                }
            },
            onAttach: function (parent, index) {
                throw new Error('Not Implemented');
            },
            onDetach: function (parent) {
                throw new Error('Not Implemented');
            },
            register: function (name, value, force) {
                var resources = this._resources;
                if (!(name in resources) || force) {
                    resources[name] = value;
                }
            },
            unregister: function (name) {
                var resources = this._resources;
                if (name in resources) {
                    delete resources[name];
                }
            },
            resolve: function (name) {
                var resources = this._resources;
                if (name in resources) {
                    return resources[name];
                }
            },
            getContainer: function (comp) {
                if (this.resolve('@tag') === 'fragment') {
                    var parent = this.parent();
                    if (parent) {
                        return parent.getContainer(comp);
                    }
                }

                return this.resolve('@root');
            },
            dispose: function () {
                this.inherited();
                this.content().each(function (content) {
                    content.dispose();
                });
                this._resources = null;
                this._content = null;
                this._model = null;
                this._inheritedModel = null;
            },
            destroy: function () {
                this.detach();
                this.inherited();
            }
        }
    });

    var CssClass = nx.define(nx.Observable, {
        methods: {
            init: function (owner) {
                this.inherited();
                this._owner = owner;
                this._classList = [];
            },
            has: function (name) {
                return name in this._classList;
            },
            get: function (name) {
                return this._classList[name];
            },
            set: function (name, value) {
                this._classList[name] = value;
                this._owner.resolve('@root').set('class', this._classList.join(' '));
            },
            hasClass: function (name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function (name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._owner.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            removeClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._owner.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            dispose: function () {
                this.inherited();
                this._owner = null;
                this._classList = null;
            }
        }
    });

    var CssStyle = nx.define(nx.Observable, {
        methods: {
            init: function (owner) {
                this.inherited();
                this._owner = owner;
            },
            get: function (name) {
                return this._owner.resolve('@root').getStyle(name);
            },
            set: function (name, value) {
                this._owner.resolve('@root').setStyle(name, value);
            },
            dispose: function () {
                this.inherited();
                this._owner = null;
            }
        }
    });

    var DOMEvent = nx.define({

    });

    var DOMComponent = nx.define(AbstractComponent, {
        final: true,
        properties: {
            'class': {
                get: function () {
                    return this._class;
                },
                set: function (value) {
                    if (nx.is(value, 'Array')) {
                        var cssClass = this._class;
                        nx.each(value, function (item, index) {
                            setProperty(cssClass, '' + index, item, this);
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('class', value);
                    }
                }
            },
            style: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (nx.is(value, 'Object')) {
                        var cssStyle = this._style;
                        nx.each(value, function (v, k) {
                            setProperty(cssStyle, k, v, this);
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('style', value);
                    }
                }
            },
            template: {
                get: function () {
                    return this._template;
                },
                set: function (value) {
                    this._template = value;
                    this._generateContent();
                }
            },
            items: {
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var items = this._items;
                    if (items && items.off) {
                        items.off('change', this._onItemsChange, this);
                    }
                    items = this._items = value;
                    if (items && items.on) {
                        items.on('change', this._onItemsChange, this);
                    }

                    this._generateContent();
                }
            },
            value: {
                get: function () {
                    return this.resolve('@root').get('value');
                },
                set: function (value) {
                    return this.resolve('@root').set('value', value);
                },
                binding: {
                    direction: '<>'
                }
            },
            states: {
                value: null
            }

        },
        methods: {
            init: function (tag, text) {
                this.inherited();
                this._domListeners = {};
                this._resources = {};
                this._content = new Collection();
                this._class = new CssClass(this);
                this._style = new CssStyle(this);

                if (tag) {
                    var tokens = tag.split(':');
                    if (tokens.length === 2) {
                        var ns = tokens[0];
                        tag = tokens[1];
                        this.register('@ns', ns);
                        this.register('@root', Document.createElementNS(ns, tag));
                    }
                    else if (tag === 'text') {
                        this.register('@root', Document.createText(text));
                    }
                    else if (tag === 'fragment') {
                        this.register('@root', Document.createFragment());
                    }
                    else {
                        this.register('@root', Document.createElement(tag));
                    }

                    this.register('@tag', tag);
                }

                //Temp
                switch (tag) {
                    case 'input':
                    case 'textarea':
                        this.on('change', function (sender, event) {
                            switch (event.target.type) {
                                case 'checkbox':
                                case 'radio':
                                    this.notify('checked');
                                    break;
                                default:
                                    this.notify('value');
                                    break;
                            }
                        }, this);
                        this.on('input', function (sender, event) {
                            this.notify('value');
                        }, this);
                        break;
                    case 'select':
                        this.on('change', function (sender, event) {
                            this.notify('selectedIndex');
                            this.notify('value');
                        }, this);
                        break;
                }
            },
            get: function (name) {
                if (this.has(name)) {
                    return this.inherited(name);
                }
                else {
                    return this.resolve('@root').get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
                    this.inherited(name, value);
                }
                else {
                    this.resolve('@root').set(name, value);
                    this.notify(name);
                }
            },
            on: function (name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            upon: function (name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            /**
             * Trigger an event.
             * @method fire
             * @param name {String}
             * @param [data] {*}
             */
            fire: function (name, data) {
                var listeners = this.__listeners__[name], listener, result;
                if (listeners) {
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener && listener.handler) {
                            result = listener.handler.call(listener.context, listener.owner, data);
                            if (result === false) {
                                return false;
                            }
                        }
                    }
                }
            },
            dispose: function () {
                var root = this.resolve('@root');
                if (root) {
                    nx.each(this._domListeners, function (listener, name) {
                        if (name.charAt(0) === ':') {
                            root.removeEventListener(name.slice(1), listener, true);
                        }
                        else {
                            root.removeEventListener(name, listener);
                        }
                    });
                }
                this.items(null);
                this._class.dispose();
                this._style.dispose();
                this.inherited();
                this._domListeners = null;
            },
            onAttach: function (parent, index) {
                var root = this.resolve('@root');
                if (root) {
                    var container = parent.getContainer(this);

                    if (index >= 0) {
                        var ref = parent.content().getItem(index);

                        if (ref && ref.resolve('@tag') === 'fragment') {
                            ref = ref.content().getItem(0);
                        }

                        if (ref) {
                            container.insertBefore(root, ref.resolve('@root'));
                        }
                        else {
                            container.appendChild(root);
                        }
                    }
                    else {
                        container.appendChild(root);
                    }

                    var states = this.states();
                    var enterState = null;
                    if (states) {
                        enterState = states.enter;
                    }

                    if (enterState) {
                        var cssText = root.$dom.style.cssText;
                        var transition = 'all ' + (enterState.duration || 500) + 'ms';
                        root.setStyles(nx.extend({
                            transition: transition
                        }, enterState));
                        this.upon('transitionend', function () {
                            root.removeStyle('transition');
                        });
                        setTimeout(function () {
                            root.$dom.style.cssText = cssText + ';transition: ' + transition;
                        }, 10);
                    }
                }
            },
            onDetach: function (parent) {
                var root = this.resolve('@root');
                if (root) {
                    var tag = this.resolve('@tag');
                    var self = this;

                    if (tag === 'fragment') {
                        nx.each(self.content(), function (child) {
                            root.appendChild(child.resolve('@root'));
                        });
                    }
                    else {
                        var states = this.states();
                        var leaveState = null;
                        if (states) {
                            leaveState = states.leave;
                        }

                        if (leaveState) {
                            var cssText = root.$dom.style.cssText;
                            var transition = 'all ' + (leaveState.duration || 500) + 'ms';
                            root.setStyle('transition', transition);
                            setTimeout(function () {
                                root.setStyles(leaveState);
                            }, 10);
                            this.upon('transitionend', function () {
                                root.$dom.style.cssText = cssText;
                                parent.getContainer(this).removeChild(root);
                            });
                        }
                        else {
                            parent.getContainer(this).removeChild(root);
                        }
                    }
                }
            },
            _attachDomListener: function (name) {
                var domListeners = this._domListeners;
                if (!(name in domListeners)) {
                    var self = this;
                    var root = this.resolve('@root');
                    var listener = domListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    if (name.charAt(0) === ':') {
                        root.addEventListener(name.slice(1), listener, true);
                    }
                    else {
                        root.addEventListener(name, listener);
                    }
                }
            },
            _generateContent: function () {
                var template = this._template;
                var items = this._items;
                nx.each(this._content.toArray(), function (c) {
                    c.destroy();
                });

                if (template && items) {
                    nx.each(items, function (item) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this);
                    }, this);
                }
            },
            _onItemsChange: function (sender, event) {
                var action = event.action;
                var index = event.index || -1;
                if (action === 'add') {
                    nx.each(event.items, function (item) {
                        var comp = createComponent(this._template, this.owner());
                        comp.model(item);
                        comp.attach(this, index);
                    }, this);
                }
                else if (action === 'remove') {
                    nx.each(event.items, function (item) {
                        nx.each(this.content().toArray(), function (comp) {
                            if (comp.model() === item) {
                                comp.detach();
                            }
                        }, this);
                    }, this);
                }
                else if (action === 'replace') {
                    var oldItem = event.oldItem,
                        newItem = event.newItem;

                    nx.each(this.content().toArray(), function (comp) {
                        if (comp.model() === oldItem) {
                            comp.model(newItem);
                        }
                    }, this);
                }
                else if (action === 'sort') {
                    var comparator = event.comparator;
                    var sortedContent = this.content().toArray().sort(function (a, b) {
                        return comparator(a.model(), b.model());
                    });

                    nx.each(sortedContent, function (comp) {
                        comp.attach(this);
                    }, this);
                }
                else {
                    this._generateContent();
                }
            }
        }
    });
})(nx);