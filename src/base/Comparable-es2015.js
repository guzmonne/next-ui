import {nx} from './nx-es2015.js';
import {Observable} from './Observable-es2015.js';

export var Comparable = nx.define('nx.Comparable', {
  methods: {
    /**
     * Compare with the source.
     * @method compare
     * @param source
     * @returns {Number}
     */
    compare: function (source) {
      if (this === source) {
        return 0;
      }
      else if (this > source) {
        return 1;
      }
      else if (this < source) {
        return -1;
      }

      return 1;
    },
    __compare__: function (source) {
      return this.compare(source);
    }
  }
}, null, {global: false});