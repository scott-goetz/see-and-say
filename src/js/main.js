$(function () {
	var options = {
		'arrowRotationsPerSecond': 1.5,
		'audioFormat': 'mp3',
		'audioPath': 'media/audio/',
		'leverStartRotation': 19.25,
		'leverMaxRotation': 20,
		'playTime': 7,
	};

	var $body = $('body'),
		$seeSayEl = $('#see-and-say'),
		$seeSayLeverEl = $seeSayEl.find('.lever'),
		$seeSayHandleEl = $seeSayLeverEl.find('.handle'),
		$seeSayBaseEl = $seeSayEl.find('.base'),
		$seeSayArrowEl = $seeSayBaseEl.find('.arrow'),
		$seeSaySoundsEl = $seeSayBaseEl.find('.sound-base'),
		$seeSayPlayback = $seeSayEl.find('audio.playback');

	var arrowRotationAmount,
		audioDuration,
		leverOrigAngle,
		resetDuration,
		divisionDegrees;

	var isReady = false;

	// var soundsArr = ['Yoda', 'Admiral Ackbar', 'Darth Vader', 'Lightsaber', 'Tie Fighter', 'R2D2', 'Jabba The Hut', 'Princess Leia', 'Cantina Band', 'Han Solo'];

	var soundsArr = ['goldblum-1', 'goldblum-2', 'goldblum-3', 'goldblum-4', 'goldblum-5', 'goldblum-6', 'goldblum-7', 'goldblum-8', 'goldblum-9', 'goldblum-10'];

	var arrowDraggableParams = {
		rotationCenterX: 50.0,
		rotationCenterY: 50.0
	};

	var leverDraggableParams = {
		angle: options.leverStartRotation,
		start: function(event, ui) {
			if (!isReady) {
				isReady = true;
			}

			// Capture original lever angle
			leverOrigAngle = getRotation($seeSayLeverEl);
		},
		rotate: function(event, ui) {
			// Stop the lever at a certain point
			if (ui.angle.current >= options.leverMaxRotation) {
				$(this).trigger('mouseup');
			}
		},
		stop: function(event, ui) {
			// var timeDiff = Math.floor(((ui.angle.current - options.leverStartRotation) / (options.leverMaxRotation - options.leverStartRotation)) * 100) / 100;

			// resetDuration = options.playTime * timeDiff;

			// Change new audio
			audioUpdate(Math.floor(getRotation($seeSayArrowEl) / divisionDegrees));
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

		attach();		 
	};

	/**
	 * Primary attach call.
	 */
	function attach () {
		// Attach rotatable
		$seeSayLeverEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(leverDraggableParams);
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
				resetLever(resetDuration);
				rotateArrow(arrowRotationAmount);
			}
		});
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
	 * Play the audio of whichever character/object the arrow is currently pointing at.
	 */
	function audioUpdate (soundIndex) {
		var audioSrc = options.audioPath + soundsArr[soundIndex] + '.' + options.audioFormat;

		// Swap audio source and play
		$seeSayPlayback.attr('src', audioSrc);
	}

	/**
	 * Reset the lever position over time.
	 */
	function resetLever () {
		// Disable rotatable functionality temporarily
		$seeSayLeverEl.rotatable('destroy');

		// Animate lever back into position
		TweenMax.fromTo($seeSayLeverEl, audioDuration, {
				rotation: getRotation($seeSayLeverEl)
			},
			{
				rotation: leverOrigAngle,
				// ease: Power3.easeOut
				onComplete: function () {
					// Reset rotatable
					$seeSayLeverEl.removeAttr('style').rotatable(leverDraggableParams);
				}
			}
		);
	}

	/**
	 * Spin the arrow to it's new position.
	 * @param  {Int} degrees  The amount, in degrees, to spin the arrow.
	 */
	function rotateArrow (degrees) {
		// Disable rotatable functionality temporarily
		$seeSayArrowEl.rotatable('destroy');

		var newArrowDraggableParams = arrowDraggableParams;

		TweenMax.to($seeSayArrowEl, audioDuration, {
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

	init();
});