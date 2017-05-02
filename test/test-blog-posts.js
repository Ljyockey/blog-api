const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const mongoose = require('mongoose');

describe('Blog Posts', function() {

	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	//GET
	it('should list blog posts on GET', function(done) {
		chai.request(app)
		.get('/blog-posts')
		.end(function(err, res) {
			res.should.have.status(200);
			res.should.be.json;
			done();
		});
	});

	//POST
	it('should add new blog post on POST', function(done) {
		const newPost = {title: 'test post', content: 'here is my test blog', author: 'me'};
		chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'title', 'content', 'author');
			done();
		});
	});

	//POST edge case
	it('should throw an error with incomplete POST parameters', function(done) {
		const badData = {};
			chai.request(app)
				.post('/blog-posts')
				.send(badData)
				.end(function(err, res) {
					res.should.have.status(400);
					done();
				});
	});

	//PUT
	it('should update post on PUT', function() {
		const updateData = {title: 'updated Blog', content: 'new blog text', author: 'you'};
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateData.id = res.body[0].id;
			return chai.request(app)
			.put(`/blog-posts/${res.body[0].id}`)
			.send(updateData)
		})
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.deep.equal(Object.assign(updateData, {publishDate: res.body.publishDate}));
		});
		
	});

	//PUT edge case
	it('should throw an error when id of req parameter and req body don\'t match on PUT', function(done) {
		const testData = {author: 'foo', content: 'bar', title: 'fizz', id: 'ikbjwegb2012nvw83'};
			chai.request(app)
			.get('/blog-posts')
			.end(function(err, res) {
				chai.request(app)
				.put(`/blog-posts/${res.body[0].id}`)
				.send(testData)
				.end(function(err, res) {
					res.should.have.status(400);
					done();
				});
			})
	});

	//DELETE
	it('should remove post on DELETE', function(done) {
		chai.request(app)
		.get('/blog-posts')
		.end(function(err, res) {
			chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`)
			.end(function(err, res) {
			res.should.have.status(204);
			done();
		});
	});
	});

});
