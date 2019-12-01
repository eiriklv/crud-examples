/**
 * Import the express library
 */
const express = require('express');
const bodyParser = require('body-parser');

/**
 * Create an express app
 */
const app = express();

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
 * Create fake library data
 */
const books = [
  {
    id: '1',
    title: 'Harry Potter - The Philosophers Stone',
    author: 'J.K. Rowling',
    coverImage: '/covers/1.jpg',
    summary: 'Adaptation of the first of J.K. Rowling\'s popular children\'s novels about Harry Potter, a boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own. He is summoned from his life as an unwanted child to become a student at Hogwarts, an English boarding school for wizards. There, he meets several friends who become his closest allies and help him discover the truth about his parents\' mysterious deaths.'
  },
  {
    id: '2',
    title: 'The Lord of the Rings',
    author: 'J.R.R Tolkien',
    coverImage: '/covers/2.jpg',
    summary: 'The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins (Elijah Wood), who inherits the Ring and steps into legend. A daunting task lies ahead for Frodo when he becomes the Ringbearer - to destroy the One Ring in the fires of Mount Doom where it was forged.'
  },
  {
    id: '3',
    title: 'Hitchhiker\'s Guide to the Galaxy',
    author: 'Douglas Adams',
    coverImage: '/covers/3.jpg',
    summary: 'Earthman Arthur Dent is rescued by his friend, Ford Prefect—an alien researcher for the titular Hitchhiker\'s Guide to the Galaxy, an enormous work providing information about every planet in the universe—from the Earth just before it is destroyed by the alien Vogons.'
  }
];

function getBooks() {
  return books;
}

function getBookById(id) {
  return books.find((book) => book.id === id);
}

function addBook(book) {
  const newBook = {
    id: `${+books[books.length - 1].id + 1}`,
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    summary: book.summary,
  };

  books.push(newBook);
  return newBook;
}

function updateBook(updatedBook) {
  const indexOfBook = books.findIndex((book) => book.id === updatedBook.id);
  books.splice(indexOfBook, 1, updatedBook);
  return updatedBook;
}

function deleteBookById(id) {
  const indexOfBook = books.findIndex((book) => book.id === id);
  books.splice(indexOfBook, 1);
}

/**
 * REST endpoint for our books resource
 */
app.get('/books/:id', function (req, res) {
  const { id } = req.params;
  const selectedBook = getBookById(id);

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
    summary,
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
