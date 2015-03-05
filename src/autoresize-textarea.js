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

  // In IE 9, input event fires for most input operation but is buggy
  // and doesn't fire when text is deleted, but conveniently,
  // selectionchange appears to fire in all of the remaining cases.
  var isSelectionchangeSupport = 'onselectionchange' in doc;

  // An addEventListener wrapper to save bytes.
  var addEvent = function(elem, event, listener) {
    elem.addEventListener(event, listener, false);
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
        callback: opts
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
      elem.attachEvent('onscroll', scrollListener);

      // In IE6-8, the first interaction (type/paste/drop) maybe not trigger 
      // the onpropertychange.
      tmpValue = elem.value;
      elem.value = 'aa';
      elem.value = tmpValue;
      doc.execCommand('Undo');
      doc.execCommand('Undo');
    }

    var isInit = true;
    var isMaxHeight = false;

    // When the input event is fired and the content of textarea is changed,
    // remove the inline style height, and then set the inline style height
    // to scrollHeight excerpt for the top padding and bottom padding.
    var inputListener = function() {
      if (elem.value !== lastValue || isInit) {
        lastValue = elem.value;

        var lastHeight = elem.style.height;
        elem.style.height = '';

        var setHeight = function() {
          var height = elem.scrollHeight - offset;

          // When opts.maxHeight is provided and the height of textarea is 
          // great than opts.maxHeight, the opts.maxHeight will be as the 
          // height, and the overflow-y will be set to auto.
          if (opts.maxHeight && height > opts.maxHeight) {
            elem.style.height = opts.maxHeight + 'px';
            elem.style.overflowY = 'auto';
            isMaxHeight = true;

            elem.detachEvent && elem.detachEvent('onscroll', scrollListener);
          } else {
            elem.style.height = height + 'px';
          }

          var currentHeight = parseFloat(elem.style.height);

          if ($ && $.fn) {
            $(elem).trigger('autoresize:height', currentHeight);
          }
          opts.callback && opts.callback.call(elem, currentHeight);
        };

        // In IE6-8, the immediate scrollHeight isn't expected after 
        // an undo operation.
        if (ie < 9) {
          setTimeout(setHeight, 0);
          // Prevent the height jump.
          elem.style.height = lastHeight;
        } else {
          setHeight();
        }
      }
    };

    // The selectionchange is fired frequently, so we just listen it when
    // the textarea gets cursor.
    var focusListener = function(e) {
      if (e.type === 'focus') {
        addEvent(doc, 'selectionchange', inputListener);
      } else {
        doc.removeEventListener('selectionchange', inputListener, false);
      }
    };

    // For modern browsers, the input is enough. But for IE 9, the
    // selectionchange event is needed.
    if (elem.addEventListener) {
      addEvent(elem, 'input', inputListener);
      if (isSelectionchangeSupport) {
        addEvent(elem, 'focus', focusListener);
        addEvent(elem, 'blur', focusListener);
      }
    } else if (elem.attachEvent) {

      // For IE6-8, we can use onpropertychange (combine with propertyName) 
      // to simulate the input event, but they are not identical. For more
      // details about how to simulate the input event perfectly, you can
      // see http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
      elem.attachEvent('onpropertychange', function() {
        if (window.event.propertyName === 'value') {
          inputListener();
        }
      });
    }

    // Initialize
    inputListener();
    isInit = false;
  };

  // Expose it as a jQuery plugin.
  if ($ && $.fn) {
    $.fn.autoResize = function(opts) {
      this.each(function(i, elem) {
        autoResize(elem, opts);
      });
    };
  } else if (global) {
    // Expose it as a method on global object.
    global.autoResize = autoResize;
  }

  return autoResize;
}));