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
    StoreID,
    Stock,
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

          const BookID = results.rows[0].BookID;
          // Check if book already exists in inventory
          pool.query(
            queries.checkBookInInventory,
            [BookID, StoreID],
            (error, results) => {
              if (error) throw error;

              if (results.rows.length) {
                // Update stock in inventory
                pool.query(
                  queries.updateInventory,
                  [Stock, BookID, StoreID],
                  (error, results) => {
                    if (error) throw error;
                    res
                      .status(201)
                      .send("Book added and inventory updated successfully!");
                  }
                );
              } else {
                // Add book to inventory
                pool.query(
                  queries.addBookToInventory,
                  [BookID, StoreID, Stock],
                  (error, results) => {
                    if (error) throw error;
                    res
                      .status(201)
                      .send("Book and inventory added successfully!");
                  }
                );
              }
            }
          );
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
const addWishlist = (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const bookId = parseInt(req.params.bookId);

  // Check if customer has already a wishlist
  pool.query(
    queries.getWishlistByCustomerID,
    [customerId],
    (error, results) => {
      if (error) throw error;

      let wishlistID;
      if (results.rows.length) {
        wishlistID = results.rows[0].WishlistID;
      } else {
        // Create a new wishlist for the customer
        pool.query(
          queries.createWishlist,
          [customerId, new Date()],
          (error, results) => {
            if (error) throw error;
            wishlistID = results.rows[0].WishlistID;
          }
        );
      }

      // Check if book is already in wishlist before adding
      pool.query(
        queries.checkBookInWishlist,
        [wishlistID, bookId],
        (error, results) => {
          if (error) throw error;

          if (results.rows.length) {
            res.status(400).send("Book is already in wishlist!");
          } else {
            // Add book to wishlist
            pool.query(
              queries.addBookToWishlist,
              [wishlistID, bookId, new Date()],
              (error, results) => {
                if (error) throw error;
                res.status(201).send("Book added to wishlist successfully!");
              }
            );
          }
        }
      );
    }
  );
};

// Remove Book from Wishlist
const removeBookFromWishlist = (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const bookId = parseInt(req.params.bookId);

  // Check if the customer's wishlist exists
  pool.query(
    queries.getWishlistByCustomerID,
    [customerId],
    (error, results) => {
      if (error) throw error;

      if (!results.rows.length) {
        return res
          .status(404)
          .send("Wishlist does not exist for this customer");
      }
      const wishlistID = results.rows[0].WishlistID;

      pool.query(
        queries.getBookInWishlist,
        [wishlistID, bookId],
        (error, results) => {
          if (error) throw error;

          if (!results.rows.length) {
            return res.status(404).send("Book does not exist in the wishlist");
          }
          // Remove book from wishlist
          pool.query(
            queries.removeBookFromWishlist,
            [wishlistID, bookId],
            (error, results) => {
              if (error) throw error;
              res.status(200).send("Book removed from wishlist successfully!");
            }
          );
        }
      );
    }
  );
};

