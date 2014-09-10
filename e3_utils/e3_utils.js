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

		// Shortcut variables
//		bpmobile  : Drupal.E3.breakpoints[0],
//		bptablet  : Drupal.E3.breakpoints[1],
//		bpdesktop : Drupal.E3.breakpoints[2],
//		bphuge    : Drupal.E3.breakpoints[3],

		// Populate this object with general event-based functions
		// This prevents bogging down the page with multiple function calls
		// and other mistakes, like having multiple resize handlers

		pageLoad: {
			// Leave this empty; we call each function in this object once per page load
			// Add to it below with Drupal.E3.pageLoad.myFunction
		},

		handleClick: function(element) {

		}, // end handleClick

		handleResize: function(width) {

		}, // end handleResize

		handleScroll: function(distance) {

		},

		handleDelay: function(time) {
			// See pageLoad.timerInit
		}
	};

	Drupal.E3.doc.ready(function() {

		// Nothing here should need to be changed; add functionality in new files
		// prefixed with the Drupal object

		!function() {
			var func;
			for (func in Drupal.E3.pageLoad) {
				if ( _.isFunction(Drupal.E3.pageLoad[func]) ) {
					(_.once(Drupal.E3.pageLoad[func]))();
				}
			}
		}(); // Runs all pageLoad functions once

		Drupal.E3.win.click(
			_.throttle((function(e) {
				!function() {
					var func;
					for (func in Drupal.E3.handleClick) {
						if ( _.isFunction(Drupal.E3.handleClick[func]) ) {
							Drupal.E3.handleClick[func](e.toElement);
						}
					}
				}();
			}), 100)
		);

		Drupal.E3.win.resize(
			_.throttle((function() {
				!function() {
					var func;
					for (func in Drupal.E3.handleClick) {
						if ( _.isFunction(Drupal.E3.handleClick[func]) ) {
							Drupal.E3.handleClick[func](Drupal.E3.win.width());
						}
					}
				}();
			}), 100)
		);

		Drupal.E3.win.scroll(
			_.throttle((function() {
				!function() {
					var func;
					for (func in Drupal.E3.handleClick) {
						if ( _.isFunction(Drupal.E3.handleClick[func]) ) {
							Drupal.E3.handleClick[func](Drupal.E3.win.scrollTop());
						}
					}
				}();
			}), 100)
		);

	});

}(jQuery, Drupal, this, this.document);
