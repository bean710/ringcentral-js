(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('pubnub'), require('es6-promise'), require('fetch-ponyfill')) :
	typeof define === 'function' && define.amd ? define(['pubnub', 'es6-promise', 'fetch-ponyfill'], factory) :
	(global.RingCentral = global.RingCentral || {}, global.RingCentral.SDK = factory(global['disabled-PubNub'],global['disabled-Promise'],global['disabled-fetch']));
}(this, (function (pubnub,es6Promise,fetchPonyfill) { 'use strict';

pubnub = pubnub && pubnub.hasOwnProperty('default') ? pubnub['default'] : pubnub;
es6Promise = es6Promise && es6Promise.hasOwnProperty('default') ? es6Promise['default'] : es6Promise;
fetchPonyfill = fetchPonyfill && fetchPonyfill.hasOwnProperty('default') ? fetchPonyfill['default'] : fetchPonyfill;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * @param {Externals} options.externals
 * @param {string} [options.prefix]
 * @property {Externals} _externals
 */
function Cache(options) {

    /** @private */
    this._prefix = options.prefix || Cache.defaultPrefix;

    /** @private */
    this._externals = options.externals;

}

Cache.defaultPrefix = 'rc-';

Cache.prototype.setItem = function(key, data) {
    this._externals.localStorage[this._prefixKey(key)] = JSON.stringify(data);
    return this;
};

Cache.prototype.removeItem = function(key) {
    delete this._externals.localStorage[this._prefixKey(key)];
    return this;
};

Cache.prototype.getItem = function(key) {
    var item = this._externals.localStorage[this._prefixKey(key)];
    if (!item) return null;
    return JSON.parse(item);
};

Cache.prototype.clean = function() {

    for (var key in this._externals.localStorage) {

        /* istanbul ignore next */
        if (!this._externals.localStorage.hasOwnProperty(key)) continue;

        if (key.indexOf(this._prefix) === 0) {
            delete this._externals.localStorage[key];
        }

    }

    return this;

};

Cache.prototype._prefixKey = function(key) {
    return this._prefix + key;
};

var Cache_1 = Cache;

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';



function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

'use strict';

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter$1() {
  EventEmitter$1.init.call(this);
}
// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter$1.EventEmitter = EventEmitter$1;

EventEmitter$1.usingDomains = false;

EventEmitter$1.prototype.domain = undefined;
EventEmitter$1.prototype._events = undefined;
EventEmitter$1.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter$1.defaultMaxListeners = 10;

EventEmitter$1.init = function() {
  this.domain = null;
  if (EventEmitter$1.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter$1.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter$1.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter$1.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter$1.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter$1.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter$1.prototype.on = EventEmitter$1.prototype.addListener;

EventEmitter$1.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter$1.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter$1.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter$1.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter$1.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter$1.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter$1.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter$1.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter$1.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


var events = Object.freeze({
	default: EventEmitter$1,
	EventEmitter: EventEmitter$1
});

/**
 * @param {Externals} options.externals
 * @param {Request} [options.request]
 * @param {Response} [options.response]
 * @param {string} [options.responseText]
 * @property {Externals} _externals
 * @property {Request} _request
 * @property {Response} _response
 * @property {string} _text
 * @property {object} _json
 * @property {ApiResponse[]} _multipart
 */
function ApiResponse(options) {

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._request = options.request;

    /** @private */
    this._response = options.response;

    /** @private */
    this._text = options.responseText || '';

    /** @private */
    this._json = null;

    /** @private */
    this._multipart = [];

}

ApiResponse._contentType = 'Content-Type';
ApiResponse._jsonContentType = 'application/json';
ApiResponse._multipartContentType = 'multipart/mixed';
ApiResponse._urlencodedContentType = 'application/x-www-form-urlencoded';
ApiResponse._headerSeparator = ':';
ApiResponse._bodySeparator = '\n\n';
ApiResponse._boundarySeparator = '--';
ApiResponse._unauthorizedStatus = 401;
ApiResponse._rateLimitStatus = 429;

/**
 * @param {Response} response
 * @return {Promise<ApiResponse>}
 */
ApiResponse.prototype.receiveResponse = function(response) {

    this._response = response;

    return (new this._externals.Promise(function(resolve) {

        // Ignore if not textual type
        if (!this._isMultipart() && !this._isJson()) return resolve('');

        return resolve(this.response().text());

    }.bind(this))).then(function(text) {

        this._text = text;
        return text;

    }.bind(this));

};

/**
 * @return {Response}
 */
ApiResponse.prototype.response = function() {
    return this._response;
};

/**
 * @return {Request}
 */
ApiResponse.prototype.request = function() {
    return this._request;
};

/**
 * @return {boolean}
 */
ApiResponse.prototype.ok = function() {
    return this._response && this._response.ok;
};

/**
 * @return {string}
 */
ApiResponse.prototype.text = function() {
    // Since we read text only in case JSON or Multipart
    if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
    return this._text;
};

/**
 * @return {object}
 */
ApiResponse.prototype.json = function() {
    if (!this._isJson()) throw new Error('Response is not JSON');
    if (!this._json) {
        this._json = this._text ? JSON.parse(this._text) : null;
    }
    return this._json;
};

/**
 * @param [skipOKCheck]
 * @return {string}
 */
ApiResponse.prototype.error = function(skipOKCheck) {

    if (this.ok() && !skipOKCheck) return null;

    var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                  (this._response && this._response.statusText ? this._response.statusText : '');

    try {

        if (this.json().message) message = this.json().message;
        if (this.json().error_description) message = this.json().error_description;
        if (this.json().description) message = this.json().description;

    } catch (e) {}

    return message;

};

/**
 * If it is not known upfront what would be the response, client code can treat any response as multipart
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.toMultipart = function() {
    if (!this._isMultipart()) return [this];
    return this.multipart();
};

/**
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.multipart = function() {

    if (!this._isMultipart()) throw new Error('Response is not multipart');

    if (!this._multipart.length) {

        // Step 1. Split multipart response

        var text = this.text();

        if (!text) throw new Error('No response body');

        var boundary;

        try {
            boundary = this._getContentType().match(/boundary=([^;]+)/i)[1];
        } catch (e) {
            throw new Error('Cannot find boundary');
        }

        if (!boundary) throw new Error('Cannot find boundary');

        var parts = text.toString().split(ApiResponse._boundarySeparator + boundary);

        if (parts[0].trim() === '') parts.shift();
        if (parts[parts.length - 1].trim() == ApiResponse._boundarySeparator) parts.pop();

        if (parts.length < 1) throw new Error('No parts in body');

        // Step 2. Parse status info

        var statusInfo = this._create(parts.shift(), this._response.status, this._response.statusText).json();

        // Step 3. Parse all other parts

        this._multipart = parts.map(function(part, i) {

            var status = statusInfo.response[i].status;

            return this._create(part, status);

        }.bind(this));

    }

    return this._multipart;

};

/**
 * @private
 */
ApiResponse.prototype._isContentType = function(contentType) {
    return this._getContentType().indexOf(contentType) > -1;
};

/**
 * @private
 */
ApiResponse.prototype._getContentType = function() {
    return this._response.headers.get(ApiResponse._contentType) || '';
};

/**
 * @private
 */
ApiResponse.prototype._isMultipart = function() {
    return this._isContentType(ApiResponse._multipartContentType);
};

/**
 * @private
 */
ApiResponse.prototype._isJson = function() {
    return this._isContentType(ApiResponse._jsonContentType);
};

/**
 * Method is used to create ApiResponse object from string parts of multipart/mixed response
 * @param {string} [text]
 * @param {number} [status]
 * @param {string} [statusText]
 * @private
 * @return {ApiResponse}
 */
ApiResponse.prototype._create = function(text, status, statusText) {

    text = text || '';
    status = status || 200;
    statusText = statusText || 'OK';

    text = text.replace(/\r/g, '');

    var headers = new this._externals.Headers(),
        headersAndBody = text.split(ApiResponse._bodySeparator),
        headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';

    text = headersAndBody.length > 0 ? headersAndBody.join(ApiResponse._bodySeparator) : null;

    (headersText || '')
        .split('\n')
        .forEach(function(header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);

        });

    var response = new this._externals.Response(text, {
        headers: headers,
        status: status,
        statusText: statusText
    });

    return new ApiResponse({
        externals: this._externals,
        request: null,
        response: response,
        responseText: text
    });

};

var ApiResponse_1 = ApiResponse;

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
}

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty$1(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}
var qs = {
  encode: stringify,
  stringify: stringify,
  decode: parse,
  parse: parse
};



var qs$1 = Object.freeze({
	stringify: stringify,
	parse: parse,
	default: qs,
	encode: stringify,
	decode: parse
});

var require$$0 = ( events && EventEmitter$1 ) || events;

var qs$2 = ( qs$1 && qs ) || qs$1;

var EventEmitter = require$$0.EventEmitter;



function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function(res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/**
 * @param {Externals} externals
 * @property {Externals} _externals
 */
function Client(externals) {

    EventEmitter.call(this);

    /** @private */
    this._externals = externals;

    this.events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

}

Client._allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

Client.prototype = Object.create(EventEmitter.prototype);

/**
 * @param {Request} request
 * @return {Promise<ApiResponse>}
 */
Client.prototype.sendRequest = function(request) {

    var apiResponse = new ApiResponse_1({
        externals: this._externals,
        request: request
    });

    return (new this._externals.Promise(function(resolve) {

        //TODO Stop request if listeners return false
        this.emit(this.events.beforeRequest, apiResponse);

        resolve(this._loadResponse(request));

    }.bind(this))).then(function(response) {

        return apiResponse.receiveResponse(response);

    }).then(function() {

        if (!apiResponse.ok()) throw new Error('Response has unsuccessful status');

        this.emit(this.events.requestSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (!e.apiResponse) e = this.makeError(e, apiResponse);

        this.emit(this.events.requestError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @return {Promise<Response>}
 * @private
 */
Client.prototype._loadResponse = function(request) {
    return this._externals.fetch.call(null, request);
};

/**
 * Wraps the JS Error object with transaction information
 * @param {Error|IApiError} e
 * @param {ApiResponse} apiResponse
 * @return {IApiError}
 */
Client.prototype.makeError = function(e, apiResponse) {

    // Wrap only if regular error
    if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

        e.apiResponse = apiResponse;
        e.originalMessage = e.message;
        e.message = (apiResponse && apiResponse.error(true)) || e.originalMessage;

    }

    return e;

};

/**
 *
 * @param {object} init
 * @param {object} [init.url]
 * @param {object} [init.body]
 * @param {string} [init.method]
 * @param {object} [init.query]
 * @param {object} [init.headers]
 * @param {object} [init.credentials]
 * @param {object} [init.mode]
 * @return {Request}
 */
Client.prototype.createRequest = function(init) {

    init = init || {};
    init.headers = init.headers || {};

    // Sanity checks
    if (!init.url) throw new Error('Url is not defined');
    if (!init.method) init.method = 'GET';
    init.method = init.method.toUpperCase();
    if (init.method && Client._allowedMethods.indexOf(init.method) < 0) {
        throw new Error('Method has wrong value: ' + init.method);
    }

    // Defaults
    init.credentials = init.credentials || 'include';
    init.mode = init.mode || 'cors';

    // Append Query String
    if (init.query) {
        init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + qs$2.stringify(init.query);
    }

    if (!(findHeaderName('Accept', init.headers))) {
        init.headers.Accept = ApiResponse_1._jsonContentType;
    }

    // Serialize body
    if (isPlainObject(init.body) || !init.body) {

        var contentTypeHeaderName = findHeaderName(ApiResponse_1._contentType, init.headers);

        if (!contentTypeHeaderName) {
            contentTypeHeaderName = ApiResponse_1._contentType;
            init.headers[contentTypeHeaderName] = ApiResponse_1._jsonContentType;
        }

        var contentType = init.headers[contentTypeHeaderName];

        // Assign a new encoded body
        if (contentType.indexOf(ApiResponse_1._jsonContentType) > -1) {
            if ((init.method === 'GET' || init.method === 'HEAD') && !!init.body) {
                // oddly setting body to null still result in TypeError in phantomjs
                init.body = undefined;
            } else {
                init.body = JSON.stringify(init.body);
            }

        } else if (contentType.indexOf(ApiResponse_1._urlencodedContentType) > -1) {
            init.body = qs$2.stringify(init.body);
        }

    }

    // Create a request with encoded body
    var req = new this._externals.Request(init.url, init);

    // Keep the original body accessible directly (for mocks)
    req.originalBody = init.body;

    return req;

};

/**
 * @typedef {object} IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */

var Client_1 = Client;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var root = (typeof window !== "undefined" && window) ||
           (typeof commonjsGlobal !== "undefined" && commonjsGlobal) ||
           (function(){ return this; })();

/**
 * @constructor
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @property {PubNub} PubNub
 * @property {Storage} localStorage
 * @property {function(new:Promise)} Promise
 * @property {fetch} fetch
 * @property {function(new:Request)} Request
 * @property {function(new:Response)} Response
 * @property {function(new:Headers)} Headers
 */
function Externals(options) {

    options = options || {};

    this.PubNub = options.PubNub || root.PubNub || pubnub;
    this.localStorage = options.localStorage || ((typeof root.localStorage !== 'undefined') ? root.localStorage : {});
    this.Promise = options.Promise || root.Promise || (es6Promise && es6Promise.Promise);

    var fetchPonyfill$$1 = fetchPonyfill ? fetchPonyfill({Promise: this.Promise}) : {};

    this.fetch = options.fetch || root.fetch || fetchPonyfill$$1.fetch;
    this.Request = options.Request || root.Request || fetchPonyfill$$1.Request;
    this.Response = options.Response || root.Response || fetchPonyfill$$1.Response;
    this.Headers = options.Headers || root.Headers || fetchPonyfill$$1.Headers;

    /* istanbul ignore next */
    if (!this.fetch || !this.Response || !this.Request || !this.Headers) {
        throw new Error('Fetch API is missing');
    }

    /* istanbul ignore next */
    if (!this.Promise) {
        throw new Error('Promise is missing');
    }

    /* istanbul ignore next */
    if (!this.localStorage) {
        throw new Error('LocalStorage is missing');
    }

    /* istanbul ignore next */
    if (!this.PubNub) {
        throw new Error('PubNub is missing');
    }

}

var Externals_1 = Externals;

/**
 * @param {Cache} options.cache
 * @param {string} options.cacheId
 * @param {int} [options.refreshHandicapMs]
 * @constructor
 * @property {Cache} _cache
 * @property {int} _refreshHandicapMs
 * @property {string} _cacheId
 */
function Auth(options) {

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._cacheId = options.cacheId;

    /** @private */
    this._refreshHandicapMs = options.refreshHandicapMs || 60 * 1000; // 1 minute

}

Auth.prototype.accessToken = function() {
    return this.data().access_token;
};

Auth.prototype.refreshToken = function() {
    return this.data().refresh_token;
};

Auth.prototype.tokenType = function() {
    return this.data().token_type;
};

/**
 * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
 */
Auth.prototype.data = function() {

    return this._cache.getItem(this._cacheId) || {
            token_type: '',
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        };

};

/**
 * @param {object} newData
 * @return {Auth}
 */
Auth.prototype.setData = function(newData) {

    newData = newData || {};

    var data = this.data();

    Object.keys(newData).forEach(function(key) {
        data[key] = newData[key];
    });

    data.expire_time = Date.now() + (data.expires_in * 1000);
    data.refresh_token_expire_time = Date.now() + (data.refresh_token_expires_in * 1000);

    this._cache.setItem(this._cacheId, data);

    return this;

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.accessTokenValid = function() {

    var authData = this.data();
    return (authData.expire_time - this._refreshHandicapMs > Date.now());

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.refreshTokenValid = function() {

    return (this.data().refresh_token_expire_time > Date.now());

};

/**
 * @return {Auth}
 */
Auth.prototype.cancelAccessToken = function() {

    return this.setData({
        access_token: '',
        expires_in: 0
    });

};

var Auth_1 = Auth;

//export interface IAuthData {
//    remember?:boolean;
//    token_type?:string;
//    access_token?:string;
//    expires_in?:number; // actually it's string
//    expire_time?:number;
//    refresh_token?:string;
//    refresh_token_expires_in?:number; // actually it's string
//    refresh_token_expire_time?:number;
//    scope?:string;
//}

var name = "ringcentral";
var version = "3.1.3";
var scripts = {"clean":"rm -rf build/*","uglify":"uglifyjs --compress --output build/ringcentral.min.js  --source-map 'filename=build/ringcentral.js.map' build/ringcentral.js","rollup":"rollup -c rollup.config.js","build":"npm run clean && npm run rollup && npm run uglify","watch":"npm run rollup -- --watch","test":"npm run hint && npm run build && npm run istanbul && npm run karma && npm run karma-webpack","mocha":"mocha --opts mocha.opts","mocha-watch":"npm run mocha -- --watch","mocha-api":"mocha ./test-api/**/*-spec.js","karma":"karma start karma.conf.js","karma-watch":"npm run karma -- --no-single-run --auto-watch","karma-webpack":"karma start karma.conf.webpack.js","karma-webpack-watch":"npm run karma-webpack -- --no-single-run --auto-watch","istanbul":"istanbul cover _mocha -- --opts mocha.opts","coveralls":"cat ./build/coverage/lcov.info | coveralls","start":"http-server -p 3030","docs":"jsdoc2md 'src/**/*!(test).js' > API.md","hint":"jshint src/**/*.js"};
var dependencies = {"es6-promise":"^4.0.5","fetch-ponyfill":"^3.0.2","is-plain-object":"^2.0.1","object-assign":"^4.1.0","pubnub":"^4.4.2"};
var devDependencies = {"chai":"3.5.0","coveralls":"2.13.1","fetch-mock":"5.9.4","http-server":"0.9.0","istanbul":"0.4.5","jsdoc-to-markdown":"2.0.1","jshint":"2.9.4","json-loader":"0.5.4","karma":"1.4.1","karma-chai-plugins":"0.8.0","karma-chrome-launcher":"2.0.0","karma-coverage":"1.1.1","karma-firefox-launcher":"1.0.0","karma-html-reporter":"0.2.6","karma-mocha":"1.3.0","karma-mocha-reporter":"2.2.2","karma-phantomjs-launcher":"1.0.2","karma-sourcemap-loader":"0.3.5","karma-webpack":"2.0.2","mocha":"3.2.0","phantomjs-prebuilt":"2.1.14","rollup":"^0.50.0","rollup-plugin-commonjs":"^8.2.4","rollup-plugin-json":"^2.3.0","rollup-plugin-node-builtins":"^2.1.2","rollup-plugin-node-resolve":"^3.0.0","rollup-plugin-virtual":"^1.0.1","sinon":"1.17.7","soap":"0.18.0","uglify-js":"^3.1.5","webpack":"^3.8.1","whatwg-fetch":"2.0.2"};
var jsdoc2md = {"separators":true,"module-index-format":"grouped","param-list-format":"table","property-list-format":"table"};
var jshintConfig = {"curly":false,"expr":true,"indent":4,"latedef":true};
var preferGlobal = false;
var main = "./src/SDK.js";
var author = {"name":"RingCentral, Inc.","email":"devsupport@ringcentral.com"};
var contributors = [{"name":"Kirill Konshin"}];
var repository = {"type":"git","url":"git://github.com/ringcentral/ringcentral-js.git"};
var bugs = {"url":"https://github.com/ringcentral/ringcentral-js/issues"};
var homepage = "https://github.com/ringcentral/ringcentral-js";
var engines = {"node":">=0.10.36"};
var license = "MIT";
var _package = {
	name: name,
	version: version,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	jsdoc2md: jsdoc2md,
	jshintConfig: jshintConfig,
	preferGlobal: preferGlobal,
	main: main,
	author: author,
	contributors: contributors,
	repository: repository,
	bugs: bugs,
	homepage: homepage,
	engines: engines,
	license: license,
	"private": false
};

var _package$1 = Object.freeze({
	name: name,
	version: version,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	jsdoc2md: jsdoc2md,
	jshintConfig: jshintConfig,
	preferGlobal: preferGlobal,
	main: main,
	author: author,
	contributors: contributors,
	repository: repository,
	bugs: bugs,
	homepage: homepage,
	engines: engines,
	license: license,
	default: _package
});

var require$$0$1 = ( _package$1 && _package ) || _package$1;

var Constants = {
    version: require$$0$1.version,
    authResponseProperty: 'RCAuthorizationResponse'
};

var EventEmitter$3 = require$$0.EventEmitter;






/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {Client} options.client
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Promise<ApiResponse>} _refreshPromise
 * @property {Auth} _auth
 */
function Platform(options) {

    EventEmitter$3.call(this);

    this.events = {
        beforeLogin: 'beforeLogin',
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        beforeRefresh: 'beforeRefresh',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError',
        beforeLogout: 'beforeLogout',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError',
        rateLimitError: 'rateLimitError'
    };

    options = options || {};

    /** @private */
    this._server = options.server;

    /** @private */
    this._appKey = options.appKey;

    /** @private */
    this._appSecret = options.appSecret;

    /** @private */
    this._redirectUri = options.redirectUri || '';

    /** @private */
    this._refreshDelayMs = options.refreshDelayMs || 100;

    /** @private */
    this._clearCacheOnRefreshError = typeof options.clearCacheOnRefreshError !== 'undefined' ?
                                     options.clearCacheOnRefreshError :
                                     true;

    /** @private */
    this._userAgent = (options.appName ?
                      (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' :
                       '') + 'RCJSSDK/' + Constants.version;

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._client = options.client;

    /** @private */
    this._refreshPromise = null;

    /** @private */
    this._auth = new Auth_1({
        cache: this._cache,
        cacheId: Platform._cacheId,
        refreshHandicapMs: options.refreshHandicapMs
    });

}

Platform._urlPrefix = '/restapi';
Platform._apiVersion = 'v1.0';
Platform._tokenEndpoint = '/restapi/oauth/token';
Platform._revokeEndpoint = '/restapi/oauth/revoke';
Platform._authorizeEndpoint = '/restapi/oauth/authorize';
Platform._cacheId = 'platform';

Platform.prototype = Object.create(EventEmitter$3.prototype);

Platform.prototype.delay = function(timeout) {
    return new this._externals.Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(null);
        }, timeout);
    });
};

/**
 * @return {Auth}
 */
Platform.prototype.auth = function() {
    return this._auth;
};

/**
 * @return {Client}
 */
Platform.prototype.client = function() {
    return this._client;
};

/**
 * @param {string} path
 * @param {object} [options]
 * @param {boolean} [options.addServer]
 * @param {string} [options.addMethod]
 * @param {boolean} [options.addToken]
 * @return {string}
 */
Platform.prototype.createUrl = function(path, options) {

    path = path || '';
    options = options || {};

    var builtUrl = '',
        hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

    if (options.addServer && !hasHttp) builtUrl += this._server;

    if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

    builtUrl += path;

    if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

    if (options.addMethod) builtUrl += '_method=' + options.addMethod;
    if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

    return builtUrl;

};

/**
 * @param {string} [options.redirectUri] Overrides default RedirectURI
 * @param {string} [options.state]
 * @param {string} [options.brandId]
 * @param {string} [options.display]
 * @param {string} [options.prompt]
 * @param {boolean} [options.implicit] Use Implicit Grant flow
 * @return {string}
 */
Platform.prototype.loginUrl = function(options) {

    options = options || {};

    return this.createUrl(Platform._authorizeEndpoint + '?' + qs$2.stringify({
            'response_type': options.implicit ? 'token' : 'code',
            'redirect_uri': options.redirectUri || this._redirectUri,
            'client_id': this._appKey,
            'state': options.state || '',
            'brand_id': options.brandId || '',
            'display': options.display || '',
            'prompt': options.prompt || ''
        }), {addServer: true});

};

/**
 * @param {string} url
 * @return {Object}
 */
Platform.prototype.parseLoginRedirect = function(url) {

    function getParts(url, separator) {
        return url.split(separator).reverse()[0];
    }

    var response = (url.indexOf('#') === 0 && getParts(url, '#')) ||
                   (url.indexOf('?') === 0 && getParts(url, '?')) ||
                   null;

    if (!response) throw new Error('Unable to parse response');

    var queryString = qs$2.parse(response);

    if (!queryString) throw new Error('Unable to parse response');

    var error = queryString.error_description || queryString.error;

    if (error) {
        var e = new Error(error);
        e.error = queryString.error;
        throw e;
    }

    return queryString;

};

/**
 * Convenience method to handle 3-legged OAuth
 *
 * Attention! This is an experimental method and it's signature and behavior may change without notice.
 *
 * @experimental
 * @param {string} options.url
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {object} [options.login] additional options for login()
 * @param {string} [options.origin]
 * @param {string} [options.property] name of window.postMessage's event data property
 * @param {string} [options.target] target for window.open()
 * @return {Promise}
 */
Platform.prototype.loginWindow = function(options) {

    return new this._externals.Promise(function(resolve, reject) {

        if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

        if (!options.url) throw new Error('Missing mandatory URL parameter');

        options = options || {};
        options.width = options.width || 400;
        options.height = options.height || 600;
        options.origin = options.origin || window.location.origin;
        options.property = options.property || Constants.authResponseProperty;
        options.target = options.target || '_blank';

        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (options.width / 2)) + dualScreenLeft;
        var top = ((height / 2) - (options.height / 2)) + dualScreenTop;
        var win = window.open(options.url, '_blank', (options.target == '_blank') ? 'scrollbars=yes, status=yes, width=' + options.width + ', height=' + options.height + ', left=' + left + ', top=' + top : '');

        if (!win) {
            throw new Error('Could not open login window. Please allow popups for this site');
        }

        if (win.focus) win.focus();

        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
        var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

        var eventListener = function(e) {

            try {

                if (e.origin != options.origin) return;
                if (!e.data || !e.data[options.property]) return; // keep waiting

                win.close();
                window[eventRemoveMethod](messageEvent, eventListener);


                var loginOptions = this.parseLoginRedirect(e.data[options.property]);

                if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

                resolve(loginOptions);

                /* jshint -W002 */
            } catch (e) {
                reject(e);
            }

        }.bind(this);

        window[eventMethod](messageEvent, eventListener, false);

    }.bind(this));

};

/**
 * @return {Promise<boolean>}
 */
Platform.prototype.loggedIn = function() {

    return this.ensureLoggedIn().then(function() {
        return true;
    }).catch(function() {
        return false;
    });

};

/**
 * @param {string} options.username
 * @param {string} options.password
 * @param {string} [options.extension]
 * @param {string} [options.code]
 * @param {string} [options.redirectUri]
 * @param {string} [options.endpointId]
 * @param {string} [options.accessTokenTtl]
 * @param {string} [options.refreshTokenTtl]
 * @param {string} [options.access_token]
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.login = function(options) {

    return (new this._externals.Promise(function(resolve) {

        options = options || {};

        this.emit(this.events.beforeLogin);

        var body = {};

        if (options.access_token) {

            //TODO Potentially make a request to /oauth/tokeninfo
            return resolve(options);

        }

        if (!options.code) {

            body.grant_type = 'password';
            body.username = options.username;
            body.password = options.password;
            body.extension = options.extension || '';

        } else if (options.code) {

            body.grant_type = 'authorization_code';
            body.code = options.code;
            body.redirect_uri = options.redirectUri || this._redirectUri;
            //body.client_id = this.getCredentials().key; // not needed

        }

        if (options.endpointId) body.endpoint_id = options.endpointId;
        if (options.accessTokenTtl) body.accessTokenTtl = options.accessTokenTtl;
        if (options.refreshTokenTtl) body.refreshTokenTtl = options.refreshTokenTtl;

        resolve(this._tokenRequest(Platform._tokenEndpoint, body));

    }.bind(this))).then(function(res) {

        var apiResponse = res.json ? res : null;
        var json = apiResponse && apiResponse.json() || res;

        this._auth.setData(json);

        this.emit(this.events.loginSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.loginError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 * @private
 */
Platform.prototype._refresh = function() {

    return this.delay(this._refreshDelayMs).then(function() {

        this.emit(this.events.beforeRefresh);

        // Perform sanity checks
        if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
        if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

        return this._tokenRequest(Platform._tokenEndpoint, {
            "grant_type": "refresh_token",
            "refresh_token": this._auth.refreshToken(),
            "access_token_ttl": this._auth.data().expires_in + 1,
            "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
        });

    }.bind(this)).then(function(/** @type {ApiResponse} */ res) {

        var json = res.json();

        if (!json.access_token) {
            throw this._client.makeError(new Error('Malformed OAuth response'), res);
        }

        this._auth.setData(json);

        this.emit(this.events.refreshSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        e = this._client.makeError(e);

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.refreshError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.refresh = function() {

    if (!this._refreshPromise) {

        this._refreshPromise = this._refresh()
            .then(function(res) {
                this._refreshPromise = null;
                return res;
            }.bind(this))
            .catch(function(e) {
                this._refreshPromise = null;
                throw e;
            }.bind(this));

    }

    return this._refreshPromise;

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.logout = function() {

    return (new this._externals.Promise(function(resolve) {

        this.emit(this.events.beforeLogout);

        resolve(this._tokenRequest(Platform._revokeEndpoint, {
            token: this._auth.accessToken()
        }));

    }.bind(this))).then(function(res) {

        this._cache.clean();

        this.emit(this.events.logoutSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        this.emit(this.events.logoutError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<Request>}
 */
Platform.prototype.inflateRequest = function(request, options) {

    options = options || {};

    if (options.skipAuthCheck) return this._externals.Promise.resolve(request);

    return this.ensureLoggedIn().then(function() {

        request.headers.set('X-User-Agent', this._userAgent);
        request.headers.set('Client-Id', this._appKey);
        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        return request;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @param {boolean} [options.retry] Will be set by this method if SDK makes second request
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.sendRequest = function(request, options) {

    return this.inflateRequest(request, options).then(function(request) {

        options = options || {};

        return this._client.sendRequest(request);

    }.bind(this)).catch(function(e) {

        // Guard is for errors that come from polling
        if (!e.apiResponse || !e.apiResponse.response() || options.retry) throw e;

        var response = e.apiResponse.response();
        var status = response.status;

        if ((status != ApiResponse_1._unauthorizedStatus) &&
            (status != ApiResponse_1._rateLimitStatus)) throw e;

        options.retry = true;

        var retryAfter = 0;

        if (status == ApiResponse_1._unauthorizedStatus) {
            this._auth.cancelAccessToken();
        }

        if (status == ApiResponse_1._rateLimitStatus) {

            var defaultRetryAfter = (!options.handleRateLimit || typeof options.handleRateLimit == 'boolean' ? 60 : options.handleRateLimit);

            // FIXME retry-after is custom header, by default, it can't be retrieved. Server should add header: 'Access-Control-Expose-Headers: retry-after'.
            retryAfter = parseFloat(response.headers.get('retry-after') || defaultRetryAfter) * 1000;

            e.retryAfter = retryAfter;

            this.emit(this.events.rateLimitError, e);

            if (!options.handleRateLimit) throw e;

        }

        return this.delay(retryAfter).then(function() {
            return this.sendRequest(request, options);
        }.bind(this));

    }.bind(this));

};

/**
 * General purpose function to send anything to server
 * @param {string} options.url
 * @param {object} [options.body]
 * @param {string} [options.method]
 * @param {object} [options.query]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.send = function(options) {

    options = options || {};

    //FIXME https://github.com/bitinn/node-fetch/issues/43
    options.url = this.createUrl(options.url, {addServer: true});

    return this.sendRequest(this._client.createRequest(options), options);

};

/**
 * @param {string} url
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.get = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'GET', url: url, query: query}, options));
};

/**
 * @param {string} url
 * @param {object} body
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.post = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'POST', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {object} [body]
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.put = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'PUT', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {string} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean|int} [options.handleRateLimit]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype['delete'] = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'DELETE', url: url, query: query}, options));
};

Platform.prototype.ensureLoggedIn = function() {
    if (this._isAccessTokenValid()) return this._externals.Promise.resolve();
    return this.refresh();
};

/**
 * @param path
 * @param body
 * @return {Promise.<ApiResponse>}
 * @private
 */
Platform.prototype._tokenRequest = function(path, body) {

    return this.send({
        url: path,
        skipAuthCheck: true,
        body: body,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + this._apiKey(),
            'Content-Type': ApiResponse_1._urlencodedContentType
        }
    });

};

/**
 * @return {boolean}
 * @private
 */
Platform.prototype._isAccessTokenValid = function() {
    return this._auth.accessTokenValid();
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._apiKey = function() {
    var apiKey = this._appKey + ':' + this._appSecret;
    return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._authHeader = function() {
    var token = this._auth.accessToken();
    return this._auth.tokenType() + (token ? ' ' + token : '');
};

var Platform_1 = Platform;

var EventEmitter$4 = require$$0.EventEmitter;

// detect ISO 8601 format string with +00[:00] timezone notations
var ISO_REG_EXP = /(\+[\d]{2}):?([\d]{2})?$/;

function buildIEFriendlyString(match, $1, $2) {
    return $1 + ':' + ($2 || '00');
}

/**
 *
 * @param {string} time
 * @return {number}
 */
function parseISOString(time) {
    time = time || 0;
    if (typeof time === 'string') {
        return Date.parse(time.replace(ISO_REG_EXP, buildIEFriendlyString));
    }
    return time;
}

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @property {Externals} _externals
 * @property {Platform} _platform
 * @property {int} _pollInterval
 * @property {int} _renewHandicapMs
 * @property {PubNub} _pubnub
 * @property {string} _pubnubLastChannel
 * @property {int} _timeout
 * @property {ISubscription} _subscription
 * @constructor
 */
function Subscription(options) {

    EventEmitter$4.call(this);

    options = options || {};

    this.events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError',
        automaticRenewSuccess: 'automaticRenewSuccess',
        automaticRenewError: 'automaticRenewError'
    };

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._platform = options.platform;

    /** @private */
    this._pollInterval = options.pollInterval || 10 * 1000;

    /** @private */
    this._renewHandicapMs = options.renewHandicapMs || 2 * 60 * 1000;

    /** @private */
    this._pubnub = null;

    /** @private */
    this._pubnubLastChannel = null;

    /** @private */
    this._pubnubLastSubscribeKey = null;

    /** @private */
    this._timeout = null;

    /** @private */
    this._subscription = null;

}

Subscription.prototype = Object.create(EventEmitter$4.prototype);

Subscription.prototype.subscribed = function() {

    var subscription = this.subscription();

    return !!(subscription.id &&
              subscription.deliveryMode &&
              subscription.deliveryMode.subscriberKey &&
              subscription.deliveryMode.address);

};

/**
 * @return {boolean}
 */
Subscription.prototype.alive = function() {
    return this.subscribed() && Date.now() < this.expirationTime();
};

/**
 * @return {boolean}
 */
Subscription.prototype.expired = function() {
    if (!this.subscribed()) return true;
    return !this.subscribed() || Date.now() > parseISOString(this.subscription().expirationTime);
};

/**
 * @return {number}
 */
Subscription.prototype.expirationTime = function() {
    return parseISOString(this.subscription().expirationTime) - this._renewHandicapMs;
};

/**
 * @param {ISubscription} subscription
 * @return {Subscription}
 */
Subscription.prototype.setSubscription = function(subscription) {

    subscription = subscription || {};

    this._clearTimeout();
    this._setSubscription(subscription);
    this._subscribeAtPubnub();
    this._setTimeout();

    return this;

};

/**
 * @return {ISubscription}
 */
Subscription.prototype.subscription = function() {
    return this._subscription || {};
};

/**
 * Creates or updates subscription if there is an active one
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.register = function() {

    if (this.alive()) {
        return this.renew();
    } else {
        return this.subscribe();
    }

};

/**
 * @return {string[]}
 */
Subscription.prototype.eventFilters = function() {
    return this.subscription().eventFilters || [];
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.addEventFilters = function(events) {
    this.setEventFilters(this.eventFilters().concat(events));
    return this;
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.setEventFilters = function(events) {
    var subscription = this.subscription();
    subscription.eventFilters = events;
    this._setSubscription(subscription);
    return this;
};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.subscribe = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.post('/subscription', {
            eventFilters: this._getFullEventFilters(),
            deliveryMode: {
                transportType: 'PubNub'
            }
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.subscribeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);
        // `reset` will remove pubnub instance.
        // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
        this.reset()
            .emit(this.events.subscribeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.renew = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.subscribed()) throw new Error('No subscription');

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.put('/subscription/' + this.subscription().id, {
            eventFilters: this._getFullEventFilters()
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.renewSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);
        // `reset` will remove pubnub instance.
        // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
        this.reset()
            .emit(this.events.renewError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.remove = function() {

    return (new this._externals.Promise(function(resolve) {

        if (!this.subscribed()) throw new Error('No subscription');

        resolve(this._platform.delete('/subscription/' + this.subscription().id));

    }.bind(this))).then(function(response) {

        this.reset()
            .emit(this.events.removeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.emit(this.events.removeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.resubscribe = function() {
    var filters = this.eventFilters();
    return this.reset().setEventFilters(filters).subscribe();
};

/**
 * Remove subscription and disconnect from PubNub
 * This method resets subscription at client side but backend is not notified
 * @return {Subscription}
 */
Subscription.prototype.reset = function() {
    this._clearTimeout();
    this._unsubscribeAtPubnub();
    this._setSubscription(null);
    return this;
};

/**
 * @param subscription
 * @private
 */
Subscription.prototype._setSubscription = function(subscription) {
    this._subscription = subscription;
};

/**
 * @return {string[]}
 * @private
 */
Subscription.prototype._getFullEventFilters = function() {

    return this.eventFilters().map(function(event) {
        return this._platform.createUrl(event);
    }.bind(this));

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._setTimeout = function() {

    this._clearTimeout();

    if (!this.alive()) throw new Error('Subscription is not alive');

    this._timeout = setInterval(function() {

        if (this.alive()) {
            return;
        }

        this._clearTimeout();

        (new this._externals.Promise(function(resolve) {

            if (this.expired()) {
                resolve(this.subscribe());
            } else {
                resolve(this.renew());
            }

        }.bind(this))).then(function(res) {

            this.emit(this.events.automaticRenewSuccess, res);

        }.bind(this)).catch(function(e) {

            this.emit(this.events.automaticRenewError, e);

        }.bind(this));

    }.bind(this), this._pollInterval);

    return this;

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._clearTimeout = function() {
    clearInterval(this._timeout);
    return this;
};

Subscription.prototype._decrypt = function(message) {

    if (!this.subscribed()) throw new Error('No subscription');

    if (this.subscription().deliveryMode.encryptionKey) {

        message = this._pubnub.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
            encryptKey: false,
            keyEncoding: 'base64',
            keyLength: 128,
            mode: 'ecb'
        });

    }

    return message;

};

/**
 * @param message
 * @return {Subscription}
 * @private
 */
Subscription.prototype._notify = function(message) {
    this.emit(this.events.notification, this._decrypt(message));
    return this;
};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._subscribeAtPubnub = function() {

    if (!this.alive()) throw new Error('Subscription is not alive');

    var deliveryMode = this.subscription().deliveryMode;

    if (this._pubnub) {

        if (this._pubnubLastChannel === deliveryMode.address) {

            // Nothing to update, keep listening to same channel
            return this;

        } else if (this._pubnubLastSubscribeKey && this._pubnubLastSubscribeKey !== deliveryMode.subscriberKey) {

            // Subscribe key changed, need to reset everything
            this._unsubscribeAtPubnub();

        } else if (this._pubnubLastChannel) {

            // Need to subscribe to new channel
            this._pubnub.unsubscribeAll();

        }

    }

    if (!this._pubnub) {

        this._pubnubLastSubscribeKey = deliveryMode.subscriberKey;

        var PubNub = this._externals.PubNub;

        this._pubnub = new PubNub({
            ssl: true,
            restore: true,
            subscribeKey: deliveryMode.subscriberKey
        });

        this._pubnub.addListener({
            status: function(statusEvent) {},
            message: function(m) {
                this._notify(m.message); // all other props are ignored
            }.bind(this)
        });

    }

    this._pubnubLastChannel = deliveryMode.address;
    this._pubnub.subscribe({channels: [deliveryMode.address]});

    return this;

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._unsubscribeAtPubnub = function() {

    if (!this.subscribed() || !this._pubnub) return this;

    this._pubnub.removeAllListeners();
    this._pubnub.destroy(); // this will unsubscribe from all

    this._pubnubLastSubscribeKey = null;
    this._pubnubLastChannel = null;
    this._pubnub = null;

    return this;

};

var Subscription_1 = Subscription;

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} ISubscription
 * @property {string} [id]
 * @property {string} [uri]
 * @property {string[]} [eventFilters]
 * @property {string} [expirationTime] Format: 2014-03-12T19:54:35.613+0000
 * @property {int} [expiresIn]
 * @property {string} [deliveryMode.transportType]
 * @property {boolean} [deliveryMode.encryption]
 * @property {string} [deliveryMode.address]
 * @property {string} [deliveryMode.subscriberKey]
 * @property {string} [deliveryMode.encryptionKey]
 * @property {string} [deliveryMode.secretKey]
 * @property {string} [creationTime]
 * @property {string} [status] Active
 */

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 * @constructor
 * @property {Cache} _cache
 * @extends Subscription
 */
function CachedSubscription(options) {

    options = options || {};

    if (!options.cacheKey) throw new Error('Cached Subscription requires cacheKey parameter to be defined');

    /** @private */
    this._cacheKey = options.cacheKey;

    Subscription_1.call(this, options);

    /** @private */
    this._cache = options.cache;

    // This is not used in this class
    this._subscription = undefined;

}

CachedSubscription.prototype = Object.create(Subscription_1.prototype);

CachedSubscription.prototype.subscription = function() {
    return this._cache.getItem(this._cacheKey) || {};
};

CachedSubscription.prototype._setSubscription = function(subscription) {
    return this._cache.setItem(this._cacheKey, subscription);
};

/**
 * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
 * @param {string[]} events
 * @return {CachedSubscription}
 */
CachedSubscription.prototype.restore = function(events) {

    if (!this.eventFilters().length) {
        this.setEventFilters(events);
    }

    return this;

};

var CachedSubscription_1 = CachedSubscription;

/**
 * @namespace RingCentral
 */









/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.cachePrefix]
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Platform} _platform
 */
function SDK(options) {

    /** @private */
    this._externals = new Externals_1(options);

    /** @private */
    this._cache = new Cache_1({
        externals: this._externals,
        prefix: options.cachePrefix
    });

    /** @private */
    this._client = new Client_1(this._externals);

    /** @private */
    this._platform = new Platform_1(objectAssign({}, options, {
        externals: this._externals,
        client: this._client,
        cache: this._cache
    }));

}

SDK.version = Constants.version;

SDK.server = {
    sandbox: 'https://platform.devtest.ringcentral.com',
    production: 'https://platform.ringcentral.com'
};

/**
 * @return {Platform}
 */
SDK.prototype.platform = function() {
    return this._platform;
};

/**
 * @return {Cache}
 */
SDK.prototype.cache = function() {
    return this._cache;
};

/**
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {Subscription}
 */
SDK.prototype.createSubscription = function(options) {
    return new Subscription_1(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform
    }));
};

/**
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 */
SDK.prototype.createCachedSubscription = function(options) {

    if (typeof arguments[0] === 'string') {
        options = {cacheKey: arguments[0].toString()};
    } else {
        options = options || {};
    }

    return new CachedSubscription_1(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform,
        cache: this._cache
    }));

};

SDK.handleLoginRedirect = function(origin, win) {

    win = win || window;

    var response = win.location.hash ? win.location.hash : win.location.search;
    var msg = {};
    msg[Constants.authResponseProperty] = response;
    win.opener.postMessage(msg, origin || win.location.origin);

};

var SDK_1 = SDK;

return SDK_1;

})));
//# sourceMappingURL=ringcentral.js.map
