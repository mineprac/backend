const express = require('express');
const { newBook, allBooks, updateBook, deleteBook, updateStock } = require('../controllers/bookController');

const router = express();

router.route("/book/new").post(newBook);
router.route("/book/all").get(allBooks);
router.route('/book/:id').put(updateBook)
router.route('/book/updateStock/:id').put(updateStock)
router.route('/book').delete(deleteBook)

module.exports = router;