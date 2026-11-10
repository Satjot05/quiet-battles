const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gamer_jot:thisissecured2k26@sainijot.eefej8j.mongodb.net/quiet_battles?retryWrites=true&w=majority";

// Schemas matching server.js
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
const Series = mongoose.models.Series || mongoose.model('Series', SeriesSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB Atlas for editorial seeding...");

    // Clean existing records to avoid duplicate key errors
    await Product.deleteMany({});
    await Chapter.deleteMany({});
    await Series.deleteMany({});
    console.log(" Cleared existing collections.");

    // 1. Create Series 01
    const series01 = await Series.create({
      seriesNumber: 1,
      title: "SERIES 01: THE ARCHITECTURE OF RESILIENCE",
      slug: "series-01",
      releaseYear: 2026,
      manifesto: "In an era of relentless external noise, endurance is an internal discipline. Series 01 documents the solitary process of creation, failure, and quiet perseverance.",
      chapters: []
    });

    // 2. Define Chapters and their corresponding linked garments
    const chapterData = [
      {
        chapterNumber: 1,
        title: "The Weight of Silence",
        slug: "chapter-1-the-weight-of-silence",
        subtitle: "A study on structural isolation and quiet focus.",
        narrative: "Silence is not the absence of sound; it is the presence of clarity. When external validations are stripped away, the weight of solitary focus reveals the true contour of intent.",
        coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
        product: {
          name: "THE STOIC HEAVYWEIGHT HOODIE",
          slug: "the-stoic-heavyweight-hoodie",
          price: 240,
          edition: "ARCHIVE RUN / 050",
          material: "100% Organic Loopback French Terry Cotton",
          fit: "Dropped Shoulder Architectural Box Fit",
          weight: "500 GSM Heavyweight Terry",
          origin: "Porto, Portugal",
          treatment: "Cold-Dyed Pigment Wash with Hand-Distressed Ribbing",
          description: "Engineered as physical armor for solitary work. Built with double-needle raw seams, an oversized double-layered hood without drawstrings, and articulated raglan sleeves.",
          stock: 35,
          images: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000"
          ]
        }
      },
      {
        chapterNumber: 2,
        title: "Cold Discipline",
        slug: "chapter-2-cold-discipline",
        subtitle: "Monastic devotion to the daily craft.",
        narrative: "Motivation is emotional and fleeting; discipline is mechanical and permanent. The ritual repeats regardless of atmospheric resistance.",
        coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        product: {
          name: "DISCIPLINE THERMAL CREWNECK",
          slug: "discipline-thermal-crewneck",
          price: 195,
          edition: "ARCHIVE RUN / 050",
          material: "Custom Waffle Rib Knit Cotton Blend",
          fit: "Structured Slim-Box Cut",
          weight: "420 GSM Thermal Waffle",
          origin: "Barcelos, Portugal",
          treatment: "Garment Enzyme Washed for Soft Broken-In Handfeel",
          description: "Constructed with flatlock seam ergonomics to prevent abrasion during long sessions. Features thumbhole wrist reinforcements and a tonal silicone typographic print.",
          stock: 40,
          images: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000"
          ]
        }
      },
      {
        chapterNumber: 3,
        title: "Unseen Battles",
        slug: "chapter-3-unseen-battles",
        subtitle: "Internal friction that builds outward composure.",
        narrative: "The hardest struggles carry no spectators, earn no applause, and leave no public wreckage. They are fought and decided in complete obscurity.",
        coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
        product: {
          name: "OBSCURITY OVERSIZED TEE",
          slug: "obscurity-oversized-tee",
          price: 110,
          edition: "ARCHIVE RUN / 100",
          material: "Long-Staple Combed Cotton Jersey",
          fit: "Wide-Body Relaxed Dropped Sleeve",
          weight: "310 GSM Ultra-Dense Jersey",
          origin: "Guimarães, Portugal",
          treatment: "Acid Mineral Wash with Blind-Stitched Hems",
          description: "A substantial, heavyweight everyday t-shirt that holds its angular form. Finished with a dense 1.25-inch ribbed collar that will never bacon or deform.",
          stock: 65,
          images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000"
          ]
        }
      },
      {
        chapterNumber: 4,
        title: "Fractured Continuity",
        slug: "chapter-4-fractured-continuity",
        subtitle: "Reassembly after structural breaking points.",
        narrative: "Breakage is not failure; it is material testing. The reconstructed form possesses a tensile strength that unbroken materials can never match.",
        coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200",
        product: {
          name: "KINTSUGI TACTICAL PULLOVER",
          slug: "kintsugi-tactical-pullover",
          price: 285,
          edition: "LIMITED / 030",
          material: "Technical Bonded Nylon Ripstop & Fleece",
          fit: "Modular Utility Cut with Drawcord Cinch",
          weight: "480 GSM Bonded Softshell",
          origin: "Milan, Italy",
          treatment: "DWR Water-Repellent Coating with Tonal Seam Tape",
          description: "Hybrid outerwear garment featuring concealed waterproof zip cargo pockets, high storm-collar, and matte black anodized hardware.",
          stock: 22,
          images: [
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000"
          ]
        }
      },
      {
        chapterNumber: 5,
        title: "The Quiet Triumph",
        slug: "chapter-5-the-quiet-triumph",
        subtitle: "Final arrival without theatrical celebration.",
        narrative: "When the objective is finally met, there is no urge to make a spectacle. The achievement is self-contained. The silence remains unbroken.",
        coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
        product: {
          name: "EQUILIBRIUM ARCHIVE OVERCOAT",
          slug: "equilibrium-archive-overcoat",
          price: 490,
          edition: "ARCHIVE RUN / 025",
          material: "Virgin Melton Wool & Cashmere Blend",
          fit: "Full-Length Minimalist Drape",
          weight: "650 GSM Heavy Melton",
          origin: "Biella, Italy",
          treatment: "Hand-Tailored Raw Edge Finish with Horn Buttons",
          description: "The definitive capstone of Series 01. An unlined, raw-edged single-breasted overcoat cut with clean lines, hidden placket closure, and internal passport pockets.",
          stock: 18,
          images: [
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000"
          ]
        }
      }
    ];

    const createdChapterIds = [];

    for (const item of chapterData) {
      // Create Product first
      const productDoc = await Product.create({
        ...item.product
      });

      // Create Chapter and link Product + Series
      const chapterDoc = await Chapter.create({
        chapterNumber: item.chapterNumber,
        title: item.title,
        slug: item.slug,
        subtitle: item.subtitle,
        narrative: item.narrative,
        coverImage: item.coverImage,
        seriesRef: series01._id,
        linkedProduct: productDoc._id
      });

      // Cross-link Chapter back to Product
      productDoc.chapterRef = chapterDoc._id;
      await productDoc.save();

      createdChapterIds.push(chapterDoc._id);
      console.log(` Seeded Chapter ${item.chapterNumber}: "${item.title}" + Product "${productDoc.name}"`);
    }

    // Attach all chapters to Series 01
    series01.chapters = createdChapterIds;
    await series01.save();
    console.log(` Linked ${createdChapterIds.length} chapters to Series 01.`);

    console.log("\n Editorial Catalog Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();