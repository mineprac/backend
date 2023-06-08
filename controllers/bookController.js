const Book = require('../models/bookModel');
const cloudinary = require('cloudinary');

// Create New Book
exports.newBook = async (req, res, next) => {
    try {
        let images = []
        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        const imagesLink = []

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "items",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLink;

        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            book,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get All Books
exports.allBooks = async (req, res, next) => {

    const books = await Book.find();

    return res.status(200).json({
        books
    });
}

// Update Book
exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);

        if (req.body.images !== undefined) {
            let images = [];
            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }
            for (let i = 0; i < book.images.length; i++) {
                await cloudinary.v2.uploader.destroy(book.images[i].public_id);
            }

            const imagesLink = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "items",
                });

                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            req.body.images = imagesLink;
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Stock Quantity
exports.updateStock = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (req.body.operation === "add") {
            book.openingStock += +req.body.stock;
        } else if (req.body.operation === "reduce") {
            book.openingStock -= +req.body.stock;
        }

        await book.save();

        res.status(201).json({
            success: true
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete Books
exports.deleteBook = async (req, res, next) => {
    try {
        const bookIds = req.body.bookIds;

        const promises = bookIds.map(async (bookId) => {
            const book = await Book.findById(bookId);

            for (let i = 0; i < book.images.length; i++) {
                await cloudinary.v2.uploader.destroy(book.images[i].public_id);
            }

            await book.deleteOne();
        });

        await Promise.all(promises);

        res.status(200).json({
            success: true,
            message: "Books have been deleted.",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};