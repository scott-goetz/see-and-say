'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ camelize: true });

var browserSync = require('browser-sync');

gulp.task('styles', function () {
	return gulp.src('src/css/scss/*.scss')
		.pipe($.sass())
		.pipe($.minifyCss())
		.pipe($.rename({ suffix: '.min' }))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream());
});