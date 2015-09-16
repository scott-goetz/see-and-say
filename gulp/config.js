'use strict';

var data = {};

data.scripts = {
	'vendor': [
		'src/js/vendor/jquery/dist/jquery.min.js',
		'src/js/vendor/gsap/src/minified/plugins/CSSPlugin.min.js',
		'src/js/vendor/gsap/src/minified/TweenMax.min.js',
		'src/js/vendor/jquery-ui/jquery-ui.min.js',
		'src/js/vendor/jquery.ui.touch-punch.min.js',
		'src/js/vendor/jquery.ui.rotatable.min.js'
	],
	'main': [
		'src/js/main.js'
	]
};

exports.getData = function () {
	return data;	
};