// Get Wishlist Books for a Customer
const getWishlistBooks = (req, res) => {
  const customerId = parseInt(req.params.customerId);

  pool.query(
    queries.getWishlistBooksByCustomerID,
    [customerId],
    (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
};

// Search Books by Keywords
const searchBooks = (req, res) => {
  const { keywords } = req.query;

  if (!keywords || typeof keywords !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing keywords parameter" });
  }

  pool.query(queries.searchBooksByKeywords, [keywords], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// Dynamic SQL Query Builder
// --> Constructs and executes SQL queries based on user input
const buildQuery = (req, res) => {
  const { filters, sort, limit, offset } = req.body;
  // Query base
  let query = 'SELECT * FROM "Book"';
  let queryParams = [];
  let queryConditions = [];

  // Filters Query
  if (filters) {
    Object.keys(filters).forEach((key, index) => {
      if (typeof filters[key] === "object") {
        Object.keys(filters[key]).forEach((condition) => {
          let paramIndex = queryParams.length + 1;
          switch (condition) {
            case "gte":
              queryConditions.push(`"${key}" >= $${paramIndex}`);
              queryParams.push(filters[key][condition]);
              break;
            case "lte":
              queryConditions.push(`"${key}" <= $${paramIndex}`);
              queryParams.push(filters[key][condition]);
              break;
          }
        });
      } else {
        let paramIndex = queryParams.length + 1;
        queryConditions.push(`"${key}" = $${paramIndex}`);
        queryParams.push(filters[key]);
      }
    });
  }

  // Combine conditions with WHERE clause
  if (queryConditions.length > 0) {
    query += ` WHERE ${queryConditions.join(" AND ")}`;
  }

  // Sort Query
  if (sort) {
    query += ` ORDER BY "${sort.column}" ${sort.direction}`;
  }

  // Limit Query
  if (limit) {
    queryParams.push(limit);
    query += ` LIMIT $${queryParams.length}`;
  }

  // Offset Query
  if (offset) {
    queryParams.push(offset);
    query += ` OFFSET $${queryParams.length}`;
  }

  // Execute the Built Query
  pool.query(query, queryParams, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// TCL: Add Multiple Books to Wishlist with Transaction
const addMultipleBooksToWishlist = (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const { bookIds } = req.body;

  pool.connect((err, client, done) => {
    if (err) throw err;

    const handleError = (err) => {
      done();
      console.error(err);
      res.status(500).send("The book is already in wishlist!");
    };

    // Start transaction
    client.query("BEGIN", (err) => {
      if (err) return handleError(err);

      // Check if the customer's wishlist exists
      client.query(
        queries.getWishlistByCustomerID,
        [customerId],
        (err, results) => {
          if (err) return handleError(err);

          let wishlistID;
          if (results.rows.length) {
            wishlistID = results.rows[0].WishlistID;
          } else {
            // Create a new wishlist for the customer
            client.query(
              queries.createWishlist,
              [customerId, new Date()],
              (err, results) => {
                if (err) return handleError(err);
                wishlistID = results.rows[0].WishlistID;
              }
            );
          }

          // Add books to wishlist
          const addBookPromises = bookIds.map((bookId) =>
            client
              .query(queries.checkBookInWishlist, [wishlistID, bookId])
              .then((results) => {
                if (results.rows.length) {
                  res.send(`Book ${bookId} is already in wishlist!`);
                } else {
                  return client.query(queries.addBookToWishlist, [
                    wishlistID,
                    bookId,
                    new Date(),
                  ]);
                }
              })
          );

          Promise.all(addBookPromises)
            .then(() => {
              // Commit transaction
              client.query("COMMIT", (err) => {
                if (err) return handleError(err);
                done();
                res.status(201).send("Books added to wishlist successfully!");
              });
            })
            .catch((err) => {
              // Rollback transaction
              client.query("ROLLBACK", (err) => {
                if (err) return handleError(err);
                handleError(err);
              });
            });
        }
      );
    });
  });
};

const addMultipleNewBooks = (req, res) => {
  const { books } = req.body; // `books` should be an array of book objects

  pool.connect((err, client, done) => {
    if (err) throw err;

    const handleError = (err) => {
      client.query("ROLLBACK", (rollbackErr) => {
        done();
        if (rollbackErr) {
          console.error("Error rolling back transaction", rollbackErr);
        }
        console.error("Error in transaction", err);
        res.status(500).send("An error occurred");
      });
    };

    // Start transaction
    client.query("BEGIN", (err) => {
      if (err) return handleError(err);

      const processBook = (book) => {
        return new Promise((resolve, reject) => {
          const {
            BookName,
            ISBN,
            PublicationYear,
            Pages,
            BookPrice,
            PublisherID,
            LanguageID,
            BookFormatID,
            StoreID,
            Stock,
          } = book;

          // Check if ISBN exists before adding book
          client.query(queries.checkISBNExists, [ISBN], (err, results) => {
            if (err) return reject(err);

            if (results.rows.length) {
              return reject(new Error(`ISBN ${ISBN} already exists!`));
            }

            client.query(
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
              (err, results) => {
                if (err) return reject(err);

                const BookID = results.rows[0].BookID;

                client.query(
                  queries.checkBookInInventory,
                  [BookID, StoreID],
                  (err, results) => {
                    if (err) return reject(err);

                    if (results.rows.length) {
                      client.query(
                        queries.updateInventory,
                        [Stock, BookID, StoreID],
                        (err, results) => {
                          if (err) return reject(err);
                          resolve();
                        }
                      );
                    } else {
                      client.query(
                        queries.addBookToInventory,
                        [BookID, StoreID, Stock],
                        (err, results) => {
                          if (err) return reject(err);
                          resolve();
                        }
                      );
                    }
                  }
                );
              }
            );
          });
        });
      };

      // Use for..of loop to process books sequentially to ensure immediate rollback on error
      const processBooksSequentially = async () => {
        try {
          for (const book of books) {
            await processBook(book);
          }

          // Commit transaction
          client.query("COMMIT", (err) => {
            if (err) return handleError(err);
            done();
            res.status(201).send("Books added successfully!");
          });
        } catch (err) {
          handleError(err);
        }
      };

      processBooksSequentially();
    });
  });
};

// Update Multiple Book Prices with Transaction
const updateMultipleBookPrices = (req, res) => {
  const { bookPrices } = req.body;

  pool.connect((err, client, done) => {
    if (err) throw err;

    const handleError = (err) => {
      done();
      console.error(err);
      res.status(500).send("An error occurred");
    };

    // Start transaction
    client.query("BEGIN", (err) => {
      if (err) return handleError(err);

      const updatePricePromises = bookPrices.map(({ bookId, newPrice }) =>
        client.query(queries.updateBook, [newPrice, bookId])
      );

      Promise.all(updatePricePromises)
        .then(() => {
          // Commit transaction
          client.query("COMMIT", (err) => {
            if (err) return handleError(err);
            done();
            res.status(200).send("Book prices updated successfully!");
          });
        })
        .catch((err) => {
          // Rollback transaction
          client.query("ROLLBACK", (rollbackErr) => {
            if (rollbackErr) return handleError(rollbackErr);
            handleError(err);
          });
        });
    });
  });
};

module.exports = {
  getBooks,
  getBooksByID,
  addBook,
  removeBook,
  updateBook,
  getBooksByFormat,
  addWishlist,
  removeBookFromWishlist,
  getWishlistBooks,
  searchBooks,
  buildQuery,
  addMultipleBooksToWishlist,
  addMultipleNewBooks,
  updateMultipleBookPrices,
};
