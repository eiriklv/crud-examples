/**
 * Import the express library
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

/**
 * Create an express app
 */
const app = express();

/**
 * Support cross-origin requests
 */
app.use(cors());

/**
 * Support JSON and form-data POST bodies
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Serve all requests for static assets
 * from the /public folder
 *
 * This is where we will serve the client
 * JavaScript, CSS and other assets like images
 */
app.use(express.static('public'));

/**
 * Database (postgres) operations for interacting with the books
 */
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

/**
 * Database object placeholder
 * (This is replaced with the actual database object when the connection is made at the end)
 */
let db;

/**
 * Helper function to accommodate for the default _id field in MongoDB
 */
function addIdField(book) {
  return {
    ...book,
    id: book._id,
  };
}

/**
 * Database services
 */
function getBooks() {
  return db.collection('books')
  .find({}, {
    title: 1,
    author: 1,
  })
  .toArray()
  .then((books) => books.map(addIdField));
}

function getBookById(id) {
  return db.collection('books')
  .findOne({ _id: ObjectId(id) })
  .then(addIdField);
}

function addBook(book) {
  return db.collection('books')
  .insertOne(book)
  .then(addIdField);
}

function updateBook(book) {
  return db.collection('books')
  .findOneAndUpdate({ _id: ObjectId(book.id) }, {
    $set: {
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      summary: book.summary,
    },
  })
  .then(addIdField);
}

function deleteBookById(id) {
  return db.collection('books').findOneAndDelete({ _id: ObjectId(id) })
  .then(addIdField);
}

/**
 * REST endpoint for our books resource
 */
app.get('/books/:id', function (req, res) {
  const { id } = req.params;

  getBookById(id)
  .then((book) => {
    if (!book) {
      return res.status(404).send({ message: 'Unknown book id' });
    }
    res.send(book);
  });
});

app.get('/books', function (req, res) {
  getBooks()
  .then((books) => {
    res.send(books);
  });
});

app.post('/books', function (req, res) {
  const {
    title,
    author,
    coverImage,
    summary
  } = req.body;

  addBook({
    title,
    author,
    coverImage,
    summary
  })
  .then((newBook) => {
    res.send(newBook);
  });
});

app.put('/books/:id', function (req, res) {
  const {
    id,
    title,
    author,
    coverImage,
    summary
  } = req.body;

  updateBook({
    id,
    title,
    author,
    coverImage,
    summary,
  })
  .then((updatedBook) => {
    res.send(updatedBook);
  });
});

app.delete('/books/:id', function (req, res) {
  const { id } = req.params;
  deleteBookById(id)
  .then(() => {
    res.send({ id });
  });
});

/**
 * Connect to database and then start server
 */
client.connect()
.then(() => {
  /**
   * Create and replace the database object
   * (we select the "library" database)
   */
  db = client.db('library');

  /**
   * Attach the app to port 3000
   * so that we can access it
   */
  app.listen(3000, () => {
    console.log('Library app running on port http://localhost:3000');
  });
})
.catch(console.log);
