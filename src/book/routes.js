const { Router } = require("express");
const controller = require("./controller");

const router = Router();

// POST Method (Create)
router.post("/books", controller.addBook);
router.post("/account/:customerId/wishlist/:bookId", controller.addWishlist);
router.post("/book-query", controller.buildQuery);
router.post(
  "/account/:customerId/addmultiplewishlist",
  controller.addMultipleBooksToWishlist
);
router.post("/books/addmultiplebooks", controller.addMultipleNewBooks);

// GET Method (Read)
router.get("/books", controller.getBooks);
router.get("/books/:id", controller.getBooksByID);
router.get("/format/:id", controller.getBooksByFormat);
router.get("/account/:customerId/wishlist", controller.getWishlistBooks);
router.get("/book-search", controller.searchBooks);

// PUT Method (Update)
router.put("/books/:id", controller.updateBook);

// DELETE Method (Delete)
router.delete("/books/:id", controller.removeBook);
router.delete(
  "/account/:customerId/wishlist/:bookId",
  controller.removeBookFromWishlist
);

module.exports = router;
