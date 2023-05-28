// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         required: true
//     },
//     brand: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Brand',
//         required: true
//     },
//     vendor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Vendor',
//         required: true
//     },
//     images: {
//         type: [String],
//         default: []
//     },
//     attributes: [{
//         name: {
//             type: String,
//             required: true
//         },
//         value: {
//             type: String,
//             required: true
//         }
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;