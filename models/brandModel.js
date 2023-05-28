const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    autoIndex: true,
})

// Creating slugs 
brandSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// Populating output for every queries starting with find
brandSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'createdBy',
        select: 'name email'
    })
    next();
})

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;