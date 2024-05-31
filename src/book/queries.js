// Get All Books and Sort by BookID
const getBooks = 'SELECT * FROM "Book" ORDER BY "BookID" ASC';

// Get All Books by ID
const getBooksByID = 'SELECT * FROM "Book" WHERE "BookID" = $1';

// Check if ISBN Exists
const checkISBNExists = 'SELECT b FROM "Book" b WHERE b."ISBN" = $1';

// Add book
const addBook =
  'INSERT INTO "Book" ("BookName", "ISBN", "PublicationYear", "Pages", "BookPrice", "PublisherID", "LanguageID", "BookFormatID") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

// Remove Book
const removeBook = 'DELETE FROM "Book" WHERE "BookID" = $1';

// Update Book
const updateBook = 'UPDATE "Book" SET "BookPrice" = $1 WHERE "BookID" = $2';

// Get All Books with Paperback Format
const getBooksByFormat =
  'SELECT * FROM "Book" WHERE "BookFormatID" = $1 ORDER BY "BookID" ASC';

module.exports = {
  getBooks,
  getBooksByID,
  checkISBNExists,
  addBook,
  removeBook,
  updateBook,
  getBooksByFormat,
};
