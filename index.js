var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  port = process.env.PORT || 8080,
  db = require('./config/database');

mongoose.connect(db.database);

app.use(express.static(__dirname + 'public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride('X-HTTP-Method-Override'));

require('./app/routes')(app);

app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});

app.listen(port);
console.log('assessment happens on port 8080');

module.exports = app;
