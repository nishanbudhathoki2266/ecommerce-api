const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    categories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
        required: true
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],
    attributes: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// setting compund index for efficient querying by product's price and ratingsAverage
productSchema.index({ price: 1, ratingsAverage: -1 });

// Also creating an index for slug 
productSchema.index({ slug: 1 });

// Virtual populate
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})

productSchema.pre('save', async function (next) {
    const createdSlug = slugify(this.name, { lower: true });
    this.slug = await this.constructor.findOne({ slug: createdSlug }) ? slugify(`${this.name} ${this.createdBy} ${Date.now()}`, { lower: true }) :
        createdSlug;
    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;