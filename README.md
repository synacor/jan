
![Tribe](http://cl.ly/image/3x3M2n330204/logo.png)

**Tribe is a simple library for making HTTP requests.**  
*Tribe makes it easy to issue network calls without dealing with awkward legacy API signatures.*  


Why Tribe?
----------

**"AJAX" just isn't a thing anymore.**  
It's 2014, we're on Web 3.0 or some "living document" version of the web by now.  
We no longer need strange made-up strange names for basic concepts like HTTP requests.  
> **Ask yourself:**
>
> - Why am I using a DOM manipulation library to do networking?  
> - Would I consider using a NPM package that both rendered HTML templates and abstracted WebSocket communications?  

We all know application architecture is easier when it isn't tied to monolithic frameworks.  
It's time we dropped these aging APIs and got back to the basics of what makes networking simple.  


Usage
-----

**Basic GET request:**

```js
tribe.get('/api/foo.json', function(err, json) {
	console.log(err, json);
});
```


**POST request:**

```js
tribe.post({
	url : '/api/todos',
	body : 'name=Get%20gas'
}, function(err, data) {
	if (err) throw err;
	alert('ToDo created: ' + data.name);
});
```


**Request with all options:**

```js
tribe({
	method : 'PUT',
	url : 'http://foo.com/bar.json',
	headers : {
		'Content-Type' : 'application/json'
	},
	user : 'bob',
	pass : 'firebird',
	body : JSON.stringify({ key : 'value' })
}, function(err, res) {
	if (err) throw err;
	console.log(res);
});
```


Plugins / Events
----------------

**Hook requests with the `req` event:**

```js
// A plugin that adds an API key header to all requests:
tribe.on('req', function(e) {
	e.req.headers['x-api-key'] = 'my-super-secure-api-key';
});
```

**Hook responses with the `res` event:**

```js
// A plugin that adds an API key header to all requests:
tribe.on('req', function(e) {
	e.req.headers['x-api-key'] = 'my-super-secure-api-key';
});
```


Instantiation
-------------

**Via node / browserify:**

```js
var tribe = require('tribe');
```

**Via AMD / requirejs:**

```js
define(['tribe'], function(tribe) {

});
```

**Via globals / script tag:**

```html
<script src="tribe.js"></script>
<script>
	tribe;  // now it's exposed as a "tribe" global
</script>
```


Installation
------------

**Installation via Bower:** *(Recommended)*

```bash
bower install tribe=git+ssh://git@stash.corp.synacor.com:7999/apla/tribe.git
```

**Manual Download:**

- [tribe.js](dist/tribe.js) - *full source with comments, for development*
- [tribe.min.js](dist/tribe.min.js) - *minified, for production*


License
-------

Proprietary / Closed-Source
