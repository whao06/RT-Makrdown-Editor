var express = require('express'); // Import Expressjs Framework
var app = express(); // Create express app instance
var path = require('path'); // Import Node path module for handling file path

// Set view engine to ejs as template engine -> rendering views
// EJS (Embedded JavaScript) - can generate HTML with plain js
app.set('view engine', 'ejs');

// Public folder to store assets
app.use(express.static(path.join(__dirname, 'public'))); // dirname = current dir path

// Routes definition
app.get('/', function(req, res) {
    res.render('pad');
});

// Listen on port 8k or any port defined
var port = process.env.PORT || 8000;
app.listen(port);