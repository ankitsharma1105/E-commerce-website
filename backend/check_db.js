const mongoose = require('mongoose');
const Product = require('./models/Product');

const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(async () => {
        const count = await Product.countDocuments();
        console.log(`Product count: ${count}`);
        if (count > 0) {
            const product = await Product.findOne();
            fs.writeFileSync('db_sample.json', JSON.stringify(product, null, 2));
            console.log('Sample product saved to db_sample.json');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
