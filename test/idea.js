var mongoose = require('mongoose');
var Ideas = require('../app/model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chais.should
var server = require('../index');

chai.use(chaiHttp);

describe('Ideas', function() {
  beforeEach(function(done) {
    Ideas.remove({}, function(err) {
      
    })
  })
})
