(function mainFunc() {
	'use strict';

	var NMonkey_Ready = NMonkey({
		mainFunc: mainFunc, 
		name: 'NMonkey Example',
		requires: [
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/alertify.min.js',
				loaded: () => (typeof(alertify) === 'object' ? true : false),
				execmode: 'function'
			}
		],
		resources: [
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/alertify.min.css',
				name: 'alertify-css'
			},
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/themes/default.min.css',
				name: 'alertify-theme'
			}
		]
	});
	if (!NMonkey_Ready) {
		return false;
	};

	// Main Code ...
	console.log('Main function executing in strict mode, GM_* functions are: ');
	console.log(GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, unsafeWindow);

	GM_addStyle(GM_getResourceText('alertify-css'));
	GM_addStyle(GM_getResourceText('alertify-theme'));
	alertify.notify('Main function executed');
	debugger;

	// NMonkey By PY-DNG, 2021.07.18 - 2022.02.18, License GPL-3
	// NMonkey: Provides GM_Polyfills and make your userscript compatible with non-script-manager environment
	// Description:
	/* 
	    Simulates a script-manager environment("NMonkey Environment") for non-script-manager browser, load @require & @resource, provides some GM_functions(listed below), and also compatible with script-manager environment.
	    Provides GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, GM_getResourceText, GM_getResourceURL, GM_addStyle, GM_addElement, GM_log, unsafeWindow(object), GM_info(object)
	    Also provides an object called GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled.
	    Returns true if polyfilled is environment is ready, false for not. Don't worry, just follow the usage below.
	*/
	// Note: DO NOT DEFINE GM-FUNCTION-NAMES IN YOUR CODE. DO NOT DEFINE GM_POLYFILLED AS WELL.
	// Note: NMonkey is an advanced version of GM_PolyFill (and BypassXB), it includes more functions than GM_PolyFill, and provides better stability and compatibility. Do NOT use NMonkey and GM_PolyFill (and BypassXB) together in one script.
	// Usage: 
	/*
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
	*/
	function NMonkey(details) {
		// Init DoLog
		DoLog();

		// Get argument
		const mainFunc = details.mainFunc;
		const name = details.name || 'default';
		const requires = details.requires || [];
		const resources = details.resources || [];
		details.GM_info = details.GM_info || {};
		details.GM_info.scriptHandler = 'NMonkey';
		details.GM_info.version = '1.0';

		// Run in variable-name-polifilled environment
		if (InNPEnvironment()) {
			// Already in polifilled environment === polyfill has alredy done, just return
			return true;
		}

		// Not in polifilled environment, then polyfill functions and create & move into the environment
		// Bypass xbrowser's useless GM_functions
		bypassXB();

		// Start polyfill
		const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
		let GM_POLYFILL_storage;
		const Supports = {
			GetStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				let storage = gstorage[name] ? gstorage[name] : {};
				return storage;
			},

			SaveStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				gstorage[name] = GM_POLYFILL_storage;
				localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
			},
		};
		const Provides = {
			// GM_setValue
			GM_setValue: function(name, value) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				GM_POLYFILL_storage[name] = value;
				Supports.SaveStorage();
			},

			// GM_getValue
			GM_getValue: function(name, defaultValue) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			},

			// GM_deleteValue
			GM_deleteValue: function(name) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
					Supports.SaveStorage();
				}
			},

			// GM_listValues
			GM_listValues: function() {
				GM_POLYFILL_storage = Supports.GetStorage();
				return Object.keys(GM_POLYFILL_storage);
			},

			// unsafeWindow
			unsafeWindow: window,

			// GM_xmlhttpRequest
			// not supported properties of details: synchronous binary nocache revalidate context fetch
			// not supported properties of response(onload arguments[0]): finalUrl
			// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
			// details.synchronous is not supported as Tampermonkey
			GM_xmlhttpRequest: function(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			},

			// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
			GM_openInTab: function(url) {
				window.open(url);
			},

			// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
			GM_setClipboard: function(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			},

			GM_getResourceText: function(name) {
				const _get = typeof(GM_getResourceText) === 'function' ? GM_getResourceText : () => (null);
				let text = _get(name);
				if (text) {return text;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.content ? resource.content : null;
					}
				}
				return null;
			},

			GM_getResourceURL: function(name) {
				const _get = typeof(GM_getResourceURL) === 'function' ? GM_getResourceURL : () => (null);
				let url = _get(name);
				if (url) {return url;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.src ? btoa(resource.src) : null;
					}
				}
				return null;
			},

			GM_addStyle: function(css) {
				const style = document.createElement('style');
				style.innerHTML = css;
				document.head.appendChild(style);
			},

			GM_addElement: function() {
				let parent_node, tag_name, attributes;
				const head_elements = ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript'/*, 'template'*/];
				if (arguments.length === 2) {
					tag_name = arguments[0];
					attributes = arguments[1];
					parent_node = head_elements.includes(tag_name.toLowerCase()) ? document.head : document.body;
				} else if (arguments.length === 3) {
					parent_node = arguments[0];
					tag_name = arguments[1];
					attributes = arguments[2];
				}
				const element = document.createElement(tag_name);
				for (const [prop, value] of Object.entries(attributes)) {
					element[prop] = value;
				}
				parent_node.appendChild(element);
			},

			GM_log: function() {
				const args = [];
				for (let i = 0; i < arguments.length; i++) {
					args[i] = arguments[i];
				}
				console.log.apply(null, args);
			},

			GM_info: details.GM_info,

			GM: {info: details.GM_info}
		};
		const _GM_POLYFILLED = Provides.GM_POLYFILLED = {};
		for (const pname of Object.keys(Provides)) {
			_GM_POLYFILLED[pname] = true;
		}

		// Create & move into polifilled environment
		ExecInNPEnv();

		return false;

		// Bypass xbrowser's useless GM_functions
		function bypassXB() {
			if (typeof(mbrowser) === 'object' || (typeof(GM_info) === 'object' && GM_info.scriptHandler === 'XMonkey')) {
				// Useless functions in XMonkey 1.0
				const GM_funcs = [
					'unsafeWindow',
					'GM_getValue',
					'GM_setValue',
					'GM_listValues',
					'GM_deleteValue',
					'GM_xmlhttpRequest'
				];
				for (const GM_func of GM_funcs) {
					window[GM_func] = undefined;
					eval('typeof({F}) === "function" && ({F} = undefined);'.replaceAll('{F}', GM_func));
				}
				// Delete dirty data saved by these stupid functions before
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					const value = localStorage.getItem(key);
					value === '[object Object]' && localStorage.removeItem(key);
				}
			}
		}

		// Check if already in name-predefined environment
		// I think there won't be anyone else wants to use this fxxking variable name...
		function InNPEnvironment() {
			return (typeof(GM_POLYFILLED) === 'object' && GM_POLYFILLED !== null) ? true : false;
		}

		function ExecInNPEnv() {
			const NG = new NameGenerator();

			// Init names
			const tnames = ['context', 'fapply', 'CDATA', 'uneval', 'define', 'module', 'exports', 'window', 'globalThis', 'console', 'cloneInto', 'exportFunction', 'createObjectIn', 'GM', 'GM_info'];
			const pnames = Object.keys(Provides);
			const fnames = tnames.slice();
			const argvlist = [];
			const argvs = [];

			// Add provides
			for (const pname of pnames) {
				!fnames.includes(pname) && fnames.push(pname);
			}

			// Add grants
			if (typeof(GM_info) === 'object' && GM_info.script && GM_info.script.grant) {
				for (const gname of GM_info.script.grant) {
					!fnames.includes(gname) && fnames.push(gname);
				}
			}

			// Make name code
			for (let i = 0; i < fnames.length; i++) {
				const fname = fnames[i];
				const exist = eval('typeof ' + fname) !== 'undefined' ? true : false;
				argvlist[i] = exist ? fname : (Provides.hasOwnProperty(fname) ? 'Provides.'+fname : '');
				argvs[i] = exist ? eval(fname) : (Provides.hasOwnProperty(fname) ? Provides[name] : undefined);
				pnames.includes(fname) && (_GM_POLYFILLED[fname] = !exist);
			}

			// Load all @require and @resource
			loadRequires(requires, resources, function(requires, resources) {
				// Join requirecode
				let requirecode = '';
				for (const require of requires) {
					const mode = require.execmode ? require.execmode : 'eval';
					const content = require.content;
					if (!content) {continue;}
					switch(mode) {
						case 'eval': 
							requirecode += content + '\n';
							break;
						case 'function': {
							const func = Function.apply(null, fnames.concat(content));
							func.apply(null, argvs);
							break;
						}
						case 'script': {
							const s = document.createElement('script');
							s.innerHTML = content;
							document.head.appendChild(s);
							break;
						}
					}
					
				}

				// Make final code & eval
				const varnames = ['NG', 'tnames', 'pnames', 'fnames', 'argvist', 'argvs', 'code', 'finalcode', 'wrapper', 'ExecInNPEnv', 'GM_POLYFILL_KEY_STORAGE', 'GM_POLYFILL_storage', 'InNPEnvironment', 'NameGenerator', 'LocalCDN', 'loadRequires', 'requestText', 'Provides', 'Supports', 'bypassXB', 'details', 'mainFunc', 'name', 'requires', 'resources', '_GM_POLYFILLED', 'NMonkey', 'polyfill_status'];
				const code = requirecode + 'let ' + varnames.join(', ') + ';\n(' + mainFunc.toString() + ') ();';
				const wrapper = Function.apply(null, fnames.concat(code));
				const finalcode = '(' + wrapper.toString() + ').apply(this, [' + argvlist.join(', ') + ']);';
				eval(finalcode);
			});

			function NameGenerator() {
				const NG = this;
				const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let index = [0];

				NG.generate = function() {
					const chars = [];
					indexIncrease();
					for (let i = 0; i < index.length; i++) {
						chars[i] = letters.charAt(index[i]);
					}
					return chars.join('');
				}

				NG.randtext = function(len=32) {
					const chars = [];
					for (let i = 0; i < len; i++) {
						chars[i] = letters[randint(0, letter.length-1)];
					}
					return chars.join('');
				}

				function indexIncrease(i=0) {
					index[i] === undefined && (index[i] = -1);
					++index[i] >= letters.length && (index[i] = 0, indexIncrease(i+1));
				}

				function randint(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
			}
		}

		// Load all @require and @resource for non-GM/TM environments (such as Alook javascript extension)
		// Requirements: function AsyncManager(){...}, function LocalCDN(){...}
		function loadRequires(requires, resoures, callback, args=[]) {
			// LocalCDN
			const LCDN = new LocalCDN();

			// AsyncManager
			const AM = new AsyncManager();
			AM.onfinish = function() {
				callback.apply(null, [requires, resoures].concat(args));
			}

			// Load js
			for (const js of requires) {
				!js.loaded() && loadinJs(js);
			}

			// Load resource
			for (const resource of resoures) {
				loadinResource(resource);
			}

			AM.finishEvent = true;

			function loadinJs(js) {
				AM.add();
				LCDN.get(js.src, function(content) {
					js.content = content;
					AM.finish();
				});
			}

			function loadinResource(resource) {
				let content;
				if (typeof(GM_getResourceText) === 'function' && (content = GM_getResourceText(resource.name))) {
					resource.content = content;
				} else {
					AM.add();
					LCDN.get(resource.src, function(content) {
						resource.content = content;
						AM.finish();
					});
				}
			}
		}

		// Loads web resources and saves them to GM-storage
		// Tries to load web resources from GM-storage in subsequent calls
		// Updates resources every $(this.expire) hours, or use $(this.refresh) function to update all resources instantly
		// Dependencies: GM_getValue(), GM_setValue(), requestText(), AsyncManager(), KEY_LOCALCDN
		function LocalCDN() {
			const LC = this;
			const _GM_getValue = typeof(GM_getValue) === 'function' ? GM_getValue : Provides.GM_getValue;
			const _GM_setValue = typeof(GM_setValue) === 'function' ? GM_setValue : Provides.GM_setValue;

			const KEY_LOCALCDN = 'LOCAL-CDN';
			const KEY_LOCALCDN_VERSION = 'version';
			const VALUE_LOCALCDN_VERSION = '0.2';

			// Default expire time (by hour)
			LC.expire = 72;

			// Try to get resource content from loaclCDN first, if failed/timeout, request from web && save to LocalCDN
			// Accepts callback only
			// Returns true if got from LocalCDN, false if got from web
			LC.get = function(url, callback, args=[]) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const resource = CDN[url];
				const time = (new Date()).getTime();

				if (resource && !expired(time, resource.time)) {
					callback.apply(null, [resource.content].concat(args));
					return true;
				} else {
					LC.request(url, function(content) {
						callback.apply(null, [content].concat(args));
					});
					return false;
				}
			}

			// Generate resource obj and set to CDN[url]
			// Returns resource obj
			LC.set = function(url, content) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const time = (new Date()).getTime();
				const resource = {
					url: url,
					time: time,
					content: content
				}
				CDN[url] = resource;
				_GM_setValue(KEY_LOCALCDN, CDN);
				return resource;
			}

			// Delete one resource from LocalCDN
			LC.delete = function(url) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				if (!CDN[url]) {
					return false;
				} else {
					delete CDN[url];
					_GM_setValue(KEY_LOCALCDN, CDN);
					return true;
				}
			}

			// Delete all resources in LocalCDN
			LC.clear = function() {
				_GM_setValue(KEY_LOCALCDN, {});
				upgradeConfig();
			}

			// List all resource saved in LocalCDN
			LC.list = function() {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const urls = LC.listurls();
				const resources = [];

				for (const url of urls) {
					resources.push(CDN[url]);
				}

				return resources;
			}

			// List all resource's url saved in LocalCDN
			LC.listurls = function() {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const keys = Object.keys(CDN);
				const urls = [];

				for (const key of keys) {
					if (key === KEY_LOCALCDN_VERSION) {continue;}
					urls.push(key);
				}

				return urls;
			}

			// Request content from web and save it to CDN[url]
			// Accepts callback only
			LC.request = function(url, callback, args=[]) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				requestText(url, function(content) {
					LC.set(url, content);
					callback.apply(null, [content].concat(args));
				});
			}

			// Re-request all resources in CDN instantly, ignoring LC.expire
			LC.refresh = function(callback, args=[]) {
				const urls = LC.listurls();

				const AM = new AsyncManager();
				AM.onfinish = function() {
					callback.apply(null, [].concat(args))
				};

				for (const url of urls) {
					AM.add();
					LC.request(url, function() {
						AM.finish();
					});
				}

				AM.finishEvent = true;
			}

			function upgradeConfig() {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				switch(CDN[KEY_LOCALCDN_VERSION]) {
					case undefined:
						init();
						break;
					case '0.1':
						v01_To_v02();
						logUpgrade();
						break;
					case VALUE_LOCALCDN_VERSION:
						DoLog('LocalCDN is in latest version.');
						break;
					default:
						DoLog(LogLevel.Error, 'LocalCDN.upgradeConfig: Invalid config version({V}) for LocalCDN. '.replace('{V}', CDN[KEY_LOCALCDN_VERSION]));
				}
				CDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
				_GM_setValue(KEY_LOCALCDN, CDN);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'LocalCDN successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', CDN[KEY_LOCALCDN_VERSION]).replaceAll('{V2}', VALUE_LOCALCDN_VERSION));
				}

				function init() {
					// Nothing to do here
				}

				function v01_To_v02() {
					const urls = LC.listurls();
					for (const url of urls) {
						if (url === KEY_LOCALCDN_VERSION) {continue;}
						CDN[url] = {
							url: url,
							time: 0,
							content: CDN[url]
						};
					}
				}
			}

			function clearExpired() {
				const resources = LC.list();
				const time = (new Date()).getTime();

				for (const resource of resources) {
					expired(resource.time, time) && LC.delete(resource.url);
				}
			}

			function expired(t1, t2) {
				return (t2 - t1) > (LC.expire * 60 * 60 * 1000);
			}

			upgradeConfig();
			clearExpired();
		}

		function requestText(url, callback, args=[]) {
			const req = typeof(GM_xmlhttpRequest) === 'function' ? GM_xmlhttpRequest : Provides.GM_xmlhttpRequest;
			req({
	            method:       'GET',
	            url:          url,
	            responseType: 'text',
	            onload:       function(response) {
	                const text = response.responseText;
					const argvs = [text].concat(args);
	                callback.apply(null, argvs);
	            }
	        })
		}

		function AsyncManager() {
			const AM = this;

			// Ongoing xhr count
			this.taskCount = 0;

			// Whether generate finish events
			let finishEvent = false;
			Object.defineProperty(this, 'finishEvent', {
				configurable: true,
				enumerable: true,
				get: () => (finishEvent),
				set: (b) => {
					finishEvent = b;
					b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
				}
			});

			// Add one task
			this.add = () => (++AM.taskCount);

			// Finish one task
			this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
		}

		// Arguments: level=LogLevel.Info, logContent, asObject=false
	    // Needs one call "DoLog();" to get it initialized before using it!
	    function DoLog() {
	    	const win = typeof(unsafeWindow) !== 'undefined' ? unsafeWindow : window;

	        // Global log levels set
	        win.LogLevel = {
	            None: 0,
	            Error: 1,
	            Success: 2,
	            Warning: 3,
	            Info: 4,
	        }
	        win.LogLevelMap = {};
	        win.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
	        win.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
	        win.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
	        win.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
	        win.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
	        win.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

	        // Current log level
	        DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

	        // Log counter
	        DoLog.logCount === undefined && (DoLog.logCount = 0);
	        if (++DoLog.logCount > 512) {
	            console.clear();
	            DoLog.logCount = 0;
	        }

	        // Get args
	        let level, logContent, asObject;
	        switch (arguments.length) {
	            case 1:
	                level = LogLevel.Info;
	                logContent = arguments[0];
	                asObject = false;
	                break;
	            case 2:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = false;
	                break;
	            case 3:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = arguments[2];
	                break;
	            default:
	                level = LogLevel.Info;
	                logContent = 'DoLog initialized.';
	                asObject = false;
	                break;
	        }

	        // Log when log level permits
	        if (level <= DoLog.logLevel) {
	            let msg = '%c' + LogLevelMap[level].prefix;
	            let subst = LogLevelMap[level].color;

	            if (asObject) {
	                msg += ' %o';
	            } else {
	                switch(typeof(logContent)) {
	                    case 'string': msg += ' %s'; break;
	                    case 'number': msg += ' %d'; break;
	                    case 'object': msg += ' %o'; break;
	                }
	            }

	            console.log(msg, subst, logContent);
	        }
	    }
	}
}) ();
