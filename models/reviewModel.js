const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'A review must belong to a product!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must be of a user!']
    }
}, {
    timestamps: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Preventing duplicate reviews from a user for a product
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populating the product and user field while querying
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'product',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;