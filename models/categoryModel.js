const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default: null
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: 'The status can be either active or inactive!'
        },
        default: 'inactive'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    autoIndex: true,
})

categorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'createdBy',
        select: 'name email'
    })

    next();
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;