'use strict'
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'src/resetField.js',
          'src/resetField.spec.js'
        ]
      },
      unit: {
        autoWatch: true,
        browsers: ['Chrome', 'Firefox']
      },
      continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.registerTask('default', ['karma:continuous']);
  grunt.registerTask('test', ['default']);
  grunt.registerTask('unit', ['karma:unit']);

}