// GULP PLUGINS
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del', 'fs']
    });

// NODE PLUGINS
var runSequence = require('run-sequence');

gulp.task('build', ['clean', 'scripts', 'styles'], function () {
	return gulp.src(['src/**/*', '!src/css/scss'])
		.pipe(gulp.dest('.dist'));
});