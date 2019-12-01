/**
 * Import the express library
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

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
 * File system operations for interacting with the books
 */
function getBooks() {
  return new Promise((resolve, reject) => {
    fs.readFile('./books.json', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
  .then(JSON.parse);
}

function getBookById(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('./books.json', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
  .then(JSON.parse)
  .then((books) => books.find((book) => book.id === id));
}

function addBook(book) {
  return new Promise((resolve, reject) => {
    fs.readFile('./books.json', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
  .then(JSON.parse)
  .then((books) => {
    const newBook = {
      id: `${+books[books.length - 1].id + 1}`,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      summary: book.summary,
    };

    books.push(newBook);
    return Promise.all([
      newBook,
      fs.writeFileSync('./books.json', JSON.stringify(books, null, 2)),
    ]);
  })
  .then(([newBook]) => newBook);
}

function updateBook(updatedBook) {
  return new Promise((resolve, reject) => {
    fs.readFile('./books.json', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
  .then(JSON.parse)
  .then((books) => {
    const indexOfBook = books.findIndex((book) => book.id === updatedBook.id);
    books.splice(indexOfBook, 1, updatedBook);

    return Promise.all([
      updatedBook,
      fs.writeFileSync('./books.json', JSON.stringify(books, null, 2)),
    ]);
  })
  .then(([updatedBook]) => updatedBook);
}

function deleteBookById(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('./books.json', (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  })
  .then(JSON.parse)
  .then((books) => {
    const indexOfBook = books.findIndex((book) => book.id === id);
    books.splice(indexOfBook, 1);
    return fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));
  });
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
