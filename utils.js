/**
 * @file
 * A JavaScript file for the theme.
 * Requires jQuery and Underscore.js
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth

;!function ($, Drupal, window, document, undefined) {

	var $win,
		$doc,
		breakpoints = [];

	$win = $(window);
	$doc = $(document);
	// These should match whatever is defined in _base.scss:
	breakpoints = [460,768,960,1280];

	// Shortcut Vars
	var bpmobile = breakpoints[0],
		bptablet = breakpoints[1],
		bpdesktop = breakpoints[2],
		bphuge = breakpoints[3];

	var E3 = {

		// Populate this object with general event-based functions
		// This prevents bogging down the page with multiple function calls
		// and other mistakes, like having multiple resize handlers

		pageLoad: {
			// Leave this empty; we call each function in this object once per page load
			// Add to it below with E3.pageLoad.myFunction
		},

		handleClick: function(element) {

			var obj = $(element);

			// For the registration form; page might have gotten too tall
			if(obj.hasClass('some-class')) {
				console.log('We didn\'t even need an .each() function for this!');
			}

			// Mobile navigation
			if(obj.is('#myId')) {
				console.log('Someone clicked #myId');
			}

		}, // end handleClick

		handleResize: function(width) {
		
			if(width > bpmobile) {
				console.log('Window is '+width+'px wide');
			}		
		
		}, // end handleResize

		handleScroll: function(distance) {

			if(distance > $('header').offset().top) {
				console.log('Scrolled '+distance+'px');
			}

		},

		handleDelay: function(time) {
			console.log('Page loaded '+time+'s ago');
		}
	};

	E3.pageLoad.exampleFunc = function() {
		console.log('Page is loaded');
	};

	$doc.ready(function() {

		// Nothing here should need to be changed; add functionality above

		!function() {
			var func;

			for (func in E3.pageLoad) {
				if ( _.isFunction(E3.pageLoad[func]) ) {
					(_.once(E3.pageLoad[func]))();
					console.log('Called function: E3.pageLoad.'+func);
				}
			}
		}(); // Runs all pageLoad functions once

		$win.click(
			_.throttle((function(e) {
				E3.handleClick(e.toElement);
			}), 100)
		);

		$win.resize(
			_.throttle((function() {
				E3.handleResize($win.width());
			}), 250)
		);

		$win.scroll(
			_.throttle(!function() {
				E3.handleScroll($win.scrollTop());
			}, 150)
		);
		
		$win.startTime = (new Date).getTime();
	
		setInterval(callTime,1000);
	
		function callTime() {
	
			$win.time = ((new Date).getTime() - $win.startTime)/1000;
			E3.handleDelay(Math.round($win.time));
	
		}

	});

}(jQuery, Drupal, this, this.document);
