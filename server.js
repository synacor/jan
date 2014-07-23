var port = process.env.PORT || 5000,
	compression = require('compression'),
	serveStatic = require('serve-static'),
	express = require('express'),
	app = express();

app.use(compression());
app.use(serveStatic('docs'));
app.use('/dist', serveStatic('dist'));

app.listen(port, function() {
	console.log('Server listening on localhost:'+port);
});
