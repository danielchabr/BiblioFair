//dependencies
var should = require('should'),
        assert = require('assert'),
        request = require('supertest'),
        mongoose = require('mongoose'),
        async = require("async"),
        passportStub = require("passport-stub"),
        app = require("../../../server.js");


passportStub.install(app);
//db
User = mongoose.model("UserModel");

//globals
var url = 'http://localhost:8081',
        user = {
            username: 'johndoe',
            name: 'John Doe',
            email: 'TadeasPetak@gmail.com',
            language: 'cz'
        },
agent = request.agent(url);

describe('API', function() {
    before(function(done) {
        done();
    });

    describe("Users", function() {

        //count users
        it('should begin with no users', function(done) {
            request(url).get('/api/users/count').end(function(err, res) {
                res.text.should.equal('0');
                done();
            });
        });

        //add an invalid user
        it('should fail to add a user without email', function(done) {
            request(url).post('/signup').send({
                username: 'aaaa',
                language: 'cz'
            }).end(function(err, res) {
                res.status.should.equal(500);
                res.body[0].path.should.equal("email");
                res.body[0].type.should.equal("required");
                console.log(res.text);
                User.count(function(err, data) {
                    data.should.equal(0);
                    done();
                });
            });
        });

        //add an invalid user
        it('should fail to add a user without password', function(done) {
            request(url).post('/signup').send(user).end(function(err, res) {
                res.status.should.equal(500);
                res.body[0].path.should.equal("password");
                res.body[0].type.should.equal("required");
                console.log(res.text);
                User.count(function(err, data) {
                    data.should.equal(0);
                    done();
                });
            });
        });

        //add a VALID user
        /*it('should add a user and lower case their email', function(done) {
         user.password = 'password';
         request(url).post('/api/users').send(user).end(function(err, res) {
         user = res.body;
         user.password = "password";
         res.body.name.should.equal('John Doe');
         res.body.email.should.equal('john.doe@email.com');
         done();
         });
         });
         
         //count users
         it('should have 1 user now', function(done) {
         request(url).get('/api/users/count').end(function(err, res) {
         res.text.should.equal('1');
         done();
         });
         });
         
         //request data without authorization
         it('should return 401 - User not authorized ', function(done) {
         request(url).put('/api/users/location').send({location: ['123', '234']}).end(function(err, res) {
         res.status.should.equal(401);
         done();
         });
         });
         
         it('should update user location', function(done) {
         //login
         passportStub.login(user);
         
         request(url).put('/api/users/location').send({coordinates: [123, 234]}).end(function(err, res) {
         res.body.loc.coordinates[1].should.equal(234);
         done();
         });
         });
         
         it('should update user password', function(done) {
         request(url).put('/api/users/password').send({password: 'pass'}).end(function(err, res) {
         res.status.should.equal(200);
         
         //logout
         passportStub.logout();
         done();
         });
         });
         
         it('should not authenticate', function(done) {
         request(url).post("/signin").send(user).end(function(err, res) {
         res.status.should.equal(401);
         done();
         });
         });
         
         it('should authenticate', function(done) {
         user.password = "pass";
         request(url).post("/signin").send(user).end(function(err, res) {
         res.text.should.equal('ok');
         done();
         });
         });
         
         it('should update user language', function(done) {
         passportStub.login(user);
         request(url).put('/api/users/language').send({language: 'ga'}).end(function(err, res) {
         res.body.language.should.equal('ga');
         done();
         });
         });*/

    });


    after(function(done) {
        User.remove().exec();
        done();
    });
});