/**
 * @file e3_js.js
 *
 * @author rgkimball
 * @see https://github.com/rgkimball/e3_js for documentation and usage
 *
 * JavaScript should be made compatible with libraries other than jQuery by
 * wrapping it with an "anonymous closure". See:
 * - http://drupal.org/node/1446420
 * - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
 *
 * Precede IIFEs with a ! to prevent file concatenation errors;
 * this simplifies ;(function(){})(); to !function(){}()
 */

!function ($, Drupal, window, document, undefined) {

  window.e3 = {

    version: '0.3.0',

    win: $(window),
    doc: $(document),

    // These should match whatever is defined in _base.scss:
    breakpoints: [460,768,960,1280],

    // Leave each of these objects empty. They are called sequentially below
    // You can queue a function using e3.{object}.myFunc()
    //   This prevents bogging down the page with multiple function calls
    //   and other mistakes, like having multiple resize handlers
    load: {},
    behaviors: {},
    click: {},
    resize: {},
    scroll: {},
    delay: {},

    // Helper functions
    url: function(int) {
      // Works like Drupal's arg(), but gets path arguments instead
      // used to check if an argument is part of the URL, eg. arg(0) == 'front'
      var args = window.location.href.split('?')[0].split('#')[0].split('/');
      var check = int + 3; // assumes :// is in url, so first 3 items irrelevant
      if (typeof args[check] == 'undefined') {
        return false;
      } else {
        return args[check];
      }
    },

    getUrl: function() {
      // Turns items of the URL into an array
      var vars = [],
        args = window.location.href.split('?')[0].split('/');
      for (var i = 0; i < args.length; i++) {
        if(i > 2) {
          vars.push(args[i]);
        }
      }
      return vars;
    },

    getQuery: function() {
      var vars = [], hash;
      if(window.location.href.indexOf('?') > -1) {
        var hashes = window.location.href.split('?')[1].split('&');
        for(var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
      } else {
        return false;
      }
    },

    // Call bundle's own functions.
    callEach: function(bundle) {
      for (func in bundle) {
        if (bundle.hasOwnProperty(func) && e3.isFuncOf(func, bundle)) {
          var args = [].slice.call(arguments,1);
          bundle[func].apply(bundle, args);
        }
      }
    },

    // Checks if object is a function.
    isFuncOf: function(func, parent) {
      return Object.prototype.toString.call(parent[func]) === '[object Function]';
    }

  };

  // Shortcut vars
  e3.bpmobile  = e3.breakpoints[0];
  e3.bptablet  = e3.breakpoints[1];
  e3.bpdesktop = e3.breakpoints[2];
  e3.bphuge    = e3.breakpoints[3];

  e3.load.timerInit = function() {
    e3.startTime = (new Date).getTime();
    e3.timer = true;

    e3.getTime = function() {
      if(e3.timer == true) {
        e3.time = (((new Date).getTime() - e3.startTime)/1000).toFixed(20);
        e3.callEach(e3.delay, e3.time);
      }
    }

    setInterval(e3.getTime,1000);
  };

  // Acquire contextual objects from Drupal.settings.e3
  e3.load.init = function() {
    if (!!Drupal.settings.e3) {
      $.extend(e3, Drupal.settings.e3);
    }
  }

  e3.doc.ready(function() {

    // Nothing here should need to be changed; add functionality in new files
    // prefixed with the Drupal object

    !function() {
      once(e3.callEach(e3.load));
      var width = e3.win.width(), height = e3.win.height();
      once(e3.callEach(e3.resize, width, height));
    }(); // Runs all load, resize and scroll functions once

    e3.win.click(
      throttle((function(e) {
        e3.callEach(e3.click, e.toElement, e);
      }), 100)
    );

    e3.win.resize(
      throttle((function() {
        e3.callEach(e3.resize, e3.win.width(), e3.win.height());
      }), 250)
    );

    e3.win.scroll(
      throttle((function() {
        e3.callEach(e3.scroll, e3.win.scrollTop());
      }), 200)
    );
  });

  Drupal.behaviors.e3 = {
    attach: function(settings, context) {
      !function() {
        e3.callEach(e3.behaviors, settings, context);
      }();
    }
  };

  // The following functions, throttle, once, and dependencies are borrowed from
  // underscore.js: @see https://github.com/jashkenas/underscore

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  };

  var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // For creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!isObject(prototype)) return {};
    if (Object.create) return Object.create(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var partial = function(func) {
    var boundArgs = Array.prototype.slice.call(arguments, 1);
    return function bound() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        args[i] = arguments[position++]; // assume valid.
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
  };

  var throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var now = e3.time;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : now;
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  var before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  var once = partial(before, 2);

}(jQuery, Drupal, this, this.document);
