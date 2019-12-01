/**
 * Services for interacting with books
 */
function getBooks() {
  return fetch('/books')
  .then((res) => res.json());
}

function getBookById(id) {
  return fetch(`/books/${id}`)
  .then((res) => res.json());
}

function addBook(book) {
  return fetch('/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
  .then((res) => res.json());
}

function updateBook(book) {
  return fetch(`/books/${book.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
  .then((res) => res.json());
}

function deleteBookById(id) {
  return fetch(`/books/${id}`, {
    method: 'DELETE',
  })
  .then((res) => res.json());
}

/**
 * Template functions for creating markup
 */
function createBookElement(book) {
  return `
    <li id="${book.id}" class="book">
      ${book.title} | ${book.author}
    </li>
  `;
};

function createBookList(books) {
  return `
    <div>
      <button id="add">Add new book</button>
      <ul id="books">
        ${books.map(createBookElement).join('\n')}
      </ul>
    </div>
  `;
}

function createBookDetails(book) {
  return `
    <div>
      <button id="back">Back to overview</button>
      <img class="cover" src="${book.coverImage}">
      <h3>${book.title}</h3>
      <h4>Written by ${book.author}</h4>
      <p>${book.summary}</p>
      <button id="edit">Edit</button>
      <button id="delete">Delete</button>
    </div>
  `;
}

function createBookForm() {
  return `
    <div>
      <h3>Add new book to library</h3>
      <form id="form" class="book-form" action="/books" method="POST">
        <label for="title">
          Title
          <input type="text" name="title">
        </label>
        <label for="author">
          Author
          <input type="text" name="author">
        </label>
        <label for="coverImage">
          Cover Image Link
          <input type="text" name="coverImage">
        </label>
        <label for="summary">
          Short Summary
          <input type="text" name="summary">
        </label>
        <button type="submit">Add book</button>
        <button id="cancel">Cancel</button>
      </form>
    <div>
  `;
}

function createEditForm(book) {
  return `
    <div>
      <h3>Edit book</h3>
      <form id="form" class="book-form">
        <label for="title">
          Title
          <input type="text" name="title" value="${book.title}">
        </label>
        <label for="author">
          Author
          <input type="text" name="author" value="${book.author}">
        </label>
        <label for="coverImage">
          Cover Image Link
          <input type="text" name="coverImage" value="${book.coverImage}">
        </label>
        <label for="summary">
          Short Summary
          <input type="text" name="summary" value="${book.summary}">
        </label>
        <button type="submit">Edit book</button>
        <button id="cancel">Cancel</button>
      </form>
    <div>
  `;
}

/**
 * 1. Render the overview of books (title and/or covers)
 */
async function renderBookList() {
  const mainNode = document.getElementById('main');
  /**
   * Fetch all the books in the library
   */
  const books = await getBooks();

  /**
   * Render all the books that was fetched
   */
  const bookList = createBookList(books);

  /**
   * Append the elements to the DOM
   */
  mainNode.innerHTML = bookList;

  /**
   * Get the newly rendered list of books
   */
  const listNode = document.getElementById('books');

  /**
   * Attach event listeners when selecting a book
   */
  listNode.addEventListener('click', function (event) {
    const selectedBookId = event.target.id;
    renderBookDetails(selectedBookId);
  });

  /**
   * Get the "Add new book" button element
   */
  const addButtonNode = document.getElementById('add');

  /**
   * Attach event listener to "Add new book" button
   */
  addButtonNode.addEventListener('click', function (event) {
    renderBookForm();
  });
};

/**
 * 2. Render form that enables you to add new books
 */
async function renderBookForm() {
  const mainNode = document.getElementById('main');

  /**
   * Render the book details that was fetched
   */
  const bookForm = createBookForm();

  /**
   * Append the elements to the DOM
   */
  mainNode.innerHTML = bookForm;

  /**
   * Attach event listeners to go back
   */
  const cancelNode = document.getElementById('cancel');
  cancelNode.addEventListener('click', function (event) {
    event.preventDefault();
    renderBookList();
  });

  /**
   * Attach event listener to submit button
   * (to override default behaviour)
   */
  const formNode = document.getElementById('form');
  formNode.addEventListener('submit', function (event) {
    /**
     * Prevent the form from submitting
     */
    event.preventDefault();

    /**
     * Get the data from the form
     */
    const bookData = {
      title: formNode.elements.title.value,
      author: formNode.elements.author.value,
      coverImage: formNode.elements.coverImage.value,
      summary: formNode.elements.summary.value,
    };

    /**
     * Post book data to server
     */
    addBook(bookData)
    .then(() => renderBookList())
    .catch(console.log);
  });
}

/**
 * 3. Show details for a specific book
 */
async function renderBookDetails(id) {
  const mainNode = document.getElementById('main');
  /**
   * Fetch the selected book by id
   */
  const book = await getBookById(id);

  /**
   * Render the book details that was fetched
   */
  const bookDetails = createBookDetails(book);

  /**
   * Append the elements to the DOM
   */
  mainNode.innerHTML = bookDetails;

  /**
   * Attach event listeners to go back
   */
  const backNode = document.getElementById('back');
  backNode.addEventListener('click', function (event) {
    renderBookList();
  });

  /**
   * Attach event listeners to delete book
   */
  const deleteNode = document.getElementById('delete');
  deleteNode.addEventListener('click', function (event) {
    deleteBookById(id)
    .then(() => renderBookList())
    .catch(console.log);
  });

  /**
   * Attach event listeners to delete book
   */
  const editNode = document.getElementById('edit');
  editNode.addEventListener('click', function (event) {
    renderEditForm(id);
  });
}

/**
 * 4. Render form that enables you to edit books
 */
async function renderEditForm(id) {
  const mainNode = document.getElementById('main');

  /**
   * Fetch the selected book by id
   */
  const book = await getBookById(id);

  /**
   * Render the book form for the book that was fetched
   */
  const editForm = createEditForm(book);

  /**
   * Append the elements to the DOM
   */
  mainNode.innerHTML = editForm;

  /**
   * Attach event listeners to go back
   */
  const cancelNode = document.getElementById('cancel');
  cancelNode.addEventListener('click', function (event) {
    renderBookDetails(id);
  });

  /**
   * Attach event listener to submit button
   * (to override default behaviour)
   */
  const formNode = document.getElementById('form');
  formNode.addEventListener('submit', function (event) {
    /**
     * Prevent the form from submitting
     */
    event.preventDefault();

    /**
     * Get the data from the form
     */
    const bookData = {
      id,
      title: formNode.elements.title.value,
      author: formNode.elements.author.value,
      coverImage: formNode.elements.coverImage.value,
      summary: formNode.elements.summary.value,
    };

    /**
     * Post book data to server
     */
    updateBook(bookData)
    .then(() => renderBookDetails(id))
    .catch(console.log);
  });
}

/**
 * Initial render
 */
renderBookList();
