requirejs.config({
  'baseUrl': 'amd-js',
  'paths': {
    'jquery': 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.2.min',
    'autoresize-textarea': '../../src/autoresize-textarea'
  }
});

requirejs(['jquery', 'autoresize-textarea'], function($) {
  $('#desc').autoResize();
});
