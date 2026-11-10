// backend/server.js
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Product, Series, Chapter } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Cloud Database Connection URI (falls back to local if not set)
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://gamer_jot:thisissecured2k26@sainijot.eefej8j.mongodb.net/quiet_battles?retryWrites=true&w=majority';

// Admin Credentials
const ADMIN_USER = process.env.ADMIN_USER || 'gamer_jot';
const ADMIN_PASS = process.env.ADMIN_PASS || 'thisissecured2k26';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'qb-editorial-cms-token-2026';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// 0. ADMIN AUTHENTICATION & MIDDLEWARE
// ==========================================
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { username: ADMIN_USER, role: 'Editorial Director' },
    });
  }
  return res.status(401).json({ error: 'Invalid Admin Username or Password' });
});

function requireAdminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin Token Required' });
  }
  next();
}

// ==========================================
// 1. PUBLIC STOREFRONT API ROUTES (GET)
// ==========================================
app.get('/api/series', async (req, res) => {
  try {
    const seriesList = await Series.find().sort({ createdAt: 1 });
    res.json(seriesList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/series/:slug', async (req, res) => {
  try {
    const series = await Series.findOne({ slug: req.params.slug });
    if (!series) return res.status(404).json({ error: 'Series not found' });

    const chapters = await Chapter.find({ seriesId: series._id })
      .sort({ chapterNumber: 1 })
      .populate('linkedProduct');

    res.json({ series, chapters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapters/:slug', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ slug: req.params.slug })
      .populate('linkedProduct')
      .populate('seriesId');
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PROTECTED ADMIN CMS API ROUTES (POST / PUT)
// ==========================================
app.post('/api/admin/series', requireAdminAuth, async (req, res) => {
  try {
    const newSeries = await Series.create(req.body);
    res.status(201).json(newSeries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/series/:id', requireAdminAuth, async (req, res) => {
  try {
    const updated = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/chapters', requireAdminAuth, async (req, res) => {
  try {
    const newChapter = await Chapter.create(req.body);
    res.status(201).json(newChapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/chapters/:id', requireAdminAuth, async (req, res) => {
  try {
    const updated = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/products', requireAdminAuth, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 QUIET BATTLES Server running on http://localhost:${PORT}`));