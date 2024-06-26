// Get All Books and Sort by BookID
const getBooks = 'SELECT * FROM "Book" ORDER BY "BookID" ASC';

// Get All Books by ID
const getBooksByID = 'SELECT * FROM "Book" WHERE "BookID" = $1';

// Check if ISBN Exists
const checkISBNExists = 'SELECT b FROM "Book" b WHERE b."ISBN" = $1';

// Add book
const addBook =
  'INSERT INTO "Book" ("BookName", "ISBN", "PublicationYear", "Pages", "BookPrice", "PublisherID", "LanguageID", "BookFormatID") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "BookID"';

// Check if book exists in inventory
const checkBookInInventory =
  'SELECT * FROM "BookInventory" WHERE "BookID" = $1 AND "StoreID" = $2';

// Update stock in inventory
const updateInventory =
  'UPDATE "BookInventory" SET "Stock" = "Stock" + $1 WHERE "BookID" = $2 AND "StoreID" = $3';

// Add book to inventory
const addBookToInventory =
  'INSERT INTO "BookInventory" ("BookID", "StoreID", "Stock") VALUES ($1, $2, $3)';

// Remove Book
const removeBook = 'DELETE FROM "Book" WHERE "BookID" = $1';

// Get all inventory entries for a book
const getInventoryByBookID =
  'SELECT * FROM "BookInventory" WHERE "BookID" = $1';

// Update stock in inventory
const updateInventoryOnRemove =
  'UPDATE "BookInventory" SET "Stock" = "Stock" - $1 WHERE "BookID" = $2 AND "StoreID" = $3';

// Remove inventory entry if stock is 0
const removeInventoryEntry =
  'DELETE FROM "BookInventory" WHERE "BookID" = $1 AND "StoreID" = $2 AND "Stock" <= 0';

// Update Book
const updateBook = 'UPDATE "Book" SET "BookPrice" = $1 WHERE "BookID" = $2';

// Get All Books with Paperback Format
const getBooksByFormat =
  'SELECT * FROM "Book" WHERE "BookFormatID" = $1 ORDER BY "BookID" ASC';

// Get Wishlist by CustomerID
const getWishlistByCustomerID =
  'SELECT * FROM "Wishlist" WHERE "CustomerID" = $1';

// Create Wishlist for Customer
const createWishlist =
  'INSERT INTO "Wishlist" ("CustomerID", "BookID") VALUES ($1, $2) RETURNING "WishlistID"';

// Add Book to Wishlist
const addBookToWishlist =
  'INSERT INTO "Wishlist_Book" ("WishlistID", "BookID", "AddedAt") VALUES ($1, $2, $3)';

// Get Wishlist Books by CustomerID
const getWishlistBooksByCustomerID = `
  SELECT w."WishlistID", wb."BookID", wb."AddedAt"
  FROM "Wishlist" w
  JOIN "Wishlist_Book" wb ON w."WishlistID" = wb."WishlistID"
  WHERE w."CustomerID" = $1
`;

// Search Books by Keywords
const searchBooksByKeywords = `SELECT * FROM "Book" WHERE "BookName" ILIKE '%' || $1 || '%' ORDER BY "BookID" ASC`;

// Remove Book from Wishlist
const removeBookFromWishlist =
  'DELETE FROM "Wishlist_Book" WHERE "WishlistID" = $1 AND "BookID" = $2';
const getBookInWishlist = `
  SELECT * FROM "Wishlist_Book" 
  WHERE "WishlistID" = $1 AND "BookID" = $2
`;

// Update Book Prices
const updateBookPrice =
  'UPDATE "Book" SET "BookPrice" = $1 WHERE "BookID" = $2';

// Check if Book is in Wishlist
const checkBookInWishlist =
  'SELECT * FROM "Wishlist_Book" WHERE "WishlistID" = $1 AND "BookID" = $2';

module.exports = {
  getBooks,
  getBooksByID,
  checkISBNExists,
  addBook,
  removeBook,
  updateBook,
  getBooksByFormat,
  getWishlistByCustomerID,
  createWishlist,
  addBookToWishlist,
  getWishlistBooksByCustomerID,
  searchBooksByKeywords,
  removeBookFromWishlist,
  getBookInWishlist,
  updateBookPrice,
  checkBookInWishlist,
  checkBookInInventory,
  updateInventory,
  addBookToInventory,
  getInventoryByBookID,
  updateInventoryOnRemove,
  removeInventoryEntry,
};
