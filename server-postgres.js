/**
 * Import the express library
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { Pool } = require('pg');

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
 * Database (postgres) operations for interacting with the books
 */
const pool = new Pool({
  user: 'nodeuser',
  host: 'localhost',
  database: 'library',
  password: 'test',
  port: 5432,
});

function getBooks() {
  return pool.query('SELECT id, title, author FROM books')
  .then(({ rows }) => {
    return rows.map((book) => {
      return {
        id: book.id,
        author: book.author,
        title: book.title,
      };
    });
  });
}

function getBookById(id) {
  return pool.query('SELECT * FROM books WHERE id = $1', [id])
  .then(({ rows }) => {
    return rows.map((book) => {
      return {
        id: book.id,
        author: book.author,
        title: book.title,
        coverImage: book.cover_image,
        summary: book.summary,
      };
    });
  })
  .then((books) => books[0]);
}

function addBook(book) {
  const queryText = `
    INSERT INTO books(
      title,
      author,
      cover_image,
      summary
    )

    VALUES(
      $1,
      $2,
      $3,
      $4
    )

    RETURNING *
  `;

  const queryValues = [
    book.title,
    book.author,
    book.coverImage,
    book.summary
  ];

  return pool.query(queryText, queryValues)
  .then(({ rows }) => {
    return rows.map((book) => {
      return {
        id: book.id,
        author: book.author,
        title: book.title,
        coverImage: book.cover_image,
        summary: book.summary,
      };
    });
  })
  .then((books) => books[0]);
}

function updateBook(book) {
  const queryText = `
    UPDATE books

    SET
      title = $2,
      author = $3,
      cover_image = $4,
      summary = $5

    WHERE
      id = $1

    RETURNING *
  `;

  const queryValues = [
    book.id,
    book.title,
    book.author,
    book.coverImage,
    book.summary,
  ];

  return pool.query(queryText, queryValues)
  .then(({ rows }) => {
    return rows.map((book) => {
      return {
        id: book.id,
        author: book.author,
        title: book.title,
        coverImage: book.cover_image,
        summary: book.summary,
      };
    });
  })
  .then((books) => books[0]);
}

function deleteBookById(id) {
  return pool.query('DELETE FROM books WHERE id = $1', [id])
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
  })
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
 * Attach the app to port 3000
 * so that we can access it
 */
app.listen(3000, () => {
  console.log('Library app running on port http://localhost:3000');
});
