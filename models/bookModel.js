const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: String,
    itemCode: Number,
    itemDescription: String,
    unitType: {
        type: String,
        required: true,
        trim: true,
    },
    openingStock: Number,
    lowStockWarn: Boolean,
    lowStockUnits: Number,
    purchasePrice: Number,
    taxInclusive: Boolean,
    taxRate: Number
});

module.exports = mongoose.model("Book", bookSchema);