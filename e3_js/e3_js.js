// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
// Precede IIFEs with a ; to prevent concatenation errors
;!function ($, Drupal, window, document, undefined) {

	window.e3 = {

		win: $(window),
		doc: $(document),

		// These should match whatever is defined in _base.scss:
		breakpoints: [460,768,960,1280],

		// Populate this object with general event-based functions
		// This prevents bogging down the page with multiple function calls
		// and other mistakes, like having multiple resize handlers

		load: {
			// Leave this empty; we call each function in this object once per page load
			// Add to it below with e3.load.myFunction
		},

		click: function(element) {},

		resize: function(width, height) {},

		scroll: function(distance) {},

		delay: function(time) {},

		// Helper functions
		checkUrl: function(string) {
			return window.location.href.indexOf(string) > -1;
		},

		getQuery: function() {
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}

	};

	// Shortcut vars
	e3.bpmobile  = e3.breakpoints[0];
	e3.bptablet  = e3.breakpoints[1];
	e3.bpdesktop = e3.breakpoints[2];
	e3.bphuge    = e3.breakpoints[3];

	e3.load.timerInit = function() {
		e3.startTime = (new Date).getTime();
		e3.timer = true;

		e3.getTime = function() {
			if(e3.timer == true) {
				e3.time = (((new Date).getTime() - e3.startTime)/1000).toFixed(20);
				for (var func in e3.delay) {
					if ( _.isFunction(e3.delay[func]) ) {
						e3.delay[func](e3.time);
					}
				}
			}
		}

		setInterval(e3.getTime,1000);
	};

	e3.doc.ready(function() {

		// Nothing here should need to be changed; add functionality in new files
		// prefixed with the Drupal object

		!function() {
			for (var func in e3.load) {
				if ( _.isFunction(e3.load[func]) ) {
					(_.once(e3.load[func]))();
				}
			}
			for (func in e3.resize) {
				if ( _.isFunction(e3.resize[func]) ) {
					(_.once(e3.resize[func]))(e3.win.width(),e3.win.height());
				}
			}
		}(); // Runs all load, resize and scroll functions once

		e3.win.click(
			_.throttle((function(e) {
				!function() {
					for (var func in e3.click) {
						if ( _.isFunction(e3.click[func]) ) {
							e3.click[func](e.toElement,e);
						}
					}
				}();
			}), 100)
		);

		e3.win.resize(
			_.throttle((function() {
				!function() {
					for (var func in e3.resize) {
						if ( _.isFunction(e3.resize[func]) ) {
							e3.resize[func](e3.win.width(),e3.win.height());
						}
					}
				}();
			}), 250)
		);

		e3.win.scroll(
			_.throttle((function() {
				!function() {
					for (var func in e3.scroll) {
						if ( _.isFunction(e3.scroll[func]) ) {
							e3.scroll[func](e3.win.scrollTop());
						}
					}
				}();
			}), 200)
		);
	});
}(jQuery, Drupal, this, this.document);