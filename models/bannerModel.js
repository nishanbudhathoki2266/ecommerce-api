const mongoose = require('mongoose');


const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    link: String,
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: "The banner status must be either active or inactive!"
        },
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    autoIndex: true
})


const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;