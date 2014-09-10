utils.js
========

A template for a better Drupal utils file

## Usage

Once this module is enabled, simply add a new script with the structure demonstrated in ```module_js.js.example```, then use ```drupal_add_js()``` to add your new script. For example:

**my_hook/my_hook.module***

```
function my_hook_init() {
	$js_path = drupal_get_path('module', 'my_hook') . '/js/my_script.js';
	drupal_add_js($js_path, array('scope' => 'footer', 'preprocess' => true), 'setting');
}
```

**my_hook/js/my_script.js***

```
;!function ($, Drupal, window, document, undefined) {


	Drupal.E3.pageLoad.example = function() {
		console.log('Example module loaded');
	}
	
	Drupal.E3.handleResize.example = function(Drupal.E3.win.width()) {
		console.log('Do something on resize');
	}


}(jQuery, Drupal, this, this.document);
```