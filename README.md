# NMonkey
A GM_functions Polyfill for userscripts. Use NMonkey in your userscript and your userscript will be also available on any no-script-manager browsers.

Usage: 

	// ==UserScript==
	// @name      xxx
	// @namespace xxx
	// @version   1.0
	// ...
	// @require   https://.../xxx.js
	// @require   ...
	// ...
	// @resource  https://.../xxx
	// @resource  ...
	// ...
	// ==/UserScript==

	// Use a closure to wrap your code. Make sure you have it a name.
	(function YOUR_MAIN_FUNCTION() {
		'use strict';
		// Strict mode is optional. You can use strict mode or not as you want.
		// Polyfill first. Do NOT do anything before Polyfill.
		var NMonkey_Ready = NMonkey({
			mainFunc: YOUR_MAIN_FUNCTION,
			name: "script-storage-key, aims to separate different scripts' storage area. Use your script's @namespace value if you don't how to fill this field.",
			requires: [
				{
					src: "https://.../xxx.js",
					loaded: function() {return boolean_value_shows_whether_this_js_has_already_loaded;}
					execmode: "'eval' for eval code in current scope or 'function' for Function(code)() in global scope or 'script' for inserting a <script> element to document.head"
				},
				...
			],
			resources: [
				{
					src: "https://.../xxx"
					name: "@resource name. Will try to get it from @resource using this name before fetch it from src",
				},
				...
			],
			GM_info: {
				// You can get GM_info object, if you provide this argument(and there is no GM_info provided by the script-manager).
				// You can provide any object here, what you provide will be what you get.
				// Additionally, two property of NMonkey itself will be attached to GM_info if polyfilled:
				// {
				//     scriptHandler: "NMonkey"
				//     version: "NMonkey's version, it should look like '0.1'"
				// }
				// The following is just an example.
				script: {
					name: 'my first userscript for non-scriptmanager browsers!',
					description: 'this script works well both in my PC and my mobile!',
					version: '1.0',
					released: true,
					version_num: 1,
					authors: ['Johnson', 'Leecy', 'War Mars']
					update_history: {
						'0.9': 'First beta version',
						'1.0': 'Finally released!'
					}
				}
				surprise: 'if you check GM_info.surprise and you will read this!'
				// And property "scriptHandler" & "version" will be attached here
			}
      // You don't need to write anything like @grant in NMonkey, NMonkey will provide all available GM_functions as you called NMonkey.
		});
		if (!NMonkey_Ready) {
			// Stop executing of polyfilled environment not ready.
			// Don't worry, during polyfill progress YOUR_MAIN_FUNCTION will be called twice, and on the second call the polyfilled environment will be ready.
			return;
		}

		// Your code here...
		// Make sure your code is written after NMonkey be called
		if
		// ...

		// Just place NMonkey function code here
		function NMonkey(details) {
			...
		}
	}) ();

	// Oh you want to write something here? Fine. But code you write here cannot get into the simulated script-manager-environment.
