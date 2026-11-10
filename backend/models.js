// backend/models.js
const mongoose = require('mongoose');

// 1. PRODUCT SCHEMA (What the user buys)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  tagline: { type: String },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  fabricDetails: [{ type: String }], // Array of bullet points (e.g., "480 GSM French Terry")
  sizes: [{ type: String }],         // e.g., ["S", "M", "L", "XL"]
  images: [{ type: String }],        // Array of image URLs
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

// 2. SERIES SCHEMA (The Archive Collection - e.g., SERIES 01 - THE GENTLE ARMOR)
const SeriesSchema = new mongoose.Schema({
  seriesCode: { type: String, required: true }, // e.g., "SERIES 01"
  title: { type: String, required: true },      // e.g., "THE GENTLE ARMOR™"
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String },
  description: { type: String },
  heroImage: { type: String },
  releaseSeason: { type: String, default: "ARCHIVE DROP 01" },
  status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED' }
}, { timestamps: true });

// 3. CHAPTER SCHEMA (Connects a Series to a Story + a Product)
const ChapterSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  chapterNumber: { type: Number, required: true }, // 1 to 5
  romanNumeral: { type: String, required: true },  // "I", "II", "III", "IV", "V"
  title: { type: String, required: true },         // e.g., "The Weight of Silence"
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String },
  heroImage: { type: String },
  pullQuote: { type: String },                     // Big cinematic quote in the chapter
  storyParagraphs: [{ type: String }],             // Editorial story paragraphs
  moodGallery: [{ type: String }],                 // Visual storytelling images
  linkedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Connects Chapter -> Product
}, { timestamps: true });

module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  Series: mongoose.model('Series', SeriesSchema),
  Chapter: mongoose.model('Chapter', ChapterSchema)
};