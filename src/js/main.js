$(function () {
	var options = {
		'arrowRotationsPerSecond': 2,
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
		$seeSaySoundsEl = $seeSayBaseEl.find('.sounds');

	var leverOrigAngle,
		divisionDegrees;

	var soundsArr = [
		'Yoda', 'Admiral Ackbar', 'Darth Vader', 'Lightsaber', 'Tie Fighter', 'R2D2', 'Jabba The Hut', 'Princess Leia', 'Cantina Band', 'Han Solo'
	];

	var leverDraggableParams = {
		angle: options.leverStartRotation,
		start: function(event, ui) {
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
			var timeDiff = Math.floor(((ui.angle.current - options.leverStartRotation) / (options.leverMaxRotation - options.leverStartRotation)) * 100) / 100,
				duration = options.playTime * timeDiff,
				arrowRotation = (duration * options.arrowRotationsPerSecond) * 360;

			// Play appropriate sound
			playSound();

			// Lever reset and arrow rotation
			resetLever(duration);
			rotateArrow(duration, arrowRotation);
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
		$seeSayLeverEl.draggable({ handle: '.ui-rotatable-handle' }).rotatable(leverDraggableParams);
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
	 * Play the sound of whichever character/object the arrow is currently pointing at.
	 */
	function playSound () {
		var soundIndex = Math.floor(getRotation($seeSayArrowEl) / divisionDegrees);

		console.log(soundsArr[soundIndex]);
	}

	/**
	 * Reset the lever position over time.
	 * @param  {Int} duration The time it takes to reset the lever.
	 */
	function resetLever (duration) {
		// Disable rotatable functionality temporarily
		$seeSayLeverEl.rotatable('destroy');

		// Animate leve back into position
		TweenMax.fromTo($seeSayLeverEl, duration, {
				rotation: getRotation($seeSayLeverEl),				
			},
			{
				rotation: leverOrigAngle,
				// ease: Power3.easeOut
				onComplete: function () {
					console.log('manual reset');
					$seeSayLeverEl.removeAttr('style').rotatable(leverDraggableParams);
				}
			}
		);
	}

	/**
	 * Spin the arrow to it's new position.
	 * @param  {Int} duration The time it takes to spin the arrow.
	 * @param  {Int} degrees  The amount, in degrees, to spin the arrow.
	 */
	function rotateArrow (duration, degrees) {
		TweenMax.to($seeSayArrowEl, duration, {
			css: { rotation: '+= ' + degrees + '_cw' }
			// ease: Power3.easeOut
		});
	}

	init();
});