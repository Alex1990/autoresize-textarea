/*!
 * autoresize-textarea.js
 * https://github.com/Alex1990/autoresize-textarea
 */

(function(global, factory) {

  // Uses CommonJS, AMD or browser global to create a jQuery plugin.
  // See: https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // Expose this plugin as an AMD module. Register an anonymous module.
    define(['jquery'], function($) {
      return factory($);
    });
  } else if (typeof exports === 'object') {
    // Node/CommonJS module.
    module.exports = factory(require('jquery'));
  } else {
    // Expose this plugin to global object.
    global.autoResize = factory(global.jQuery);
  }

}(this, function($) {

  'use strict';

  // Shortand.
  var win = window;
  var doc = document;

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
  var autoResize = function(elem) {

    var lastValue = elem.value;
    elem.value = '';

    // In default, the textarea's height is integeral multiple of 
    // the line-height, and the offset between scrollHeight and height is 
    // the sum of top padding and bottom padding. But, in IE, the height is 
    // less than the scrollHeight because the line-height cannot expand
    // the height. So you'd better always set the textarea's height explicitly.
    var vPadding = parseFloat(curCSS(elem, 'paddingTop')) + 
                   parseFloat(curCSS(elem, 'paddingBottom'));

    var offset = elem.scrollHeight - (elem.clientHeight - vPadding);

    elem.value = lastValue;

    // When the input event is fired and the content of textarea is changed,
    // remove the inline style height, and then set the inline style height
    // to scrollHeight excerpt for the top padding and bottom padding.
    var setHeight = function() {
      if (elem.value !== lastValue) {
        lastValue = elem.value;
        elem.style.height = '';
        elem.style.height = elem.scrollHeight - offset + 'px';
      }
    };

    // The selectionchange is fired frequently, so we just listen it when
    // the textarea gets cursor.
    var onFocusChange = function(e) {
      if (e.type === 'focus') {
        addEvent(doc, 'selectionchange', setHeight);
      } else {
        doc.removeEventListener('selectionchange', setHeight, false);
      }
    };

    // For modern browsers, the input is enough. But for IE 9, the
    // selectionchange event is needed.
    if (elem.addEventListener) {
      addEvent(elem, 'input', setHeight);
      if (isSelectionchangeSupport) {
        addEvent(elem, 'focus', onFocusChange);
        addEvent(elem, 'blur', onFocusChange);
      }
    } else if (elem.attachEvent) {

      // For IE6-8, we can use onpropertychange (combine with propertyName) 
      // to simulate the input event, but they are not identical. For more
      // details about how to simulate the input event perfectly, you can
      // see http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
      elem.attachEvent('onpropertychange', function() {
        if (window.event.propertyName === 'value') {
          setHeight();
        }
      });
    }
  };

  // Expose it as a jQuery plugin.
  if ($ && $.fn) {
    $.fn.autoResize = function() {
      this.each(function(i, elem) {
        autoResize(elem);
      });
    };
  }

  return autoResize;
}));