/*
  The code in this file is extracted from the Observable.js file.
  It is defined on the same file because it requires the Observable
  defined class to work. Since we are using es2015 modules, we can
  require it.

  I took it out for it to look more like the other defined classes.
 */

import {nx} from './nx-es2015.js';
import {Observable} from './Observable-es2015.js';

export var Binding = nx.define('nx.Binding', Observable, {
  statics: {
    converters: {
      boolean: {
        convert: function (value) {
          return !!value;
        },
        convertBack: function (value) {
          return !!value;
        }
      },
      inverted: {
        convert: function (value) {
          return !value;
        },
        convertBack: function (value) {
          return !value;
        }
      },
      number: {
        convert: function (value) {
          return Number(value);
        },
        convertBack: function (value) {
          return value;
        }
      }
    },
    /**
     * @static
     */
    format: function (expr, target) {
      if (expr) {
        return expr.replace('{0}', target);
      } else {
        return '';
      }
    }
  },
  properties: {
    /**
     * Get the target object of current binding.
     */
    target: {
      value: null
    },
    /**
     * Get the target path of current binding.
     */
    targetPath: {
      value: ''
    },
    /**
     * Get the source path of current binding.
     */
    sourcePath: {
      value: ''
    },
    /**
     * Get or set the source of current binding.
     */
    source: {
      get: function () {
        return this._source;
      },
      set: function (value) {
        if (this._initialized && this._source !== value) {
          this._rebind(0, value);
          if (this._direction[0] == '<') {
            this._updateTarget();
          }
          this._source = value;
        }
      }
    },
    /**
     * Get or set the binding type.
     */
    bindingType: {
      value: 'auto'
    },
    /**
     * Get the direction for current binding.
     */
    direction: {
      value: 'auto'
    },
    /**
     * Get the trigger for current binding.
     */
    trigger: {
      value: 'auto'
    },
    /**
     * Get the format for current binding.
     */
    format: {
      value: 'auto'
    },
    /**
     * Get the converter for current binding.
     */
    converter: {
      value: 'auto'
    }
  },
  methods: {
    init: function (config) {
      this.sets(config);
      if (config.target) {
        var target = this.target();
        var targetPath = this.targetPath();
        var sourcePath = this.sourcePath();
        var bindingType = this.bindingType();
        var direction = this.direction();
        var format = this.format();
        var converter = this.converter();
        var targetMember = target[targetPath];
        var watchers = this._watchers = [];
        var keys = this._keys = sourcePath.split('.'),
          key;
        var i = 0,
          length = keys.length;
        var self = this;

        if (targetMember) {
          var bindingMeta = targetMember.__meta__.binding;

          if (bindingType == 'auto') {
            bindingType = targetMember.__type__;
          }

          if (direction == 'auto') {
            direction = this._direction = (bindingMeta && bindingMeta.direction) || '<-';
          }

          if (format == 'auto') {
            format = bindingMeta && bindingMeta.format;
          }

          if (converter == 'auto') {
            converter = bindingMeta && bindingMeta.converter;
          }
        } else {
          if (bindingType == 'auto') {
            bindingType = target.can(targetPath) ? 'event' : 'property';
          }

          if (direction == 'auto') {
            direction = this._direction = '<-';
          }

          if (format == 'auto') {
            format = null;
          }

          if (converter == 'auto') {
            converter = null;
          }
        }

        if (converter) {
          if (nx.is(converter, 'Function')) {
            converter = {
              convert: converter,
              convertBack: function (value) {
                return value;
              }
            };
          }
        }

        if (direction[0] == '<') {
          for (; i < length; i++) {
            watchers.push({
              key: keys[i],
              /*jshint -W083*/
              handler: (function (index) {
                return function (property, value) {
                  self._rebind(index, value);
                  self._updateTarget();
                };
              })(i + 1)
            });
          }
        }

        if (bindingType == 'event') {
          key = watchers[length - 1].key;
          watchers.length--;
          this._updateTarget = function () {
            var actualValue = this._actualValue;
            if (actualValue) {
              target.upon(targetPath, actualValue[key], actualValue);
            }
          };
        } else {
          this._updateTarget = function () {
            var actualValue = this._actualValue;
            if (converter) {
              actualValue = converter.convert.call(this, actualValue);
            }

            if (format) {
              actualValue = Binding.format(format, actualValue);
            }

            nx.path(target, targetPath, actualValue);
          };
        }

        if (direction[1] == '>') {
          if (target.watch && target.watch.__type__ === 'method') {
            target.watch(targetPath, this._onTargetChanged = function (property, value) {
              var actualValue = value;
              if (converter) {
                actualValue = converter.convertBack.call(this, actualValue);
              }
              nx.path(this.source(), sourcePath, actualValue);
            }, this);
          }
        }

        this._initialized = true;
        this.source(config.source);
      }
    },
    dispose: function () {
      var target = this._target;
      this._rebind(0, null);
    },
    _rebind: function (index, value) {
      var watchers = this._watchers;
      var newSource = value,
        oldSource;

      for (var i = index, length = watchers.length; i < length; i++) {
        var watcher = watchers[i];
        var key = watcher.key;
        var handler = watcher.handler;

        oldSource = watcher.source;

        if (oldSource && oldSource.unwatch && oldSource.unwatch.__type__ === 'method') {
          oldSource.unwatch(key, handler, this);
        }

        watcher.source = newSource;

        if (newSource) {
          if (newSource.watch && newSource.watch.__type__ === 'method') {
            newSource.watch(key, handler, this);
          }

          if (newSource.get) {
            newSource = newSource.get(key);
          } else {
            newSource = newSource[key];
          }
        }
      }

      this._actualValue = newSource;
    }
  }
}, {global: false});