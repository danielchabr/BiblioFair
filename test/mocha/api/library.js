//dependencies
var should = require('should'),
        assert = require('assert'),
        request = require('supertest'),
        mongoose = require('mongoose'),
        async = require("async"),
        passportStub = require("passport-stub"),
        app = require("../../../server.js"),
        User = mongoose.model("UserModel"),
        Book = mongoose.model("BookModel");


passportStub.install(app);

//globals
var url = 'http://localhost:8081',
        user = {
            username: 'johndoe',
            name: 'John Doe',
            email: 'TadeasPetak@gmail.com',
            language: 'cz',
            password: 'password'
        },
        lotr = {
            title: "Lord of the Rings",
            author: "J. R. R. Tolkien"
        },
        potter = {
            title: "Harry Potter",
            author: "J. K. Rowling"
        };

describe('API', function() {
    before(function(done) {
        done();
    });

    describe("Users", function() {

        it('should return unauthorized', function(done) {
            request(url).get('/api/library').end(function(err, res) {
                res.status.should.equal(401);
                done();
            });
        });

        it('should add a user', function(done) {
            this.timeout(5000);
            request(url).post('/signup').send(user).end(function(err, res) {
                user = res.body;
                passportStub.login(user);
                res.body.name.should.equal('John Doe');
                res.body.email.should.equal('tadeaspetak@gmail.com');
                done();
            });
        });

        it('should read an empty library', function(done) {
            request(url).get('/api/library').end(function(err, res) {
                res.body.library.length.should.equal(0);
                done();
            });
        });
        
        it('should add Harry Potter to the library',function(done){
            request(url).post('/api/library').send(potter).end(function(err, res) {
                potter = res.body;
                potter.title.should.equal("Harry Potter");
                Book.count(function(err, data){
                    data.toString().should.equal('1');
                    done();
                });
            });
        });
        
        it('should add LOTR to the library',function(done){
            request(url).post('/api/library').send(lotr).end(function(err, res) {
                lotr = res.body;
                lotr.title.should.equal("Lord of the Rings");
                Book.count(function(err, data){
                    data.toString().should.equal('2');
                    done();
                });
            });
        });
        
        it('should read a library with two books', function(done) {
            request(url).get('/api/library').end(function(err, res) {
                res.body.library.length.should.equal(2);
                res.body.library[1].id.title.should.equal("Lord of the Rings");
                done();
            });
        });
        
        it('should delete a book from the library', function(done) {
            request(url).del('/api/library/' + lotr._id).end(function(err, res) {
                res.body.title.should.equal("Lord of the Rings");
                done();
            });
        });
        
        it('should read a library with one book only', function(done) {
            request(url).get('/api/library').end(function(err, res) {
                res.body.library.length.should.equal(1);
                res.body.library[0].id.title.should.equal("Harry Potter");
                done();
            });
        });
        
        it('should still have two books in the database though',function(done){
            Book.count(function(err, data){
                data.toString().should.equal('2');
                done();
            });
        });
    });


    after(function(done) {
        User.remove().exec();
        Book.remove().exec();
        done();
    });
});