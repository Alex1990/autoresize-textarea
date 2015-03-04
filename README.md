# autoresize-textarea

A [jQuery] plugin can automatically resize the textarea's height.

## Usage

HTML:

```html
<textarea id="description"></textarea>
```

CSS:

```css
#description {
  padding: 3px;
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  overflow: hidden;
  resize: none;
}
```

In most cases, it will be as a jQuery plugin.

```js
$('#description').autoResize();
```

But, if there isn't the jQuery object on global object, it will expose an `autoResize()` method to global object.

```js
autoResize( document.getElementById('description') );
```

And, this plugin can be used as a CommonJS/AMD module. You can see the demos in `example` folder for more details.

## Package

You can use [npm](https://docs.npmjs.com) or [bower](http://bower.io) to install it.

**NPM:**

```bash
npm install autoresize-textarea
```

**Bower:**

```bash
bower install autoresize-textarea
```

## Compatibility

Tested in IE6+ (including compatibility mode) and other modern browsers.

**A few bugs:**

- In IE7 (including IE8/9 compatibility mode), it seems that the `onpropertychange` is not fired when the undo operation is executed (Ctrl+Z or Context menu).
- In IE8 (including IE9 compatibility mode), when you recover some text by undo, and then delete the recovered text by pressing the "Delete" key, the `onpropertychange` won't fire.

## Thanks to

- The [dottoro](help.dottoro.com) reference helps me get some key details about `scrollHeight` and `oninput`/`onpropertychange`/`onpaste` events.

- A Ben Alpert's article - [A near-perfect oninput shim for IE 8 and 9](http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html), makes me understand how to use the `onselectionchange` event.

- The [AutoResize](https://github.com/azoff/AutoResize) plugin commited in 2011 provides another solution. I refer to the part.

## License

Under the MIT license.
