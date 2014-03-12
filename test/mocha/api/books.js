//dependencies
var should = require('should'),
        assert = require('assert'),
        request = require('supertest'),
        mongoose = require('mongoose'),
        async = require("async");

//db
var Book = mongoose.model("BookModel"),
        User = mongoose.model("UserModel");

//globals
var books = [], bookCount = 6, secondBookId;

describe('API', function() {
    var url = 'http://localhost:8081';

    before(function(done) {
        //create 'booksCount' number of books
        for (var i = 1;i <= bookCount;i++) {
            books.push(new Book({
                title:'Book n.' + i + ' - title',
                author:'Book n.' + i + ' - author'
            }));
        }
        //save the id of the second book
        secondBookId = books[1]._id;

        done();
    });

    describe("Books", function() {
        
        /**
         * Count.
         */
        
        it('should begin with no books', function(done) {
            request(url).get('/api/books/count').end(function(err, res) {
                res.text.should.equal('0');
                done();
            });
        });

        it("should now contain " + bookCount + " books", function(done) {
            async.each(books, function(book, done) {
                book.save(done);
            }, function() {
                request(url).get('/api/books/count').end(function(err, res) {
                    res.text.should.equal(bookCount.toString());
                    done();
                });
            });
        });
        
        /**
         * Get a book by its id.
         */
        
        it("should return an error", function(done) {
            request(url).get('/api/books/non-existing-id').end(function(err, res) {
                res.status.should.equal(404);
                done();
            });
        });

        it("should return the second book", function(done) {
            request(url).get('/api/books/' + secondBookId).end(function(err, res) {
                res.body.title.should.equal("Book n.2 - title");
                res.body.author.should.equal("Book n.2 - author");
                done();
            });
        });
        
        /**
         * Get books specified by options.
         */
        
        it("should return book #3 & #4", function(done){
            request(url).post('/api/books').send({
                limit:2,
                offset: 2                
            }).end(function(err, res) {
                res.body[0].title.should.equal("Book n.3 - title");
                res.body[1].author.should.equal("Book n.4 - author");
                done();
            });
        });
        
        /**
         * Search for HP.
         */
        
        it("should find Indian Medicine, 1990",function(done){
            request(url).get('/api/books/search/' + '0806122935').end(function(err, res) {
                res.body.Results[0].YEAR[0].should.equal('1990');
                done();
            });
            
            
        });
    });

    after(function(done) {
        Book.remove().exec();
        done();
    });
});