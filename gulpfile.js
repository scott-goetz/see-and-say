'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ camelize: true });

var runSequence = require('run-sequence');

require('require-dir')('./gulp');

// default task
gulp.task('default', function() {
	runSequence('clean', 'styles', 'scripts', 'serve');
});