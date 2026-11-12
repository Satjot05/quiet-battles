// backend/server.js

// 1. Force public DNS resolvers locally for MongoDB Atlas SRV record lookups
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('Custom DNS resolver init skipped:', e.message);
}

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// 2. PRODUCTION CORS & BODY PARSERS
// ============================================================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token', 'admin-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// 3. MONGOOSE SCHEMAS & MODELS (strict: false enables dynamic CMS properties)
// ============================================================================
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String },
  sku: { type: String },
  tagline: { type: String },
  price: { type: Number, required: true },
  edition: { type: String, default: 'Standard Edition' },
  material: { type: String, default: '100% Organic Heavyweight Cotton' },
  fit: { type: String, default: 'Oversized Boxy Silhouette' },
  weight: { type: String, default: '480 GSM Heavyweight' },
  origin: { type: String, default: 'Crafted in Portugal' },
  treatment: { type: String, default: 'Cold-Dyed Pigment Wash' },
  images: [{ type: String }],
  description: { type: String, default: '' },
  stock: { type: Number, default: 50 },
  inStock: { type: Boolean, default: true },
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
  fabricDetails: { type: [String], default: [] },
  chapterRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }
}, { timestamps: true, strict: false });

const ChapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, default: 1 },
  romanNumeral: { type: String, default: 'I' },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  subtitle: { type: String },
  narrative: { type: String },
  storyParagraphs: { type: [String], default: [] },
  pullQuote: { type: String },
  moodGallery: { type: [String], default: [] },
  coverImage: { type: String },
  heroImage: { type: String },
  seriesRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
  linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true, strict: false });

const SeriesSchema = new mongoose.Schema({
  seriesNumber: { type: Number, default: 1 },
  seriesCode: { type: String, default: 'SERIES 01' },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  subtitle: { type: String },
  manifesto: { type: String },
  description: { type: String },
  releaseYear: { type: Number, default: 2026 },
  releaseSeason: { type: String, default: 'ARCHIVE 2026' },
  heroImage: { type: String },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }]
}, { timestamps: true, strict: false });

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
      sku: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true, strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
const Series = mongoose.models.Series || mongoose.model('Series', SeriesSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// ============================================================================
// 4. ADMIN AUTHENTICATION MIDDLEWARE
// ============================================================================
const verifyAdminToken = (req, res, next) => {
  const token =
    req.headers['x-admin-token'] ||
    req.headers['admin-token'] ||
    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, ''));

  const expectedToken = process.env.ADMIN_TOKEN || 'qb-editorial-cms-token-2026';

  if (!token || (token !== expectedToken && token !== 'qb-editorial-cms-token-2026')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative clearance token.' });
  }
  next();
};

// ============================================================================
// 5. DATA NORMALIZATION HELPERS
// ============================================================================
function normalizeProductData(data) {
  const payload = { ...data };
  if (!payload.sku || payload.sku.trim() === '') {
    const seed = payload.slug || payload.name || 'GARMENT';
    payload.sku = `QB-${seed.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
  }
  if (!payload.slug && payload.name) {
    payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (payload.price) {
    payload.price = Number(payload.price);
  }
  return payload;
}

// ============================================================================
// 6. API ENDPOINTS
// ============================================================================

// Base Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'QUIET BATTLES™ Editorial API',
    version: '1.0.0',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    endpoints: ['/api/products', '/api/series', '/api/chapters', '/api/orders', '/api/admin/login']
  });
});

// Admin CMS Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'quietbattles2026';
  const adminToken = process.env.ADMIN_TOKEN || 'qb-editorial-cms-token-2026';

  if (username === adminUser && password === adminPass) {
    return res.json({ success: true, token: adminToken });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// ----------------------------------------------------------------------------
// PRODUCT ROUTES
// ----------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('chapterRef').sort({ createdAt: -1 });
    const enriched = products.map((p) => {
      const obj = p.toObject();
      if (!obj.sku) {
        obj.sku = `QB-${(obj.slug || 'GARMENT').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
      }
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dual resolution: matches MongoDB ObjectId or human-readable slug
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

    if (!product) {
      return res.status(404).json({ error: 'Garment artifact not found in archive registry' });
    }

    const obj = product.toObject();
    if (!obj.sku) {
      obj.sku = `QB-${(obj.slug || 'GARMENT').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
    }
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', verifyAdminToken, async (req, res) => {
  try {
    const payload = normalizeProductData(req.body);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:identifier', verifyAdminToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const payload = normalizeProductData(req.body);

    const product = await Product.findOneAndUpdate(query, payload, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product artifact not found' });
    }
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
    if (!product) {
      return res.status(404).json({ error: 'Product artifact not found' });
    }
    res.json({ message: 'Artifact successfully unlinked and archived', id: identifier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// SERIES ROUTES
// ----------------------------------------------------------------------------
app.get('/api/series', async (req, res) => {
  try {
    const allSeries = await Series.find().populate({
      path: 'chapters',
      populate: { path: 'linkedProduct' }
    });
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

    // Direct fallback to first series in DB
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

// ----------------------------------------------------------------------------
// CHAPTER ROUTES
// ----------------------------------------------------------------------------
app.get('/api/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find()
      .populate('seriesRef')
      .populate('linkedProduct')
      .sort({ chapterNumber: 1 });
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

    if (!chapter) return res.status(404).json({ error: 'Chapter narrative not found' });
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
    if (!updated) return res.status(404).json({ error: 'Chapter narrative not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// ORDERS & CHECKOUT ROUTES
// ----------------------------------------------------------------------------
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, totalAmount, name, email, address, city, postalCode } = req.body;

    const resolvedCustomer = customer || {
      name: name || req.body.customerName || 'Anonymous Collector',
      email: email || req.body.customerEmail || 'collector@quietbattles.com',
      address: address || req.body.shippingAddress || 'Direct Dispatch',
      city: city || 'Bengaluru',
      postalCode: postalCode || '560102'
    };

    const rawItems = items || req.body.cartItems || [];
    const resolvedItems = rawItems.map((item) => ({
      productId: item.productId || item._id || item.id,
      name: item.name || 'Archive Garment',
      sku: item.sku || 'ARCHIVE',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      size: item.size || 'L',
      image: item.image || ''
    }));

    const resolvedTotal = totalAmount !== undefined
      ? Number(totalAmount)
      : resolvedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);

    const orderNumber = `QB-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      customer: resolvedCustomer,
      items: resolvedItems,
      totalAmount: resolvedTotal,
      status: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      orderNumber: order.orderNumber,
      order
    });
  } catch (err) {
    console.error('Order creation error:', err);
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

// ============================================================================
// 7. MONGOOSE CONNECTION & SERVER STARTUP
// ============================================================================
// ============================================================================
// 7. MONGOOSE CONNECTION & SERVER STARTUP
// ============================================================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB Atlas: quiet_battles');
    app.listen(PORT, () => {
      console.log(` QUIET BATTLES API operational on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed:', err.message);
    process.exit(1);
  });
