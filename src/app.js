// getRootObject function
import getRootObject from './root.js';
// NX
import {nx} from './base/nx-es2015.js';
// Define main classes in nx
import {Iterable} from './base/Iterable-es2015.js';
import {Observable} from './base/Observable-es2015.js';
import {Binding} from './base/Binding-es2015.js';
// Define data classes in nx
import {Counter} from './base/data/Counter-es2015.js';

var root = getRootObject();

root.nx = nx;

root.classes = {Iterable, Observable, Binding, Counter};