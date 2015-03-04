requirejs.config({
  'baseUrl': 'amd-js',
  'paths': {
    'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min',
    'autoresize-textarea': '../../src/autoresize-textarea'
  }
});

requirejs(['jquery', 'autoresize-textarea'], function($) {
  $('#desc').autoResize();
});