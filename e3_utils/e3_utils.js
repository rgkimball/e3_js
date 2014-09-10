// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth

// Precede self-calling function with a ; to prevent concatenation errors
;!function ($, Drupal, window, document, undefined) {

	Drupal.E3 = {

		win: $(window),
		doc: $(document),

		// These should match whatever is defined in _base.scss:
		breakpoints: [460,768,960,1280],

		// Populate this object with general event-based functions
		// This prevents bogging down the page with multiple function calls
		// and other mistakes, like having multiple resize handlers

		load: {
			// Leave this empty; we call each function in this object once per page load
			// Add to it below with Drupal.E3.load.myFunction
		},

		click: function(element) {

		},

		resize: function(width) {

		},

		scroll: function(distance) {

		},

		delay: function(time) {
			// See load.timerInit
		}
	};

	Drupal.E3.doc.ready(function() {

		// Nothing here should need to be changed; add functionality in new files
		// prefixed with the Drupal object

		!function() {
			var func;
			for (func in Drupal.E3.load) {
				if ( _.isFunction(Drupal.E3.load[func]) ) {
					(_.once(Drupal.E3.load[func]))();
				}
			}
			for (func in Drupal.E3.resize) {
				if ( _.isFunction(Drupal.E3.resize[func]) ) {
					Drupal.E3.resize[func](Drupal.E3.win.resize());
				}
			}
			for (func in Drupal.E3.scroll) {
				if ( _.isFunction(Drupal.E3.scroll[func]) ) {
					Drupal.E3.scroll[func](Drupal.E3.win.scrollTop());
				}
			}
		}(); // Runs all load, resize and scroll functions once



		Drupal.E3.win.click(
			_.throttle((function(e) {
				!function() {
					var func;
					for (func in Drupal.E3.click) {
						if ( _.isFunction(Drupal.E3.click[func]) ) {
							Drupal.E3.click[func](e.toElement);
						}
					}
				}();
			}), 100)
		);

		Drupal.E3.win.resize(
			_.throttle((function() {
				!function() {
					var func;
					for (func in Drupal.E3.resize) {
						if ( _.isFunction(Drupal.E3.resize[func]) ) {
							Drupal.E3.resize[func](Drupal.E3.win.resize());
						}
					}
				}();
			}), 100)
		);

		Drupal.E3.win.scroll(
			_.throttle((function() {
				!function() {
					var func;
					for (func in Drupal.E3.scroll) {
						if ( _.isFunction(Drupal.E3.scroll[func]) ) {
							Drupal.E3.scroll[func](Drupal.E3.win.scrollTop());
						}
					}
				}();
			}), 100)
		);

	});

}(jQuery, Drupal, this, this.document);