// Force public DNS resolvers locally for MongoDB SRV lookups
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. MIDDLEWARE
// ==========================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token', 'admin-token']
}));
app.use(express.json());

// ==========================================
// 2. MONGOOSE SCHEMAS & MODELS
// ==========================================
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  edition: { type: String, default: "Standard Edition" },
  material: { type: String, required: true },
  fit: { type: String, default: "Oversized Boxy Silhouette" },
  weight: { type: String, default: "450 GSM Heavyweight Fleece" },
  origin: { type: String, default: "Crafted in Portugal" },
  treatment: { type: String, default: "Cold-Dyed Pigment Wash" },
  images: [{ type: String }],
  description: { type: String, required: true },
  stock: { type: Number, default: 50 },
  chapterRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
}, { timestamps: true });

const ChapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String },
  narrative: { type: String, required: true },
  releaseDate: { type: Date, default: Date.now },
  coverImage: { type: String },
  seriesRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
  linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

const SeriesSchema = new mongoose.Schema({
  seriesNumber: { type: Number, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  manifesto: { type: String, required: true },
  releaseYear: { type: Number, default: 2026 },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }]
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      size: String
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
const Series = mongoose.models.Series || mongoose.model('Series', SeriesSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// ==========================================
// 3. ADMIN AUTHENTICATION MIDDLEWARE
// ==========================================
const verifyAdminToken = (req, res, next) => {
  const token =
    req.headers['x-admin-token'] ||
    req.headers['admin-token'] ||
    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, ''));

  const expectedToken = process.env.ADMIN_TOKEN || 'qb-editorial-cms-token-2026';

  if (!token || (token !== expectedToken && token !== 'qb-editorial-cms-token-2026')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative clearance.' });
  }
  next();
};

// ==========================================
// 4. API ROUTES
// ==========================================

// Health & System Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'QUIET BATTLES Editorial API',
    version: '1.0.0',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', endpoints: ['/api/products', '/api/series', '/api/chapters', '/api/orders'] });
});

// Admin CMS Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'gamer_jot';
  const adminPass = process.env.ADMIN_PASS || 'thisissecured2k26';
  const adminToken = process.env.ADMIN_TOKEN || 'qb-editorial-cms-token-2026';

  if (username === adminUser && password === adminPass) {
    return res.json({ success: true, token: adminToken });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('chapterRef').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resilient product resolver: matches both ObjectId AND slug
app.get('/api/products/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let product = null;

    if (mongoose.isValidObjectId(identifier)) {
      product = await Product.findById(identifier).populate('chapterRef');
    }
    if (!product) {
      product = await Product.findOne({ slug: identifier }).populate('chapterRef');
    }

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', verifyAdminToken, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:identifier', verifyAdminToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const product = await Product.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:identifier', verifyAdminToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const product = await Product.findOneAndDelete(query);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product archived from registry', id: identifier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SERIES ROUTES ---
app.get('/api/series', async (req, res) => {
  try {
    const allSeries = await Series.find().populate('chapters');
    res.json(allSeries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/series/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let series;

    const seriesMatch = slug.match(/series-?0?(\d+)/i);
    if (seriesMatch) {
      const num = parseInt(seriesMatch[1], 10);
      series = await Series.findOne({
        $or: [{ slug }, { seriesNumber: num }]
      }).populate({
        path: 'chapters',
        populate: { path: 'linkedProduct' }
      });
    }

    if (!series) {
      series = await Series.findOne({ slug }).populate({
        path: 'chapters',
        populate: { path: 'linkedProduct' }
      });
    }

    if (!series) {
      series = await Series.findOne().populate({
        path: 'chapters',
        populate: { path: 'linkedProduct' }
      });
    }

    if (!series) return res.status(404).json({ error: 'Series not found' });
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/series', verifyAdminToken, async (req, res) => {
  try {
    const series = await Series.create(req.body);
    res.status(201).json(series);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/series/:identifier', verifyAdminToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const updated = await Series.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Series not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- CHAPTER ROUTES ---
app.get('/api/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('seriesRef').populate('linkedProduct').sort({ chapterNumber: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapters/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let chapter;

    const chapterMatch = slug.match(/chapter-?0?(\d+)/i);
    if (chapterMatch) {
      const num = parseInt(chapterMatch[1], 10);
      chapter = await Chapter.findOne({
        $or: [{ slug }, { chapterNumber: num }]
      })
        .populate('seriesRef')
        .populate('linkedProduct');
    }

    if (!chapter) {
      chapter = await Chapter.findOne({ slug })
        .populate('seriesRef')
        .populate('linkedProduct');
    }

    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chapters', verifyAdminToken, async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);
    res.status(201).json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/chapters/:identifier', verifyAdminToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const updated = await Chapter.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Chapter not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ORDER CHECKOUT ROUTES ---
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;
    const orderNumber = `QB-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      customer,
      items,
      totalAmount
    });

    res.status(201).json({
      success: true,
      orderNumber: order.orderNumber,
      order
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders', verifyAdminToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. DATABASE CONNECTION & SERVER INIT
// ==========================================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gamer_jot:thisissecured2k26@sainijot.eefej8j.mongodb.net/quiet_battles?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB Atlas: quiet_battles");
    app.listen(PORT, () => {
      console.log(` QUIET BATTLES API live on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  });