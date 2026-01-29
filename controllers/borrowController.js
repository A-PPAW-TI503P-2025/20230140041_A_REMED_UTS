const Book = require('../models/book');
const BorrowLog = require('../models/borrowLog');
const sequelize = require('../config/database');

exports.borrowBook = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.headers['x-user-id'] || req.body.userId;

        if (!bookId || !latitude || !longitude || !userId) {
            return res.status(400).json({ message: 'Missing required fields (bookId, latitude, longitude, userId)' });
        }

        const book = await Book.findByPk(bookId, { transaction: t });
        if (!book) {
            await t.rollback();
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock <= 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Book out of stock' });
        }

        // Update stock
        await book.update({ stock: book.stock - 1 }, { transaction: t });

        // Log borrowing
        const log = await BorrowLog.create({
            userId,
            bookId,
            latitude,
            longitude,
            borrowDate: new Date()
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Book borrowed successfully', log });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};