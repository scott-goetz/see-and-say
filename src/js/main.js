$(function () {
	var options = {
		'arrowRotationsPerSecond': 1.5,
		'audioFormat': 'mp3',
		'audioPath': 'media/audio/',
		'handleStartRotation': 19.25,
		'handleMaxRotation': 21.14,
		'playTime': 7,
		'failAngle': 180,
		'failMinCount': 2,
		'failMaxCount': 5
	};

	var $body = $('body'),
		$seeSayEl = $('#see-and-say'),
		$seeSayHandleEl = $seeSayEl.find('.handle'),
		$seeSayBaseEl = $seeSayEl.find('.base'),
		$seeSayArrowEl = $seeSayEl.find('.arrow'),
		$seeSaySoundsEl = $seeSayEl.find('.sound-ring'),
		$seeSayPlayback = $seeSayEl.find('audio.playback'),
		$seeSayEngineFailure = $seeSayEl.find('audio.engine-failure');

	var arrowRotationAmount,
		audioDuration,
		handleOrigAngle,
		resetDuration,
		divisionDegrees,
		engineFailure;

	var pullCount = 0;

	var isReady = false;

	var soundsArr = ['yoda', 'admiral-ackbar', 'lord-vader', 'lightsaber', 'tie-fighter', 'r2d2', 'jabba-the-hut', 'princess-leia', 'cantina-band', 'han-solo'];

	// var soundsArr = ['goldblum-1', 'goldblum-2', 'goldblum-3', 'goldblum-4', 'goldblum-5', 'goldblum-6', 'goldblum-7', 'goldblum-8', 'goldblum-9', 'goldblum-10'];

	var arrowDraggableParams = {
		rotationCenterX: 50.0,
		rotationCenterY: 50.0
	};

	var handleDraggableParams = {
		angle: options.handleStartRotation,
		start: function(event, ui) {
			if (!isReady) {
				isReady = true;
			}

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
			// var timeDiff = Math.floor(((ui.angle.current - options.handleStartRotation) / (options.handleMaxRotation - options.handleStartRotation)) * 100) / 100;

			// resetDuration = options.playTime * timeDiff;

			// Update pull count
			pullCount++;

			// Engine failure or sound effect
			if (pullCount == engineFailureCount) {
				engineFailure();
			} else {
				// Change new audio
				audioUpdate(Math.floor(getRotation($seeSayArrowEl) / divisionDegrees));
			}

			
		},
		rotationCenterX: 50.0,
		rotationCenterY: 100.0
	};

	/**
	 * Primary initialization call.
	 */
	function init () {
		// Set some variables
		divisionDegrees = 360 / soundsArr.length;

		// Determine random engine failure
		engineFailureCount = setEngineFailure(options.failMinCount, options.failMaxCount);
		// engineFailureCount = 1;

		attach();		 
	};

	/**
	 * Primary attach call.
	 */
	function attach () {
		// Attach rotatable
		$seeSayHandleEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(handleDraggableParams);
		$seeSayArrowEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(arrowDraggableParams);

		// Audio element listeners
		$seeSayPlayback.on('loadedmetadata', function (e) {
			if (isReady) {
				// Update audio duration and determine arrow spin time
				audioDuration = $seeSayPlayback[0].duration;
				arrowRotationAmount = (audioDuration * options.arrowRotationsPerSecond) * 360;

				// Play appropriate sound
				$seeSayPlayback[0].play();

				// Lever reset and arrow rotation
				resetHandle(audioDuration);

				rotateArrow(arrowRotationAmount, audioDuration);
			}
		});
	}

	/**
	 * Play the audio of whichever character/object the arrow is currently pointing at.
	 * @param  {Int} soundIndex Index of the appropriate sound effect.
	 */
	function audioUpdate (soundIndex) {
		var audioSrc = options.audioPath + soundsArr[soundIndex] + '.' + options.audioFormat;

		// Swap audio source and play
		$seeSayPlayback.attr('src', audioSrc);
	}

	/**
	 * Play engine failure sound and animation.
	 */
	function engineFailure () {

		// Update audio duration and determine arrow spin time
		audioDuration = $seeSayPlayback[0].duration;
		arrowRotationAmount = (audioDuration * options.arrowRotationsPerSecond) * 360;

		// Reset for next engine failure
		pullCount = 0;
		engineFailureCount = setEngineFailure(options.failMinCount, options.failMaxCount);	

		$seeSayEngineFailure[0].play();
		resetHandle(1);
		rotateArrow(arrowRotationAmount, (audioDuration - 2.5));
	}

	/**
	 * Determine the rotation, in degrees, of a specified object.
	 * @param  {Object} $obj 	The object we wish to get the rotation of.
	 * @return {Int}      		The degrees of the objects current rotation.
	 */
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
			}
		});
	}

	function setEngineFailure (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	init();
});