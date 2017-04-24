const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('blog-1', 'Look! It\'s my first blog!', 'LJ' );
BlogPosts.create('blog-2', 'Oh boy! What a wonderful day!', 'Mickey Mouse');
BlogPosts.create('blog-3', 'It\'s lev-i-O-sa!', 'Hermione');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\``;
			console.error(message);
			res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

router.delete('/:id', jsonParser, (req, res) => {
	console.log(`Deleting blog ID \`${req.params.id}\``);
	BlogPosts.delete(req.params.id);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		message = 'ID in request body and request parameter don\'t match';
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating item \`${req.params.id}\``);
		const updatedItem = BlogPosts.update({
			id: req.params.id,
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		});
	res.status(204).json(updatedItem);
});

module.exports = router;