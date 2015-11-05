var options = {
	'arrowRotationsPerSecond': 1.5,
	'audioPath': 'media/audio/',
	'handleStartRotation': 19.25,
	'handleMaxRotation': 21.14,
	'instructionFade': 0.75,
	'instructionIdleTime': 7500,
	'playTime': 7,
	'failAngle': 180,
	'failMinCount': 2,
	'failMaxCount': 5
};

var $body = $('body'),
	$seeSayEl = $('#see-and-say'),
	$seeSayInstructionsEl = $seeSayEl.find('.instructions'),
	$seeSayInstructionsPickEl = $seeSayInstructionsEl.find('.pick'),
	$seeSayInstructionsPullEl = $seeSayInstructionsEl.find('.pull'),
	$seeSayInstructionsPullHandEl = $seeSayInstructionsPullEl.find('.hand'),
	$seeSayHandleEl = $seeSayEl.find('.handle'),
	$seeSayBaseEl = $seeSayEl.find('.base'),
	$seeSayArrowEl = $seeSayEl.find('> .arrow'),
	$seeSaySoundsEl = $seeSayEl.find('.sound-ring'),
	$seeSayPlayback = $seeSayEl.find('audio.playback'),
	$seeSayPlaybackM4A = $seeSayPlayback.find('source.playback-m4a'),
	$seeSayPlaybackOGG = $seeSayPlayback.find('source.playback-ogg'),
	$seeSayEngineFailure = $seeSayEl.find('audio.engine-failure'),
	$window = $(window);

var soundsArr = ['yoda', 'admiral-ackbar', 'lord-vader', 'lightsaber', 'tie-fighter', 'r2d2', 'jabba-the-hut', 'princess-leia', 'cantina-band', 'han-solo'];

// var soundsArr = ['goldblum-1', 'goldblum-2', 'goldblum-3', 'goldblum-4', 'goldblum-5', 'goldblum-6', 'goldblum-7', 'goldblum-8', 'goldblum-9', 'goldblum-10'];

var arrowRotationAmount,
	audioDuration,
	handleOrigAngle,
	resetDuration,
	divisionDegrees;

var pullCount = 0,
	engineFailureCount = 0,
	soundIndex = 0;

var instructionTimeout;

var instructionAnimation = new TimelineMax({
	delay: 0.5,
	repeat: -1
});

var arrowDraggableParams = {
	rotationCenterX: 50.0,
	rotationCenterY: 50.0
};

var handleDraggableParams = {
	angle: options.handleStartRotation,
	start: function(event, ui) {
		hideInstructions();

		// Capture original handle angle
		handleOrigAngle = getRotation($seeSayHandleEl);
	},
	rotate: function(event, ui) {
		// Stop the handle at a certain point
		if (ui.angle.current >= options.handleMaxRotation) {
			$(this).trigger('mouseup');
		}

		// console.log(ui.angle.current);
	},
	stop: function(event, ui) {
		// Update pull count
		pullCount++;

		// Engine failure or sound effect
		if (pullCount == engineFailureCount) {
			audioUpdate(true);
		} else {
			// Select new audio and play
			soundIndex = Math.floor(getRotation($seeSayArrowEl) / divisionDegrees);
			audioUpdate(false);
		}

		
	},
	rotationCenterX: 50.0,
	rotationCenterY: 100.0
};

function init () {
	var container = document.getElementById('container');

	// if this is on mobile, sounds need to be played inside of a touch event
	if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry || createjs.BrowserDetect.isWindowPhone) {
		container.addEventListener('click', handleTouch, false);
	} else {
		handleTouch(null);
	}

	// Set some variables
	divisionDegrees = 360 / soundsArr.length;

	// Play instruction animation
	instructionAnimation.set($seeSayInstructionsPullEl, { autoAlpha: 0 })
		.set($seeSayInstructionsPickEl, { rotation: '180' })
		.to($seeSayInstructionsPickEl, 1.5, { rotation: '+= 250_cw', transformOrigin:"50% 50%" })
		.to($seeSayInstructionsPickEl, options.instructionFade, { autoAlpha: '0' })
		.set($seeSayInstructionsPickEl, { rotation: '180' })
		.to($seeSayInstructionsPullEl, options.instructionFade, { autoAlpha: 1 }, "-=0.25")
		.to($seeSayInstructionsPullHandEl, 1, { y: 10 })
		.to($seeSayInstructionsPullHandEl, 1, { y: 0 })
		.to($seeSayInstructionsPullEl, options.instructionFade, { autoAlpha: 0 })
		.to($seeSayInstructionsPickEl, options.instructionFade, { autoAlpha: 1 }, "-=0.25");

	// Determine random engine failure
	engineFailureCount = setEngineFailure(options.failMinCount, options.failMaxCount);
	// engineFailureCount = 1;
}

