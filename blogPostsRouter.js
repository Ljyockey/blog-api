const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('blog-1', 'Look! It\'s my first blog!', 'LJ' );
BlogPosts.create('blog-2', 'Oh boy! What a wonderful day!', 'Mickey Mouse');
BlogPosts.create('blog-3', 'It\'s lev-i-O-sa!', 'Hermione');

module.exports = router;