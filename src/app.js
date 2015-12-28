import getRootObject from './root.js';

// NX
import {nx} from './base/nx-es2015.js';
// Define main classes in nx
import {Iterable} from './base/Iterable-es2015.js';
import {Observable} from './base/Observable-es2015.js';
import {Binding} from './base/Binding-es2015.js';
import {Comparable} from './base/Comparable-es2015.js';
import {Serializable} from './base/Serializable-es2015.js';
import {Validatable} from './base/Validatable-es2015.js';
// Define data classes in nx
import {Counter} from './base/data/Counter-es2015.js';
import {Collection} from './base/data/Collection-es2015.js';
import {Dictionary} from './base/data/Dictionary-es2015.js';
import {ObservableObject} from './base/data/ObservableObject-es2015.js';
import {ObservableCollection} from './base/data/ObservableCollection-es2015.js';
import {ObservableDictionary} from './base/data/ObservableDictionary-es2015.js';
import {Query} from './base/data/Query-es2015.js';
import {SortedMap} from './base/data/SortedMap-es2015.js';
// Define web classes in nx
import {Env} from './web/Env-es2015.js';
import {Util} from './web/Util-es2015.js';

var root = getRootObject();
root.nx = nx;