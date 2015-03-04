/**
 * autoresize-textarea
 * https://github.com/Alex1990/autoresize-textarea
 *
 * Copyright (c) 2015 Alex Chao
 * Under the MIT license
 */

'use strict';

module.exports = function(grunt) {

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '**/*.js',
            dest: 'dist'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'uglify']);

};
