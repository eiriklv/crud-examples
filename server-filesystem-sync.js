/**
 * Import the express library
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
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
 * File system operations for interacting with the books
 */
function getBooks() {
  return JSON.parse(fs.readFileSync('./books.json'));
}

function getBookById(id) {
  return JSON.parse(fs.readFileSync('./books.json'))
  .find((book) => book.id === id);
}

function addBook(book) {
  const books = JSON.parse(fs.readFileSync('./books.json'));

  const newBook = {
    id: `${+books[books.length - 1].id + 1}`,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    summary: book.summary,
  };

  books.push(newBook);
  fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));
  return newBook;
}

function updateBook(updatedBook) {
  const books = JSON.parse(fs.readFileSync('./books.json'));
  const indexOfBook = books.findIndex((book) => book.id === updatedBook.id);
  books.splice(indexOfBook, 1, updatedBook);
  fs.writeFileSync('./books.json', JSON.stringify(books));
  return updatedBook;
}

function deleteBookById(id) {
  const books = JSON.parse(fs.readFileSync('./books.json'));
  const indexOfBook = books.findIndex((book) => book.id === id);
  books.splice(indexOfBook, 1);
  fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));
}

/**
 * REST endpoint for our books resource
 */
app.get('/books/:id', function (req, res) {
  const { id } = req.params;

  const books = getBooks();
  const selectedBook = books.find((book) => id === book.id);

  if (!selectedBook) {
    return res.status(404).send({ message: 'Unknown book id' });
  }

  res.send(selectedBook);
});

app.get('/books', function (req, res) {
  const books = getBooks();
  res.send(books);
});

app.post('/books', function (req, res) {
  const {
    title,
    author,
    coverImage,
    summary
  } = req.body;

  const newBook = addBook({
    title,
    author,
    coverImage,
    summary
  });

  res.send(newBook);
});

app.put('/books/:id', function (req, res) {
  const {
    id,
    title,
    author,
    coverImage,
    summary
  } = req.body;

  const updatedBook = updateBook({
    id,
    title,
    author,
    coverImage,
    summary,
  });

  res.send(updatedBook);
});

app.delete('/books/:id', function (req, res) {
  const { id } = req.params;
  deleteBookById(id);
  res.send({ id });
});

/**
 * Attach the app to port 3000
 * so that we can access it
 */
app.listen(3000, () => {
  console.log('Library app running on port http://localhost:3000');
});
