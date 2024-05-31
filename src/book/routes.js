const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.get("/books", controller.getBooks);
router.post("/books", controller.addBook);
router.get("/books/:id", controller.getBooksByID);
router.put("/books/:id", controller.updateBook);
router.delete("/books/:id", controller.removeBook);
router.get("/format/:id", controller.getBooksByFormat);
router.post("/account/:customerId/wishlist", controller.addWishlist);
router.get("/account/:customerId/wishlist", controller.getWishlistBooks);
router.get("/search", controller.searchBooks);

module.exports = router;
