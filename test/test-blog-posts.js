const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Blog Posts', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});
	it('should list blog posts on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
		});
	});
	it('should add new blog post on POST', function() {
		const newPost = {title: 'test post', content: 'here is my test blog', author: 'me'};
		return chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'title', 'content', 'author');
		});
	});
});