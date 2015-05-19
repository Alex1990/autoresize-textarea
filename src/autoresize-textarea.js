/*!
 * autoresize-textarea.js - automatically resize the textarea's height
 * https://github.com/Alex1990/autoresize-textarea
 * Under the MIT License | (c) 2015 Alex Chao
 */

!(function(global, factory) {

  // Uses CommonJS, AMD or browser global to create a jQuery plugin.
  // See: https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // Expose this plugin as an AMD module. Register an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS module
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(global.jQuery, global);
  }

}(this, function($, global) {

  'use strict';

  // Shortand.
  var win = window;
  var doc = document;
  var ua  = navigator.userAgent;

  var ie;
  var match;

  // Detect the IE version.
  if (/msie|trident/i.test(ua)) {
    match = ua.match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
    ie = (match && match.length > 1 && match[1]) || '';
  }

  // An attachEvent/detachEvent wrapper to save bytes.
  var addEvent = function(elem, event, listener) {
    elem[event + listener] = function(e) {
      listener.call(elem, e);
    };
    elem.attachEvent('on' + event, elem[event + listener]);
  };
  var removeEvent = function(elem, event, listener) {
    elem.detachEvent('on' + event, elem[event + listener]);
  };

  // Get the computed style.
  // In IE9+ and other modern browsers, use window.getComputedStyle method.
  // In IE6-8, use Element.currentStyle object.
  var curCSS = function(elem, prop) {
    if (win.getComputedStyle) {
      return win.getComputedStyle(elem)[prop];
    } else if (elem.currentStyle) {
      return elem.currentStyle[prop];
    }
  };

  // Main function.
  var autoResize = function(elem, opts) {

    // Handle the different type parameters.
    if (opts == null) {
      opts = {};
    } else if (typeof opts === 'function') {
      opts = {
        onresizeheight: opts
      };
    }

    var lastValue = elem.value;
    elem.value = '';

    // In default, the textarea's height is integeral multiple of 
    // the line-height, and the offset between scrollHeight and height is 
    // the sum of top padding and bottom padding. But, in older IE, the height  
    // is less than the scrollHeight because the line-height cannot expand
    // the height. So you'd better always set the textarea's height explicitly.
    var vPadding = parseFloat(curCSS(elem, 'paddingTop')) + 
                   parseFloat(curCSS(elem, 'paddingBottom'));

    var offset = elem.scrollHeight - (elem.clientHeight - vPadding);
    elem.value = lastValue;

    var scrollListener;
    var tmpValue;

    if (ie < 9) {
      // For IE6-8, prevent the content jump when press  enter key quickly.
      scrollListener = function() {
        elem.scrollTop = 0;
      };
      addEvent(elem, 'scroll', scrollListener);

      // In IE6-8, the first Drop interaction may not trigger keyup/keydown/
      // propertychange/selectionchange event. The below code works for all
      // examples except example/as-a-native-plugin.html(IE8). In fact, I don't know why
      // it works.
      tmpValue = elem.value;
      elem.value = 'aa';
      elem.value = tmpValue;

      // Restore the Undo command in context menu.
      doc.execCommand('Undo');
      doc.execCommand('Undo');
      doc.execCommand('Undo');
      doc.execCommand('Undo');
    }

    var isInit = true;
    var lastHeight;

    // When the input event is fired and the content of textarea is changed,
    // remove the inline style height, and then set the inline style height
    // to scrollHeight excerpt for the top padding and bottom padding.
    var inputListener = function() {
      if (elem.value !== lastValue || isInit) {
        lastValue = elem.value;

        var tmpHeight = elem.style.height;
        elem.style.height = '';

        var setHeight = function() {
          var height = elem.scrollHeight - offset;

          // When opts.maxHeight is provided and the height of textarea is 
          // great than opts.maxHeight, the opts.maxHeight will be as the 
          // height, and the overflow-y will be set to auto.
          if (opts.maxHeight && height > opts.maxHeight) {
            elem.style.height = opts.maxHeight + 'px';
            elem.style.overflowY = 'auto';

            elem.detachEvent && removeEvent(elem, 'scroll', scrollListener);
          } else {
            elem.style.height = height + 'px';
          }

          var currentHeight = parseFloat(elem.style.height);

          if (lastHeight !== currentHeight) {
            lastHeight = currentHeight;
            if ($ && $.fn) {
              $(elem).trigger('autoresize:height', currentHeight);
            }
            opts.onresizeheight && opts.onresizeheight.call(elem, currentHeight);
          }
        };

        // In IE6-8, the immediate scrollHeight isn't expected after 
        // an undo operation.
        if (ie < 9) {
          setTimeout(setHeight, 0);
          // Prevent the height jump.
          elem.style.height = tmpHeight;
        } else {
          setHeight();
        }
      }
    };

    // For modern browsers, the input is enough.
    if (elem.addEventListener && (!ie || ie > 9)) {
      elem.addEventListener('input', inputListener, false);
    } else {

      // For IE6-9, we can use onpropertychange (combine with propertyName) 
      // to simulate the input event, but they are not identical. For more
      // details about how to simulate the input event perfectly, you can
      // see http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
      var propertychangeListener = function(e) {
        if (e.propertyName === 'value') {
          inputListener();
        }
      };
      addEvent(elem, 'propertychange', propertychangeListener);

      // In IE 9, input/propertychange event fires for most input operation but is buggy
      // and doesn't fire when text is deleted, but conveniently,
      // selectionchange appears to fire in all of the remaining cases.
      //
      // The selectionchange is fired frequently, so we just listen it when
      // the textarea gets cursor.
      var focusListener = function(e) {
        if (e.type === 'focus') {
          addEvent(doc, 'selectionchange', inputListener);
        } else {
          removeEvent(doc, 'selectionchange', inputListener);
        }
      };
      addEvent(elem, 'focus', focusListener);
      addEvent(elem, 'blur', focusListener);

      // In IE6-8, the first interaction (type/paste) maybe not trigger
      // the propertychange, but trigger keyup.
      addEvent(elem, 'keyup', inputListener);
    }

    // Initialize
    inputListener();
    isInit = false;

    // Return an object which contains a `reset` method to detach the bound 
    // events on textarea.
    return {
      reset: function() {
        elem.style.height = '';
        if (elem.removeEventListener && (!ie || ie > 9)) {
          elem.removeEventListener('input', inputListener, false);
        } else {
          elem.style.overflowY = '';
          removeEvent(elem, 'propertychange', propertychangeListener);
          removeEvent(doc, 'selectionchange', inputListener);
          removeEvent(elem, 'focus', focusListener);
          removeEvent(elem, 'blur', focusListener);
          removeEvent(elem, 'keyup', inputListener);
          removeEvent(elem, 'scroll', scrollListener);
        }
      }
    };
  };

  // Expose it as a jQuery plugin.
  if ($ && $.fn) {
    $.fn.autoResize = function(opts) {
      var arr = [];

      this.each(function(i, elem) {
        arr.push(autoResize(elem, opts));
      });

      return {
        reset: function() {
          $.each(arr, function(i, item) {
            item.reset();
          });
        }
      };
    };
  } else if (global) {
    // Expose it as a method on global object.
    global.autoResize = autoResize;
  }

  return autoResize;
}));
