const mongoose = require('mongoose');


const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    link: String,
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive'],
            message: "The banner status must be either active or inactive!"
        }
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