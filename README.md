Jan [![NPM Version](http://img.shields.io/npm/v/jan.svg?style=flat)](https://www.npmjs.org/package/jan) [![Bower Version](http://img.shields.io/bower/v/jan.svg?style=flat)](http://bower.io/search/?q=jan)
=============

[![Greenkeeper badge](https://badges.greenkeeper.io/synacor/jan.svg)](https://greenkeeper.io/)

[![Join the chat at https://gitter.im/synacor/jan](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/synacor/jan)

![Jan](https://janjs.herokuapp.com/logo.png)

**Jan is a simple library for making HTTP requests.**  
*Issue network calls without dealing with awkward legacy API signatures.*  

**[Documentation](https://janjs.herokuapp.com)**

[![Build Status](https://img.shields.io/travis/synacor/jan.svg?style=flat&branch=master)](https://travis-ci.org/synacor/jan)
[![Dependency Status](http://img.shields.io/david/synacor/jan.svg?style=flat)](https://david-dm.org/synacor/jan)
[![devDependency Status](http://img.shields.io/david/dev/synacor/jan.svg?style=flat)](https://david-dm.org/synacor/jan#info=devDependencies)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


---




Why Jan?
--------

**"AJAX" just isn't a thing anymore.**  
It's 2014, we're on Web 3.0 or some "living document" version of the web by now.  
We don't need to invent names for basic concepts like making HTTP requests.  

> **Ask yourself:**
>
> - Am I using a DOM manipulation library to do networking?  
> - Would I consider using a NPM package that both rendered HTML templates and abstracted WebSocket communications?  

Application architecture is easier when it isn't tied to monolithic frameworks.  
It's time to drop those aging AJAX APIs and get back to the basics of what makes networking simple.  


Usage
-----

**Basic GET request:**

```js
jan.get('/api/foo.json', function(err, res, json) {
	console.log(err, res, json);
});
```


**POST request:**

```js
jan.post({
	url : '/api/todos',
	body : 'name=Get%20gas'
}, function(err, res, data) {
	if (err) throw err;
	alert('ToDo created: ' + data.name);
});
```


**Request with all options:**

```js
jan({
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
jan.on('req', function(e) {
	e.req.headers['x-api-key'] = 'my-super-secure-api-key';
});
```

**Hook responses with the `res` event:**

```js
// A plugin that parses CSV responses
jan.on('res', function(e) {
	if (e.res.headers['content-type']==='text/csv') {
		e.res.data = e.res.csv = e.res.text.split(/\s*\,\s*/g);
	}
});
```


Instantiation
-------------

**Via node / browserify:**

```js
var jan = require('jan');
```

**Via AMD / requirejs:**

```js
define(['jan'], function(jan) {

});
```

**Via globals / script tag:**

```html
<script src="jan.js"></script>
<script>
	jan;  // now it's exposed as a "jan" global
</script>
```


Installation
------------

**Installation via Bower:** *(Recommended)*

```bash
bower install jan
```

**Manual Download:**

- [jan.js](dist/jan.js) - *full source with comments, for development*
- [jan.min.js](dist/jan.min.js) - *minified, for production*


License
-------

BSD


---


[![Jan Hankl](https://janjs.herokuapp.com/jan.jpg)](http://youtu.be/DY-Zdgo0OXo)
