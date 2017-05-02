const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');

const {blogPost} = require('./models');

const app = express();
app.use(bodyParser.json());

app.get('/blog-posts', (req, res) => {
	blogPost.find().exec().then(blogPost => {
		res.json(blogPost.map(blogPost => blogPost.apiRepr()));
	}).catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal server error'});
	});
});

//GET request by ID

app.get('/blog-posts/:id', (req, res) => {
	blogPost.findById(req.params.id).exec().then(results =>
		res.json(results.apiRepr())).catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'})
		});
});

app.post('/blog-posts', (req, res) => {
	const requiredFields = ['title', 'author', 'content'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message)
			return res.status(400).send(message);
		}
	}
//create once req.body is validated
blogPost.create({
	title: req.body.title,
	content: req.body.content,
	author: req.body.author,
	created: req.body.created || Date.now()
}).then(results =>
res.status(201).json(results.apiRepr())).catch(err => {
	res.status(500).json({message: 'Internal server error'});
});
});

app.put('/blog-posts/:id', (req, res) => {
	if (!(req.body.id === req.params.id)) {
		const message = 'req.body.id and req.params.id must  match';
		console.error(message);
		res.status(400).json({message: message});
	}
	const toUpdate = {};
	const updateFields = ['title', 'author', 'content'];
	updateFields.forEach(field => {
		if(field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});
	blogPost.findByIdAndUpdate(req.params.id, {$set: toUpdate}).exec()
	.then(results => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/blog-posts/:id', (req, res) => {
	blogPost.findByIdAndRemove(req.params.id).exec()
	.then(results => res.status(204).end())
	.catch(err => 
		res.status(500).json({message: 'Internal server error'}));
});

app.use('*', function(req, res) {
	res.status(404).json({message: 'Address not found'});
});



let server;

function runServer(databaseUrl= DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`);
			resolve(server);
		}).on('error', err => {
			mongoose.disconnect();
			reject(err);
		});
	});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};