const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce').then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Ecommerce Backend API is running at /api/products');
});

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Email Transporter (using environment variables)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOrderEmail = async (order) => {
    const { customer, items, total } = order;

    const itemsList = items.map(item => `- ${item.name} (${item.quantity}) - $${item.price.toFixed(2)}`).join('\n');

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"ShopHub" <noreply@shophub.com>',
        to: customer.email,
        subject: 'Order Confirmation - ShopHub',
        text: `Hi ${customer.firstName},\n\nThank you for your order!\n\nOrder Details:\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\nWe will notify you when your items are shipped.\n\nBest regards,\nShopHub Team`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #333;">Order Confirmation</h2>
                <p>Hi ${customer.firstName},</p>
                <p>Thank you for your order! Here are your details:</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <ul style="list-style: none; padding: 0;">
                        ${items.map(item => `<li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <strong>${item.name}</strong> x ${item.quantity} <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                        </li>`).join('')}
                    </ul>
                    <div style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 10px;">
                        Total: $${total.toFixed(2)}
                    </div>
                </div>
                <p>We will notify you when your items are shipped.</p>
                <p>Best regards,<br><strong>ShopHub Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${customer.email}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOrder = await order.save();
        console.log('New Order Received:', newOrder);

        // Send email notification (async)
        sendOrderEmail(newOrder).catch(console.error);

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all orders (for admin/tracking)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 404 Handler
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).send(`Route ${req.url} not found on this server.`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (accessible at http://0.0.0.0:${PORT})`);
});
