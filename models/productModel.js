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

// Virtual populate
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})

productSchema.pre('save', async function (next) {
    let createdSlug = slugify(this.name, { lower: true });
    this.slug = await this.constructor.findOne({ slug: createdSlug }) ? slugify(`${this.name} ${this.createdBy} ${Date.now()}`, { lower: true }) :
        createdSlug;
    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;