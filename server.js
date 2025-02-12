var express = require('express');
var app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Public folder to store assets
app.use(express.static(__dirname + '/public'));

// Routes for app
app.get('/', function(req, res) {
    res.render('pad');
});

// Listen on port 8000 or any port defined
var port = process.env.PORT || 8000;
app.listen(port);