function handleTouch () {
	var seeAndSayApp = new seeAndSay.App();

	attach();
}

function attach () {
	// Attach rotatable
	$seeSayHandleEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(handleDraggableParams);
	$seeSayArrowEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(arrowDraggableParams);
}

function getRotation ($obj) {
	var rotationMatrix = $obj.css("-ms-transform") || $obj.css("-webkit-transform") || $obj.css("transform"),
		angle;

	if (rotationMatrix !== 'none') {
		var values = rotationMatrix.split('(')[1].split(')')[0].split(','),
			a = values[0],
			b = values[1];

		angle = Math.round((Math.atan2(b, a) * (180 / Math.PI)) * 100) / 100;
	} else {
		angle = 0;
	}

	return (angle < 0) ? angle + 360 : angle;
}

function hideInstructions () {
	clearTimeout(instructionTimeout);

	TweenMax.to($seeSayInstructionsEl, options.instructionFade, {
		autoAlpha: 0
	});
}

function showInstructions () {
	clearTimeout(instructionTimeout);

	// Prep instruction animation
	instructionAnimation.restart().pause();

	TweenMax.to($seeSayInstructionsEl, options.instructionFade, {
		autoAlpha: 1,
		onComplete: function () {
			instructionAnimation.play();
		}
	});
}

/**
 * Play the audio of whichever character/object the arrow is currently pointing at.
 */
function audioUpdate (failure) {
	var audioFile;

	// Engine failure or success
	if (failure) {
		// Reset for next engine failure
		pullCount = 0;
		engineFailureCount = setEngineFailure(1, options.failMaxCount);

		audioFile = 'engine-failure';
	} else {
		audioFile = soundsArr[soundIndex];
	}

	// Play audio track
	var audioInstance = createjs.Sound.play(audioFile);

	// Update audio duration and determine arrow spin time
	audioDuration = audioInstance.duration / 1000;
	arrowRotationAmount = (audioDuration * options.arrowRotationsPerSecond) * 360;

	// Lever reset and arrow rotation
	resetHandle(audioDuration);

	rotateArrow(arrowRotationAmount, audioDuration);
}

/**
 * Reset the handle position over time.
 */
function resetHandle (duration) {
	// Disable rotatable functionality temporarily
	$seeSayHandleEl.rotatable('destroy');

	// Animate handle back into position
	TweenMax.fromTo($seeSayHandleEl, duration, {
			rotation: getRotation($seeSayHandleEl)
		},
		{
			rotation: handleOrigAngle,
			// ease: Power3.easeOut
			onComplete: function () {
				// Reset rotatable
				$seeSayHandleEl.removeAttr('style').rotatable(handleDraggableParams);
			}
		}
	);
}

/**
 * Spin the arrow to it's new position.
 * @param  {Int} degrees  The amount, in degrees, to spin the arrow.
 */
function rotateArrow (degrees, duration) {
	// Disable rotatable functionality temporarily
	$seeSayArrowEl.rotatable('destroy');

	var newArrowDraggableParams = arrowDraggableParams;

	TweenMax.to($seeSayArrowEl, duration, {
		css: { rotation: '+= ' + degrees + '_cw' },
		// ease: Power3.easeOut
		onComplete: function () {
			// Get new angle in radians based of current rotation
			newArrowDraggableParams.angle = getRotation($seeSayArrowEl) * Math.PI / 180;

			// Reset rotatable
			$seeSayArrowEl.removeAttr('style').rotatable(newArrowDraggableParams);

			// Reset instruction timeout
			instructionTimeout = setTimeout(showInstructions, options.instructionIdleTime);
		}
	});
}

function setEngineFailure (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}