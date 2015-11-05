'use strict';

var data = {};

data.scripts = {
	'vendor': [
		'src/js/vendor/jquery/dist/jquery.min.js',
		'src/js/vendor/jquery-throttle-debounce/jquery.ba-throttle-debounce.min.js',
		'src/js/vendor/gsap/src/minified/plugins/CSSPlugin.min.js',
		'src/js/vendor/gsap/src/minified/TweenMax.min.js',
		'src/js/vendor/jquery-ui/jquery-ui.min.js',
		'src/js/vendor/jquery.ui.touch-punch.min.js',
		'src/js/vendor/jquery.ui.rotatable.min.js',
		'src/js/vendor/SoundJS/lib/soundjs-0.6.1.min.js'
	],
	'main': [
		'src/js/main.js',
		'src/js/seeSay.js'
	]
};

exports.getData = function () {
	return data;	
};