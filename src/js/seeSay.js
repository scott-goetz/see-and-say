this.seeAndSay = this.seeAndSay || {};

(function () {
	function App() {
		this.init();
	}

	App.prototype = {
		init: function () {
			this.audioSetup();

			return this;
		},
		audioSetup: function () {
			if (!createjs.Sound.initializeDefaultPlugins()) {return;}

			// SoundJS settings
			createjs.Sound.alternateExtensions = ["mp3"];

			// Register sounds
			$.each(soundsArr, function (index, value) {
				createjs.Sound.registerSound({
					src: options.audioPath + soundsArr[index] + '.ogg',
					id: value
				});
			});

			// Register misc sounds
			createjs.Sound.registerSound({
				src: options.audioPath + 'engine-failiure.ogg',
				id: 'engine-failure'
			});
		}
	};

	seeAndSay.App = App;
}());