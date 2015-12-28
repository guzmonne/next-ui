import {nx} from './nx-es2015.js';

/**
 * @class Observable
 * @namespace nx
 */
var Observable = nx.define('nx.Observable', {
  statics: {
    extendProperty: function extendProperty(target, name, meta) {
      var property = nx.Object.extendProperty(target, name, meta);
      if (property && property.__type__ == 'property') {
        if (!property._watched) {
          var setter = property.__setter__;
          var dependencies = property.getMeta('dependencies');
          nx.each(dependencies, function (dep) {
            this.watch(dep, function () {
              this.notify(name);
            }, this);
          }, this);

          property.__setter__ = function (value, params) {
            var oldValue = this.get(name);
            if (oldValue !== value) {
              if (setter.call(this, value, params) !== false) {
                return this.notify(name, oldValue);
              }
            }

            return false;
          };

          property._watched = true;
        }
      }

      return property;
    },
    /**
     * This method in order to watch the change of specified path of specified target.
     * @static
     * @method watch
     * @param target The target observable object.
     * @param path The path to be watched.
     * @param callback The callback function accepting arguments list: (path, newvalue, oldvalue).
     * @param context (Optional) The context which the callback will be called with.
     * @return Resource stub object, with release and affect methods.
     *  <p>release: unwatch the current watching.</p>
     *  <p>affect: invoke the callback with current value immediately.</p>
     */
    watch: function (target, path, callback, context) {
      var keys = (typeof path === "string" ? path.split(".") : path);
      var iterate = function (parent, idx) {
        if (parent && idx < keys.length) {
          var key = keys[idx];
          var child = nx.path(parent, key);
          if (parent.watch) {
            var rkeys = keys.slice(idx + 1);
            var iter = iterate(child, idx + 1);
            var watch = parent.watch(key, function (pname, pnewvalue, poldvalue) {
              var newvalue = nx.path(pnewvalue, rkeys);
              var oldvalue = nx.path(poldvalue, rkeys);
              callback.call(context || target, path, newvalue, oldvalue);
              if (pnewvalue !== child) {
                iter && iter.release();
                child = pnewvalue;
                iter = iterate(child, idx + 1);
              }
            });
            return {
              release: function () {
                iter && iter.release();
                watch.release();
              }
            };
          } else if (child) {
            return iterate(child, idx + 1);
          }
        }
        return {
          release: nx.idle
        };
      };
      var iter = iterate(target, 0);
      return {
        release: iter.release,
        affect: function () {
          var value = nx.path(target, path);
          callback.call(context || target, path, value, value);
        }
      };
    },
    /**
     * Monitor several paths of target at the same time, any value change of any path will trigger the callback with all values of all paths.
     * @static
     * @method monitor
     * @param target The target observable object.
     * @param pathlist The path list to be watched.
     * @param callback The callback function accepting arguments list: (value1, value2, value3, ..., changed_path, changed_old_value).
     * @return Resource stub object, with release and affect methods.
     *  <p>release: release the current monitoring.</p>
     *  <p>affect: invoke the callback with current values immediately.</p>
     */
    monitor: function (target, pathlist, callback) {
      if (!target || !pathlist || !callback) {
        return;
      }
      // apply the cascading
      var i, paths, resources, values;
      paths = typeof pathlist === "string" ? pathlist.replace(/\s/g, "").split(",") : pathlist;
      resources = [];
      values = [];
      var affect = function (path, oldvalue) {
        var args = values.slice();
        args.push(path, oldvalue);
        callback.apply(target, args);
      };
      for (i = 0; i < paths.length; i++) {
        (function (idx) {
          values[idx] = nx.path(target, paths[idx]);
          var resource = Observable.watch(target, paths[idx], function (path, value) {
            var oldvalue = values[idx];
            values[idx] = value;
            affect(paths[idx], oldvalue);
          });
          resources.push(resource);
        })(i);
      }
      return {
        affect: affect,
        release: function () {
          while (resources.length) {
            resources.shift().release();
          }
        }
      };
    }
  },
  methods: {
    /**
     * @constructor
     */
    init: function () {
      this.__bindings__ = this.__bindings__ || {};
      this.__watchers__ = this.__watchers__ || {};
    },
    /**
     * Dispose current object.
     * @method dispose
     */
    dispose: function () {
      this.inherited();
      nx.each(this.__bindings__, function (binding) {
        binding.dispose();
      });
      this.__bindings__ = {};
      this.__watchers__ = {};
    },
    /**
     * @method
     * @param names
     * @param handler
     * @param context
     */
    watch: function (names, handler, context) {
      var resources = [];
      nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
        resources.push(this._watch(name, handler, context));
      }, this);
      return {
        affect: function () {
          nx.each(resources, function (resource) {
            resource.affect();
          });
        },
        release: function () {
          nx.each(resources, function (resource) {
            resource.release();
          });
        }
      };
    },
    /**
     * @method unwatch
     * @param names
     * @param handler
     * @param context
     */
    unwatch: function (names, handler, context) {
      nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
        this._unwatch(name, handler, context);
      }, this);
    },
    /**
     * @method notify
     * @param names
     * @param oldValue
     */
    notify: function (names, oldValue) {
      if (names == '*') {
        nx.each(this.__watchers__, function (value, name) {
          this._notify(name, oldValue);
        }, this);
      } else {
        nx.each(nx.is(names, 'Array') ? names : [names], function (name) {
          this._notify(name, oldValue);
        }, this);
      }

    },
    /**
     * Get existing binding object for specified property.
     * @method getBinding
     * @param prop
     * @returns {*}
     */
    getBinding: function (prop) {
      return this.__bindings__[prop];
    },
    /**
     * Set binding for specified property.
     * @method setBinding
     * @param prop
     * @param expr
     * @param source
     */
    setBinding: function (prop, expr, source) {
      var binding = this.__bindings__[prop];
      var params = {};

      if (nx.is(expr, 'String')) {
        var tokens = expr.split(',');
        var path = tokens[0];
        var i = 1,
          length = tokens.length;

        for (; i < length; i++) {
          var pair = tokens[i].split('=');
          params[pair[0]] = pair[1];
        }

        params.target = this;
        params.targetPath = prop;
        params.sourcePath = path;
        params.source = source;
        if (params.converter) {
          params.converter = Binding.converters[params.converter] || nx.path(window, params.converter);
        }

      } else {
        params = nx.clone(expr);
        params.target = this;
        params.targetPath = prop;
        params.source = params.source || this;
      }

      if (binding) {
        binding.destroy();
      }

      this.__bindings__[prop] = new Binding(params);
    },
    /**
     * Clear binding for specified property.
     * @method clearBinding
     * @param prop
     */
    clearBinding: function (prop) {
      var binding = this.__bindings__[prop];
      if (binding) {
        binding.destroy();
        this.__bindings__[prop] = null;
      }
    },
    _watch: function (name, handler, context) {
      var map = this.__watchers__;
      var watchers = map[name] = map[name] || [];
      var property = this[name];
      var watcher = {
        owner: this,
        handler: handler,
        context: context
      };

      watchers.push(watcher);

      if (property && property.__type__ == 'property') {
        if (!property._watched) {
          var setter = property.__setter__;
          var dependencies = property.getMeta('dependencies');
          var equalityCheck = property.getMeta('equalityCheck');
          nx.each(dependencies, function (dep) {
            this.watch(dep, function () {
              this.notify(name);
            }, this);
          }, this);

          property.__setter__ = function (value, params) {
            var oldValue = this.get(name);
            if (oldValue !== value || (params && params.force) || equalityCheck === false) {
              if (setter.call(this, value, params) !== false) {
                return this.notify(name, oldValue);
              }
            }

            return false;
          };

          property._watched = true;
        }
      }
      return {
        affect: function () {
          var value = watcher.owner.get(name);
          if (watcher && watcher.handler) {
            watcher.handler.call(watcher.context || watcher.owner, name, value, value, watcher.owner);
          }
        },
        release: function () {
          var idx = watchers.indexOf(watcher);
          if (idx >= 0) {
            watchers.splice(idx, 1);
          }
        }
      };
    },
    _unwatch: function (name, handler, context) {
      var map = this.__watchers__;
      var watchers = map[name],
        watcher;

      if (watchers) {
        if (handler) {
          for (var i = 0, length = watchers.length; i < length; i++) {
            watcher = watchers[i];
            if (watcher.handler == handler && watcher.context == context) {
              watchers.splice(i, 1);
              break;
            }
          }
        } else {
          watchers.length = 0;
        }
      }
    },
    _notify: function (name, oldValue) {
      var i, watcher, calling, existing = this.__watchers__[name];
      calling = existing ? existing.slice() : [];
      for (i = 0; i < calling.length; i++) {
        watcher = calling[i];
        if (watcher && watcher.handler && (watcher === existing[i] || existing.indexOf(watcher) >= 0)) {
          watcher.handler.call(watcher.context || watcher.owner, name, this.get(name), oldValue, watcher.owner);
        }

      }
    }
  }
}, null, {global: false});

export {Observable};