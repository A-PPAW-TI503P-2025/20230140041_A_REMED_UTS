const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/books', bookController.getAllBooks);
router.get('/books/:id', bookController.getBookById);

router.post('/books', authMiddleware('admin'), bookController.createBook);
router.put('/books/:id', authMiddleware('admin'), bookController.updateBook);
router.delete('/books/:id', authMiddleware('admin'), bookController.deleteBook);

router.post('/borrow', authMiddleware('user'), borrowController.borrowBook);

module.exports = router;