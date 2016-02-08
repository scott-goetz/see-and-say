'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ camelize: true });

var browserSync = require('browser-sync'),
	merge = require('merge-stream');

var config = require('./config.js'),
	configData = config.getData();

gulp.task('scripts', function () {
	var stream = [],
		configScripts = configData.scripts;

	for (var i in configScripts) {
		var currScripts = configScripts[i];

		var pipeline = gulp.src(currScripts)
			.pipe($.concat(i + '.js'))
			.pipe($.uglify({ preserveComments: 'license' }))
			.pipe($.rename({ suffix: '.min' }))
			.pipe(gulp.dest('src/js/'));

		stream.push(pipeline);
	}

	return merge(stream);
});