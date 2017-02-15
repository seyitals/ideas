app.factory('Ideas', function($http) {
  return {
    getAll: function() {
      return $http.get('/api');
    },
    getOneIdea: function(idea_id) {
      return $http.get('/api/ideas/' + idea_id);
    },
    addIdea: function(idea) {
      return $http.post('/api/ideas', idea);
    },
    delete: function(idea_id) {
      return $http.delete('/api/ideas/' + idea_id);
    },
    update: function(idea_id, idea) {
      return $http.put('/api/ideas/' + idea_id, idea);
    }
  };
});