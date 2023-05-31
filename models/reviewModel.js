const mongoose = require('mongoose');
const Product = require('./../models/productModel');

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
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Populating the product and user field while querying
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})

reviewSchema.statics.calcAverageRatings = async function (productId) {
    // In static functions, this points to the current model
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },

            }
        }
    ]);

    await Product.findByIdAndUpdate(productId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    })
}

// Post middleware doesn't have access to next
reviewSchema.post('save', function () {
    // Here this points to current review -> and this.constructor points to the model
    this.constructor.calcAverageRatings(this.product);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;