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
	it('should update post on PUT', function() {
		const updateData = {title: 'updated Blog', content: 'new blog text', author: 'you'};
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateData.id = res.body[0].id;
			return chai.request(app)
			.put(`/blog-posts/${updateData.id}`)
			.send(updateData);
		})
		.then(function(res) {
			res.should.have.status(204);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.deep.equal(Object.assign(updateData, {publishDate: res.body.publishDate}));
		});
	});
});