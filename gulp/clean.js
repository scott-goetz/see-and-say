'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ camelize: true });

var del = require('del');

gulp.task('clean', function () {
	return del([
		'css/*.min.css',
		'js/*.min.js'
	]);
});