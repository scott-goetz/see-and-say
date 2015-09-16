'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ camelize: true });

var browserSync = require('browser-sync').create();

gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: './src'
		}
	});

	gulp.watch('src/css/scss/**/*.scss', ['styles']);
	gulp.watch(['src/js/**/*.js', '!src/js/*.min.js'], ['scripts']);
	gulp.watch('src/**/*.html').on('change', browserSync.reload);
});