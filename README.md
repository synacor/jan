
![Tribe](logo.png)

**Tribe is a simple library for making HTTP requests.**  
*Tribe makes it easy to issue network calls without dealing with awkward legacy API signatures.*  


Why Tribe?
----------

**"AJAX" just isn't a thing anymore.**  
It's 2014, we're on Web 3.0 or some "living document" version of the web by now.  
We no longer need strange made-up strange names for basic concepts like HTTP requests.  
> **Ask yourself:**
>
> - Why would you use a DOM abstraction library to do networking?  
> - Would it be considered "normal" to use a library on the server that both rendered HTML templates and abstracted WebSocket connections?  

It's time we dropped these aging APIs and got back to the basics of what makes networking simple:

```js
tribe.get('/api/foo.json', function(err, json) {
	console.log(err, json);
});
```

Here's the rest of the options:

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


Installation
------------

```bash
bower install tribe=git+ssh://git@stash.corp.synacor.com:7999/apla/tribe.git
```


Usage
-----

```js
var tribe = require('tribe');

// A plugin that adds an API key header to all requests:
tribe.plugin(function(opt, xhr) {
	opt.headers['x-api-key'] = 'my-super-secure-api-key';
});
```


License
-------

Proprietary / Closed-Source
