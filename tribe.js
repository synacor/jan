/** @fileOverview A solution to the hilarious over-use of "ajax frameworks"
 *  @example
 *		tribe({
 *			method : 'PUT',
 *			url : 'http://foo.com/bar.json',
 *			headers : { 'Content-Type':'application/json' },
 *			body : '{"key":"val"}'
 *		}, function(err, data) {
 *			if (err) throw err;
 *			console.log(data);
 *		});
 */
(function(factory) {
	if (typeof define==='function' && define.amd) {
		define([], factory);
	}
	else if (typeof module==='object' && module.exports) {
		module.exports = factory();
	}
	else {
		window.tribe = factory();
	}
}(function() {
	var plugins = [],
		methods = 'GET POST PUT DELETE HEAD'.split(' '),
		hop = {}.hasOwnProperty;

	/** Issue an HTTP request.
	 *  @param {Object|String} options			Options for the request, or a `String` `url` to which a GET request should be issued.
	 *	@param {String} [options.method="GET"]	HTTP method
	 *	@param {String} [options.url="/"]		The URL to request
	 */
	function tribe(opt, callback) {
		opt = typeof opt==='string' ? {url:opt} : opt || {};
		opt.headers = opt.headers || {};
		var xhr = new XMLHttpRequest();
		for (var i=plugins.length; i--; ) plugins[i](opt, xhr);
		xhr.open(opt.method || 'GET', opt.url || '/', true, opt.user, opt.pass);
		for (var name in opt.headers) (hop.call(opt.headers, name) && xhr.setRequestHeader(name, opt.headers[name]));
		xhr.onloadend = function() {
			var res = {
					headers : {},
					body : xhr.responseText,
					data : xhr.response
				},
				hreg = /^\s*([a-z0-9_-]+)\s*\:\s*(.*?)\s*$/gim,
				h = xhr.getAllResponseHeaders(),
				m;
			if (typeof res.data==='string') {
				try{ res.data = JSON.parse(res.data); }catch(e){}
			}
			while (m=hreg.exec(h)) res.headers[m[1].toLowerCase()] = m[2];
			(callback || opt.callback)( xhr.status>399 ? xhr.statusText : null, data, xhr );
		};
		xhr.send(opt.body);
	}


	/** Add a plugin to modify or intercept all requests.
	 *	@param {Function} f		Plugin function, of the form `function(options, xhr){}`
	 */
	tribe.plugin = function(f) {
		plugins.push(f);
	};

	function alias(overrides) {
		return function(opt, callback) {
			return tribe(extend({}, opt, overrides), callback);
		};
	}

	// aliases
	for (var i=methods.length; i--; ) {
		tribe[methods[i].toLowerCase()] = alias({ method:methods[i] });
	}

	tribe.del = tribe['delete'];

	function extend(base, obj) {
		for (var i=1, p, o; i<arguments.length; i++) {
			o = arguments[i];
			for (p in o) {
				if (hop.call(o, p)) {
					base[p] = o[p];
				}
			}
		}
		return base;
	}

	tribe.tribe = tribe.request = tribe;
	return tribe;
}));
