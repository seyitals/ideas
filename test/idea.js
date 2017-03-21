var mongoose = require('mongoose');
var Ideas = require('../app/model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('should');
var server = require('../index');

chai.use(chaiHttp);

describe('Ideas', function() {
  beforeEach(function(done) {
    Ideas.remove({}, function(err) {
      done();
    });
  });

  describe('/GET ideas', function() {
    it('it should get all ideas', function(done) {
      chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.statusCode.should.be.eql(200);
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  describe('/POST ideas', function() {
    xit('it should post an idea', function(done) {
      var myIdea = {
        name: 'visit iceland',
        kind: 'personal'
      };

      chai.request(server)
      .post('/ideas')
      .send(myIdea)
      .end(function(err, res) {
        res.statusCode.should.be.eql(200);
        res.body.data.length.should.be.eql(0);
        done();
      });
    });
  });

});
