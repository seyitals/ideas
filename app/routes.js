var Ideas = require('./model');

module.exports = function(app) {
  app.get('/api', function(req, res) {
    Ideas.find(function(err, ideas) {
      if (err){
        res.send(err);
      }
      res.json(ideas);
    });
  });

  app.get('/api/ideas/:idea_id', function(req, res) {
    Ideas.findById(req.params.idea_id, function(err, idea) {
      if (err){
        res.send(err);
      }
      res.json(idea);
    });
  });

  app.post('/api/ideas', function(req, res) {
    var idea = new Ideas(req.body);
    idea.name = req.body.name;
    idea.kind = req.body.kind;
    idea.save(function(err) {
      if (err){
        res.send(err);
      }
      Ideas.find(function(err, ideas) {
        if (err){
          res.send(err);
        }
        res.json({
          message: 'Idea saved',
          data: ideas
        });
      });
    });
  });

  app.delete('/api/ideas/:idea_id', function(req, res) {
    Ideas.remove({
      _id: req.params.idea_id
    }, function(err, idea) {
      if (err){
        res.send(err);
      }
      res.json({
        message: 'Successfully deleted'
      });
    });
  });

  app.put('/api/ideas/:idea_id', function(req, res) {
    Ideas.findById(req.params.idea_id, function(err, idea) {
      if (err){
        res.send(err);
      }
      idea.name = req.body.name;
      idea.kind = req.body.kind;

      idea.save(function(err) {
        if (err){
          res.send(err);
        }
        res.json({
          message: 'Idea updated',
          data: idea
        });
      });
    });
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
