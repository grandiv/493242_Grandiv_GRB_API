const pool = require("../../db");
const queries = require("./queries");

// Get All Books
const getBooks = (req, res) => {
  pool.query(queries.getBooks, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// Get Books by ID
const getBooksByID = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getBooksByID, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// Add Book
const addBook = (req, res) => {
  const {
    BookName,
    ISBN,
    PublicationYear,
    Pages,
    BookPrice,
    PublisherID,
    LanguageID,
    BookFormatID,
  } = req.body;

  // Check if ISBN exists
  pool.query(queries.checkISBNExists, [ISBN], (error, results) => {
    if (results.rows.length) {
      res.send("ISBN already exists!");
    } else {
      // Add books to database
      pool.query(
        queries.addBook,
        [
          BookName,
          ISBN,
          PublicationYear,
          Pages,
          BookPrice,
          PublisherID,
          LanguageID,
          BookFormatID,
        ],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("Book added successfully!");
        }
      );
    }
  });
};

// Remove Book
const removeBook = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getBooksByID, [id], (error, results) => {
    const noBookFound = !results.rows.length;
    if (noBookFound) {
      res.send("Book does not exist in the database");
    }
    pool.query(queries.removeBook, [id], (error, results) => {
      if (error) throw error;
      res.status(200).send("Book removed successfully!");
    });
  });
};

// Update Book
const updateBook = (req, res) => {
  const id = parseInt(req.params.id);
  const { BookPrice } = req.body;

  pool.query(queries.getBooksByID, [id], (error, results) => {
    const noBookFound = !results.rows.length;
    if (noBookFound) {
      res.send("Book does not exist in the database");
    }
    pool.query(queries.updateBook, [BookPrice, id], (error, results) => {
      if (error) throw error;
      res.status(200).send("Book updated successfully!");
    });
  });
};

// Get All Books by a particular Format
const getBooksByFormat = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getBooksByFormat, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// Add Book to Wishlist
// const addWishlist = (req, res) => {
//   const {
//     BookName,
//     ISBN,
//     PublicationYear,
//     Pages,
//     BookPrice,
//     PublisherID,
//     LanguageID,
//     BookFormatID,
//   } = req.body;

//   // Check if ISBN exists
//   pool.query(queries.checkISBNExists, [ISBN], (error, results) => {
//     if (results.rows.length) {
//       res.send("ISBN already exists!");
//     } else {
//       // Add books to database
//       pool.query(
//         queries.addBook,
//         [
//           BookName,
//           ISBN,
//           PublicationYear,
//           Pages,
//           BookPrice,
//           PublisherID,
//           LanguageID,
//           BookFormatID,
//         ],
//         (error, results) => {
//           if (error) throw error;
//           res.status(201).send("Book added successfully!");
//         }
//       );
//     }
//   });
// };

module.exports = {
  getBooks,
  getBooksByID,
  addBook,
  removeBook,
  updateBook,
  getBooksByFormat,
  // addWishlist,
};
