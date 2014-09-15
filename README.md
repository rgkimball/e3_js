e3_js
========

A module that introduces modular javascript and a toolkit to Drupal. The basic premise of this model is changing the focus of javascript writing from page elements and features to events in an effort to improve performance. For example, rather than introducing a new Drupal.behaviors object for new features, each of which uses jQuery to listen for page resizes and scrolls, new features become a part of one global window resize and scroll resize listener. In addition, this model allows us to use underscore to throttle each listener to ensure we're not running each of these functions too often. Since we've created a new global JS object, 'e3', we can easily pass variables and functions between scripts to develop co-dependencies and reduce the need to duplicate functionality. Finally, with this structure, and with the helper functions ```checkURL(s)``` and 	```getQuery()```, we can load our scripts contextually to make sure the only functionality created is what's needed for the current page.

## Usage

Once this module is enabled, simply add a new script with the structure demonstrated in ```utils_example/myscript.js```, then use ```drupal_add_js()``` to add your new script. For example:

**my_hook/my_hook.module**

```
function my_hook_init() {
	$js_path = drupal_get_path('module', 'my_hook') . '/js/my_script.js';
	drupal_add_js($js_path, array('scope' => 'footer', 'preprocess' => true), 'setting');
}
```

**my_hook/js/my_script.js**

```
;!function ($, Drupal, e3, window, document, undefined) {


	e3.load.example = function() {
		console.log('Example module loaded');
		
		if(e3.checkURL("blog") {
			console.log('Do something on blog pages.');
		}
	}
	
	e3.resize.example = function(e3.win.width()) {
		console.log('Do something on resize');
	}


}(jQuery, Drupal, Drupal.E3, this, this.document);
```