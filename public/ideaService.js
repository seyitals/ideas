app.factory('Ideas', function($http) {
  return {
    getAll: function() {
      return $http.get('/');
    },
    getOneIdea: function(idea_id) {
      return $http.get('/ideas' + idea_id);
    },
    addIdea: function(idea) {
      return $http.post('/ideas/' + idea);
    },
    delete: function(idea_id) {
      return $http.delete('/ideas/' + idea_id);
    },
    update: function(idea_id) {
      return $http.patch('/ideas/' + idea_id);
    }
  };
});