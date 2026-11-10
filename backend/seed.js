// backend/seed.js
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
// ... rest of your server.js code
require('dotenv').config();
const mongoose = require('mongoose');
const { Product, Series, Chapter } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://gamer_jot:thisissecured2k26@sainijot.eefej8j.mongodb.net/quiet_battles?retryWrites=true&w=majority';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    await Series.deleteMany({});
    await Chapter.deleteMany({});

    // 1. Create 5 Distinct Products (One for each Chapter of Series 01)
    const products = await Product.insertMany([
      {
        name: "THE STOIC HEAVYWEIGHT HOODIE",
        sku: "QB-S01-CH1",
        tagline: "Engineered for stillness amidst chaos.",
        price: 4800,
        description: "Crafted from ultra-dense 480 GSM organic cotton fleece, the Stoic Hoodie acts as a physical boundary between you and the noise of the world. Features drop-shoulder architecture, a double-layered structured hood, and tonal embroidery inside the wrist cuff reading 'WEAR YOUR BATTLES'.",
        fabricDetails: [
          "100% Combed Organic Cotton (480 GSM French Terry)",
          "Garment-dyed in Matte Obsidian for a lived-in patina",
          "Hidden interior chest pocket for essentials",
          "Boxy, architectural oversized fit"
        ],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
        ],
        inStock: true
      },
      {
        name: "TACTILE RIBBED MOCK-NECK TEE",
        sku: "QB-S01-CH2",
        tagline: "Structure beneath the surface.",
        price: 2600,
        description: "A heavyweight 320 GSM micro-ribbed tee with a high mock-neck collar and elongated sleeves. Designed as the foundational base layer of The Gentle Armor collection—holding its silhouette under pressure.",
        fabricDetails: [
          "320 GSM Custom 2x2 Heavy Ribbed Cotton",
          "Reinforced anti-sag mock-neck collar seam",
          "Tonal spine stitch detail",
          "Relaxed tailored architectural cut"
        ],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
        ],
        inStock: true
      },
      {
        name: "ARCHITECTURAL DRAPED TRENCH",
        sku: "QB-S01-CH3",
        tagline: "Sanctuary in the pace of the city.",
        price: 8900,
        description: "Cut from water-repellent Japanese cotton gabardine, this unlined overcoat creates a sweeping silhouette in motion. Engineered with storm flaps and concealed magnetic closures for effortless urban transit.",
        fabricDetails: [
          "Water-repellent 360 GSM Cotton Gabardine",
          "Concealed matte gunmetal hardware",
          "Interior storm strap for hands-free carrying",
          "Full-length draped silhouette"
        ],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
        ],
        inStock: true
      },
      {
        name: "RAW-EDGE REVERSE SEAM CREWNECK",
        sku: "QB-S01-CH4",
        tagline: "What held you together should never be hidden.",
        price: 4200,
        description: "Traditional luxury conceals its stitching; we turned the garment inside out. Featuring exposed contrast overlock seams across the shoulders and spine as a tribute to the repairs that made us stronger.",
        fabricDetails: [
          "440 GSM Loopback Heavy Jersey",
          "Exposed bronze-toned overlock seam construction",
          "Distressed raw-edge hem and cuffs",
          "Drop-shoulder boxy proportion"
        ],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80"
        ],
        inStock: true
      },
      {
        name: "WASHED CANVAS UTILITY JACKET",
        sku: "QB-S01-CH5",
        tagline: "The quiet exhale when the night breaks.",
        price: 6500,
        description: "Enzyme-washed 14oz organic duck canvas in weathered stone. Built with articulated elbows, dual bellows chest pockets, and a brushed flannel lining to transition from storm to stillness.",
        fabricDetails: [
          "14oz Enzyme-Washed Organic Duck Canvas",
          "Soft brushed cotton interior lining",
          "Custom antique brass shank buttons",
          "Structured cropped workwear fit"
        ],
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
        ],
        inStock: true
      }
    ]);

    // 2. Create Series 01: THE GENTLE ARMOR
    const series01 = await Series.create({
      seriesCode: "SERIES 01",
      title: "THE GENTLE ARMOR™",
      slug: "series-01-the-gentle-armor",
      subtitle: "Protection that doesn't harden the heart.",
      description: "Every person carries battles they never speak of aloud. Series 01 explores the paradox of modern resilience: how to build armor against the world without losing your softness within. Five chapters. Five architectural silhouettes.",
      heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
      releaseSeason: "ARCHIVE EDITION // 2026",
      status: "PUBLISHED"
    });

    // 3. Create all 5 Complete Chapters under Series 01
    await Chapter.insertMany([
      {
        seriesId: series01._id,
        chapterNumber: 1,
        romanNumeral: "I",
        title: "The Weight of Silence",
        slug: "chapter-1-the-weight-of-silence",
        subtitle: "On the discipline of fighting without an audience.",
        heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
        pullQuote: "The loudest victories are won in rooms where nobody is clapping.",
        storyParagraphs: [
          "We live in an era that demands performance. Every struggle is expected to be broadcast, every scar turned into a spectacle. Yet the battles that truly shape us happen at 3:00 AM—in the quiet intervals between doubt and resolve.",
          "Chapter I examines the comforting weight of solitude. When designing our inaugural piece, we asked a simple question: What does emotional grounding feel like on the skin? The answer was weight, warmth, and uncompromising structure.",
          "Draped in 480 GSM brushed cotton, The Stoic Heavyweight Hoodie is not built to hide you from the world. It is built to hold your center while you walk through it."
        ],
        moodGallery: [
          "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
        ],
        linkedProduct: products[0]._id
      },
      {
        seriesId: series01._id,
        chapterNumber: 2,
        romanNumeral: "II",
        title: "Beneath the Surface",
        slug: "chapter-2-beneath-the-surface",
        subtitle: "Composure under invisible pressure.",
        heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80",
        pullQuote: "Still waters run deep because they refuse to scatter their energy.",
        storyParagraphs: [
          "Beneath every calm exterior lies an intricate framework of tension and endurance. The world rarely sees the discipline required simply to remain composed when everything around you demands reaction.",
          "Chapter II pays homage to the unseen foundational layers that keep us upright when external pressures mount. We engineered a custom 320 GSM vertical rib structure that hugs the torso without constriction.",
          "Like quiet conviction, the Tactile Ribbed Mock-Neck Tee sits close to the pulse—an invisible armor worn beneath your daily uniform."
        ],
        moodGallery: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"
        ],
        linkedProduct: products[1]._id
      },
      {
        seriesId: series01._id,
        chapterNumber: 3,
        romanNumeral: "III",
        title: "Solitude in Motion",
        slug: "chapter-3-solitude-in-motion",
        subtitle: "Finding sanctuary in the pace of the city.",
        heroImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80",
        pullQuote: "To move forward without rushing is its own form of rebellion.",
        storyParagraphs: [
          "Crowded streets often produce the sharpest isolation. Surrounded by thousands of footsteps in transit, learning to carry your own sanctuary becomes essential to survival.",
          "Chapter III translates urban movement into sweeping architectural lines. Using tightly woven water-repellent gabardine, we created an outer shell that parts the wind and rain while draping with effortless fluidity.",
          "The Architectural Draped Trench is designed for the long walk home—when the mind finally processes the weight of the day."
        ],
        moodGallery: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80"
        ],
        linkedProduct: products[2]._id
      },
      {
        seriesId: series01._id,
        chapterNumber: 4,
        romanNumeral: "IV",
        title: "Scars as Seamlines",
        slug: "chapter-4-scars-as-seamlines",
        subtitle: "Exposing the construction of resilience.",
        heroImage: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1400&q=80",
        pullQuote: "What held you together should never be hidden.",
        storyParagraphs: [
          "Inspired by the Japanese philosophy of Kintsugi—repairing broken pottery with lacquer dusted in gold—Chapter IV questions why we spend so much energy hiding the places where we were mended.",
          "Traditional garment making conceals its structural joins on the inside. We inverted the pattern, bringing heavy overlock stitching to the exterior in muted bronze thread.",
          "Every seam on the Raw-Edge Reverse Crewneck is a visible map of tension, repair, and permanence."
        ],
        moodGallery: [
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"
        ],
        linkedProduct: products[3]._id
      },
      {
        seriesId: series01._id,
        chapterNumber: 5,
        romanNumeral: "V",
        title: "Dawn After the Storm",
        slug: "chapter-5-dawn-after-the-storm",
        subtitle: "The quiet exhale when the night breaks.",
        heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
        pullQuote: "Survival is not the end of the story; renewal is.",
        storyParagraphs: [
          "Every long night eventually yields to first light. You do not emerge from a quiet battle unchanged—you emerge weathered, clearer, and stripped of what no longer matters.",
          "The concluding chapter of Series 01 steps out of deep obsidian into enzyme-washed canvas and stone. Heavy 14oz duck canvas is tumbled to achieve the softness of a garment worn for a decade.",
          "The Washed Canvas Utility Jacket closes The Gentle Armor collection not with a fortress, but with an open horizon."
        ],
        moodGallery: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80"
        ],
        linkedProduct: products[4]._id
      }
    ]);

    console.log('✅ QUIET BATTLES™ All 5 Chapters & 5 Products Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err);
    process.exit(1);
  }
}

seedDatabase();