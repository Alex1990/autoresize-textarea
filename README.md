# autoresize-textarea

A jQuery (optional) plugin can automatically resize the textarea's height.

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

**Note:** Do not set transition property for the textarea.

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

## Options

You can pass an configurable object as the first parameter. If you passed a function as the first parameter, it will be treated as `onresizeheight` option.

- **maxHeight**

  Type: `Number` Default: `undefined`

  When the height of textarea is greater than `maxHeight`, the `maxHeight` will be as the height, and the `overflow-y` will be set to `auto`.

- **onresizeheight**

  Type: `Function` Default: `undefined`

  When the textarea's height is changed, this callback will be called. In `onresizeheight` callback, `this` refer to the textarea element and the first argument is the current numeric height of the textarea.

## Events

**(Only for as a jQuery plugin)**

When the textarea's height is changed, a named `autoresize:height` event will be triggered on textarea element and the current height of textarea will be passed as the second parameter of the event listener.

## Compatibility

Tested in IE6+ (including compatibility mode) and other modern browsers.

**Bugs:**

- In IE7 (simulated by IE9), IE10 (simulated by IE11), IE11, the content will jump up and down when a newline is seen. For example, press the "Enter" key.
- In IE7/8 (simulated by IE11), the `scrollHeight` will increase a few pixels after typing a character in a blank line (without any character).
- In IE9 and IE7/8 (simulated by IE9), for `example/basic.html` example, when the value of `padding` is less than 5 pixels, the textarea will move up about 1 pixel after first newline.

## Todos

- An online demo page.
- A method to reset the textarea to default.
- In IE, ESC key will clear the content of textarea.

## Thanks to

- The [dottoro](http://help.dottoro.com) reference helps me get some key details about `scrollHeight` and `oninput`/`onpropertychange`/`onpaste` events.

- A Ben Alpert's article - [A near-perfect oninput shim for IE 8 and 9](http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html), makes me understand how to use the `onselectionchange` event.

- The [AutoResize](https://github.com/azoff/AutoResize) plugin commited in 2011 provides another solution. I refer to the part.

## License

Under the MIT license.
