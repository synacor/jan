/** Tribe is a simple library for making HTTP requests.
 *
 * Tribe makes it easy to issue network calls without dealing with awkward legacy API signatures.
 *
 * If called as a function, `tribe()` is an alias of {@link module:tribe.request `tribe.request()`}
 * @module tribe
 *
 * @example
 *	<caption>Basic Usage</caption>
 *	// grab the library:
 *	require(['tribe'], function(tribe) {
 *
 *		// Log requests before they go out:
 *		tribe.on('req', function(e) {
 *			console.log('Request: ', e.req);
 *		});
 *
 *		// Log responses when they come in:
 *		tribe.on('res', function(e) {
 *			console.log('Response: ', e.res);
 *		});
 *
 *		// Make a basic GET request:
 *		tribe('/api/todos', function(err, data) {
 *			if (err) throw err;
 *			var names = data.map(function(todo){ return todo.name; });
 *			alert('ToDos: ' + names.join(', '));
 *		});
 *	});
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
	var events = { req:[], res:[] },
		methods = 'GET POST PUT DELETE HEAD'.split(' '),
		hop = {}.hasOwnProperty;

	/** Issue an HTTP request.
	 * @memberOf module:tribe
	 * @name request
	 * @function
	 * @param {Object|String} options			Options for the request, or a `String` `"url"` to which a GET request should be issued.
	 * @param {String} [opt.method=GET]		HTTP method
	 * @param {String} [opt.url=/]				The URL to request
	 * @param {String|FormData|Blob|ArrayBufferView} [opt.body=none]		Request body, for HTTP methods that allow it. Supported types: [XMLHttpRequest#send](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#send())
	 * @param {Object} [opt.headers={ }]		A map of request headers
	 * @param {String} [opt.user=none]			Authentication username, if basic auth is to be used
	 * @param {String} [opt.pass=none]			Authentication password for basic auth
	 * @param {Function} callback				A function to call when the request has completed (error or success). Gets passed `(err, data, res)`.
	 *
	 * @example
	 *	<caption>"Kitchen Sync"</caption>
	 *	tribe({
	 *		method : 'PUT',
	 *		url : 'http://foo.com/bar.json',
	 *		headers : {
	 *			'Content-Type' : 'application/json'
	 *		},
	 *		user : 'bob',
	 *		pass : 'firebird',
	 *		body : JSON.stringify({ key : 'value' })
	 *	}, function(err, data, res) {
	 *		if (err) throw err;
	 *		console.log(res.status===204, data);
	 *	});
	 */
	function tribe(opt, callback) {
		opt = typeof opt==='string' ? {url:opt} : opt || {};
		opt.headers = opt.headers || {};
		var xhr = new XMLHttpRequest(),
			e = { xhr:xhr, req:opt };
		emit('req', e);
		(xhr = e.xhr).open(opt.method || 'GET', opt.url || '/', true, opt.user, opt.pass);
		for (var name in opt.headers) if (hop.call(opt.headers, name)) xhr.setRequestHeader(name, opt.headers[name]);
		xhr.onreadystatechange = function() {
			if (xhr.readyState!==4) return;
			var res = {
					status : xhr.status,
					error : xhr.status>399 ? xhr.statusText : null,
					headers : {},
					body : xhr.responseText,
					xml : xhr.responseXML,
					xhr : xhr
				},
				hreg = /^\s*([a-z0-9_-]+)\s*\:\s*(.*?)\s*$/gim,
				h = xhr.getAllResponseHeaders(),
				m;
			try{ res.json = JSON.parse(res.body); }catch(e){}
			res.data = res.json || res.xml || res.body;
			while (m=hreg.exec(h)) res.headers[m[1].toLowerCase()] = m[2];
			e.res = res;
			emit('res', e);
			(callback || opt.callback).call(e, res.error, res.data, res);
		};
		xhr.send(opt.body);
	}


	/**Register a handler function to be called in response to a given type of event.
	 * Valid event types are: `req` and `res`, fired on request and response respectively.
	 * @example
	 *	tribe.on('res', function(e) {
	 *		// e.req
	 *		// e.res
	 *		// e.xhr
	 *	});
	 * @param {String} type			An event type to observe
	 * @param {Function} handler	Handler function, gets passed an Event object
	 */
	tribe.on = function(type, handler) {
		events[type].push(handler);
	};


	function emit(type, args) {
		args = Array.prototype.slice.call(arguments, 1);
		for (var e=events[type], i=e.length; i--; ) e[i].apply(tribe, args);
	}

	function alias(overrides) {
		return function(opt, callback) {
			return tribe(extend({}, typeof opt==='string' ? {url:opt} : opt, overrides), callback);
		};
	}

	/**Alias of {@link module:tribe.request request()} that presupplies the option `method:'GET'`
	 * @name module:tribe.get
	 * @function
	 *
	 * @example
	 *	<caption>Get popular YouTube videos</caption>
	 *	var url = 'http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json';
	 *	tribe.get(url, function(err, data) {
	 *		if (err) throw err;
	 *		// display video links:
	 *		document.body.innerHTML = data.feed.entry.map(function(vid) {
	 *			return vid.title.$t.anchor(vid.content.src);	// String#neverforget
	 *		}).join('<br>');
	 *	});
	 */

	/**Alias of {@link module:tribe.request request()} that presupplies the option `method:'POST'`
	 * @name module:tribe.post
	 * @function
	 *
	 * @example
	 *	<caption>Submit a contact form</caption>
	 *	tribe.post({
	 *		url : 'http://example.com/contact-form.php',
	 *		headers : {
	 *			'Content-Type' : 'application/x-www-form-encoded'
	 *		},
	 *		body : new FormData(document.querySelector('form'))
	 *	}, function(err, data) {
	 *		if (err) throw err;
	 *		alert('Submitted: ' + data.message);
	 *	});
	 */

	/** Alias of {@link module:tribe.request request()} that presupplies the option `method:'PUT'`
	 * @name module:tribe.put
	 * @function
	 *
	 * @example
	 *	<caption>Update a REST resource</caption>
	 *	tribe.put({
	 *		url : 'http://foo.com/bar.json',
	 *		headers : { 'Content-Type':'application/json' },
	 *		body : '{"key":"val"}'
	 *	}, function(err, data) {
	 *		if (err) throw err;
	 *		console.log(data);
	 *	});
	 */

	/**	Alias of {@link module:tribe.request request()} that presupplies the option `method:'HEAD'`
	 *	@name module:tribe.head
	 *	@function
	 *
	 * @example
	 *	<caption>Get headers</caption>
	 *	tribe.head('/massive.json', function(err, data, res) {
	 *		if (err) throw err;
	 *		console.log(res.headers);
	 *	});
	 */

	/**	Alias of {@link module:tribe.request request()} that presupplies the option `method:'DELETE'`
	 *	@name module:tribe.del
	 *	@function
	 *
	 * @example
	 *	<caption>Delete a REST resource</caption>
	 *	tribe.del({
	 *		url : '/api/items/1a2b3c'
	 *	}, function(err, data) {
	 *		if (err) throw err;
	 *		alert('Deleted');
	 *	});
	 */

	/**	Alias of {@link module:tribe.del del()}.
	 *  This alias is provided for completeness, but [should not be used](http://mothereff.in/js-properties#delete) because [it throws in ES3](http://mathiasbynens.be/notes/javascript-properties).
	 *	@name module:tribe.delete
	 *	@function
	 *	@deprecated Don't call <code>delete()</code> if you need to support ES3. <code>tribe['delete']()</code> is okay.
	 */

	for (var i=methods.length; i--; ) {
		tribe[methods[i].toLowerCase()] = alias({ method:methods[i] });
	}
	tribe.del = tribe['delete'];

	function extend(base, obj) {
		for (var i=1, p, o; i<arguments.length; i++) {
			o = arguments[i];
			for (p in o) if (hop.call(o, p)) base[p] = o[p];
		}
		return base;
	}

	tribe.tribe = tribe.request = tribe;
	return tribe;
}));
