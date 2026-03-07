/**
 * Database Seed Script
 *
 * Usage:  node backend/seed.js
 *
 * Seeds categories, products, orders, and homepage config.
 * Does NOT recreate the admin user — run scripts/createAdmin.js for that.
 * Clears existing seed data before inserting.
 */

const path = require('path');

// Resolve modules from backend/node_modules
const backendDir = path.join(__dirname, 'backend');
const resolve = (mod) => require(require.resolve(mod, { paths: [backendDir] }));

const mongoose = resolve('mongoose');
const dotenv = resolve('dotenv');

dotenv.config({ path: path.join(backendDir, '.env') });

const Category = require('./backend/models/Category');
const Product = require('./backend/models/Product');
const Order = require('./backend/models/Order');
const Counter = require('./backend/models/Counter');
const HomepageConfig = require('./backend/models/HomepageConfig');
const User = require('./backend/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    // Find admin user to assign orders
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Run "node backend/scripts/createAdmin.js" first.');
      process.exit(1);
    }
    console.log(`Using admin: ${admin.email}`);

    // --- Clear existing seed data ---
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      HomepageConfig.deleteMany({}),
      Counter.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // --- Categories ---
    const categoriesData = [
      { name: 'Notebooks & Journals', displayOrder: 0 },
      { name: 'Writing Instruments', displayOrder: 1 },
      { name: 'Art Supplies', displayOrder: 2 },
      { name: 'Craft Materials', displayOrder: 3 },
    ];

    const categories = await Category.insertMany(
      categoriesData.map((c) => ({
        ...c,
        slug: c.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      }))
    );
    console.log(`Seeded ${categories.length} categories.`);

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // --- Counter setup ---
    await Counter.create({ _id: 'product', seq: 8 });
    await Counter.create({ _id: 'order', seq: 6 });

    // --- Products ---
    const productsData = [
      {
        productId: 'PRD-00001', name: 'Kraft Dot Grid Notebook', slug: 'kraft-dot-grid-notebook',
        description: 'Premium A5 dot grid notebook with 160gsm pages. Perfect for bullet journaling, sketching, and note-taking.',
        shortDescription: 'A5 dot grid notebook, 160gsm pages',
        price: 450, compareAtPrice: 550, category: catMap['Notebooks & Journals'],
        tags: ['notebook', 'dot-grid', 'journal', 'A5'], stock: 120, sku: 'NB-DG-001',
        images: [{ url: 'https://placehold.co/600x600/e8d5b7/333?text=Notebook', publicId: 'seed/nb1' }],
        isFeatured: true, isActive: true, displayOrder: 0,
      },
      {
        productId: 'PRD-00002', name: 'Watercolor Paint Set - 24 Colors', slug: 'watercolor-paint-set-24',
        description: 'Professional-grade watercolor paint set with 24 vibrant colors. Includes mixing palette and brush.',
        shortDescription: '24-color professional watercolor set',
        price: 1200, compareAtPrice: 1500, category: catMap['Art Supplies'],
        tags: ['watercolor', 'paint', 'art'], stock: 45, sku: 'AS-WC-001',
        images: [{ url: 'https://placehold.co/600x600/b7d5e8/333?text=Watercolors', publicId: 'seed/wc1' }],
        isFeatured: true, isActive: true, displayOrder: 1,
      },
      {
        productId: 'PRD-00003', name: 'Calligraphy Pen Set', slug: 'calligraphy-pen-set',
        description: 'Complete calligraphy set with 3 nibs, ink bottle, and practice sheets.',
        shortDescription: 'Full calligraphy starter kit',
        price: 850, category: catMap['Writing Instruments'],
        tags: ['calligraphy', 'pen', 'writing'], stock: 60, sku: 'WI-CP-001',
        images: [{ url: 'https://placehold.co/600x600/d5b7e8/333?text=Calligraphy', publicId: 'seed/cp1' }],
        isFeatured: true, isActive: true, displayOrder: 2,
      },
      {
        productId: 'PRD-00004', name: 'Washi Tape Bundle - 12 Pack', slug: 'washi-tape-bundle-12',
        description: 'Decorative washi tape collection with 12 unique designs. Great for scrapbooking and journaling.',
        shortDescription: '12 decorative washi tapes',
        price: 380, category: catMap['Craft Materials'],
        tags: ['washi-tape', 'craft', 'decoration'], stock: 200, sku: 'CM-WT-001',
        images: [{ url: 'https://placehold.co/600x600/e8b7b7/333?text=WashiTape', publicId: 'seed/wt1' }],
        isFeatured: false, isActive: true, displayOrder: 3,
      },
      {
        productId: 'PRD-00005', name: 'Premium Sketch Pad A4', slug: 'premium-sketch-pad-a4',
        description: 'Heavyweight A4 sketch pad with 50 sheets of 200gsm acid-free paper.',
        shortDescription: 'A4 heavyweight sketch pad, 200gsm',
        price: 320, category: catMap['Art Supplies'],
        tags: ['sketch', 'drawing', 'paper', 'A4'], stock: 85, sku: 'AS-SP-001',
        images: [{ url: 'https://placehold.co/600x600/b7e8d5/333?text=SketchPad', publicId: 'seed/sp1' }],
        isFeatured: false, isActive: true, displayOrder: 4,
      },
      {
        productId: 'PRD-00006', name: 'Gel Pen Set - 12 Colors', slug: 'gel-pen-set-12',
        description: 'Smooth-flowing gel pens in 12 vibrant colors. 0.5mm tip for precise writing.',
        shortDescription: '12-color gel pen set, 0.5mm',
        price: 280, compareAtPrice: 350, category: catMap['Writing Instruments'],
        tags: ['gel-pen', 'pen', 'color'], stock: 3, sku: 'WI-GP-001',
        images: [{ url: 'https://placehold.co/600x600/e8e8b7/333?text=GelPens', publicId: 'seed/gp1' }],
        isFeatured: false, isActive: true, displayOrder: 5,
      },
      {
        productId: 'PRD-00007', name: 'Leather Journal - Brown', slug: 'leather-journal-brown',
        description: 'Handmade genuine leather journal with 240 lined pages. Features bookmark ribbon and pen loop.',
        shortDescription: 'Handmade leather journal, 240 pages',
        price: 1800, compareAtPrice: 2200, category: catMap['Notebooks & Journals'],
        tags: ['leather', 'journal', 'premium', 'handmade'], stock: 0, sku: 'NB-LJ-001',
        images: [{ url: 'https://placehold.co/600x600/d5c4a1/333?text=LeatherJournal', publicId: 'seed/lj1' }],
        isFeatured: true, isActive: true, displayOrder: 6,
        variants: [
          { label: 'Size', value: 'A5', priceModifier: 0 },
          { label: 'Size', value: 'A4', priceModifier: 400 },
        ],
      },
      {
        productId: 'PRD-00008', name: 'Origami Paper - 200 Sheets', slug: 'origami-paper-200',
        description: 'Assorted color origami paper, 15x15cm, 200 sheets. Perfect for beginners and advanced folders.',
        shortDescription: '200 assorted origami sheets, 15x15cm',
        price: 220, category: catMap['Craft Materials'],
        tags: ['origami', 'paper', 'craft'], stock: 150, sku: 'CM-OP-001',
        images: [{ url: 'https://placehold.co/600x600/b7b7e8/333?text=Origami', publicId: 'seed/op1' }],
        isFeatured: false, isActive: false, displayOrder: 7,
      },
    ];

    const products = await Product.insertMany(productsData, { rawResult: false });
    console.log(`Seeded ${products.length} products.`);

    // --- Orders ---
    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    const ordersData = [
      {
        orderId: `ORD-${now.getFullYear()}-00001`,
        user: admin._id,
        items: [
          { product: products[0]._id, productId: 'PRD-00001', name: 'Kraft Dot Grid Notebook', price: 450, quantity: 2, image: '' },
          { product: products[3]._id, productId: 'PRD-00004', name: 'Washi Tape Bundle - 12 Pack', price: 380, quantity: 1, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '123 Craft Ln', city: 'Dhaka', state: 'Dhaka', zip: '1205', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 1280, shippingPrice: 60, taxPrice: 0, totalPrice: 1340,
        status: 'pending',
        statusHistory: [{ status: 'pending', changedAt: daysAgo(1), note: 'Order placed' }],
        createdAt: daysAgo(1),
      },
      {
        orderId: `ORD-${now.getFullYear()}-00002`,
        user: admin._id,
        items: [
          { product: products[1]._id, productId: 'PRD-00002', name: 'Watercolor Paint Set - 24 Colors', price: 1200, quantity: 1, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '456 Art Ave', city: 'Chittagong', state: 'Chittagong', zip: '4000', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 1200, shippingPrice: 80, taxPrice: 0, totalPrice: 1280,
        status: 'confirmed',
        statusHistory: [
          { status: 'pending', changedAt: daysAgo(3), note: 'Order placed' },
          { status: 'confirmed', changedAt: daysAgo(2), note: 'Payment confirmed' },
        ],
        createdAt: daysAgo(3),
      },
      {
        orderId: `ORD-${now.getFullYear()}-00003`,
        user: admin._id,
        items: [
          { product: products[2]._id, productId: 'PRD-00003', name: 'Calligraphy Pen Set', price: 850, quantity: 1, image: '' },
          { product: products[4]._id, productId: 'PRD-00005', name: 'Premium Sketch Pad A4', price: 320, quantity: 2, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '789 Write St', city: 'Sylhet', state: 'Sylhet', zip: '3100', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 1490, shippingPrice: 60, taxPrice: 0, totalPrice: 1550,
        status: 'shipped_to_courier',
        statusHistory: [
          { status: 'pending', changedAt: daysAgo(5), note: 'Order placed' },
          { status: 'confirmed', changedAt: daysAgo(4), note: 'Payment verified' },
          { status: 'shipped_to_courier', changedAt: daysAgo(2), note: 'Shipped via Pathao' },
        ],
        createdAt: daysAgo(5),
      },
      {
        orderId: `ORD-${now.getFullYear()}-00004`,
        user: admin._id,
        items: [
          { product: products[6]._id, productId: 'PRD-00007', name: 'Leather Journal - Brown', price: 1800, quantity: 1, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '321 Journal Rd', city: 'Rajshahi', state: 'Rajshahi', zip: '6000', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 1800, shippingPrice: 100, taxPrice: 0, totalPrice: 1900,
        status: 'out_for_delivery',
        statusHistory: [
          { status: 'pending', changedAt: daysAgo(7), note: 'Order placed' },
          { status: 'confirmed', changedAt: daysAgo(6), note: 'Confirmed' },
          { status: 'shipped_to_courier', changedAt: daysAgo(4), note: 'Shipped' },
          { status: 'out_for_delivery', changedAt: daysAgo(1), note: 'Out for delivery in Rajshahi' },
        ],
        createdAt: daysAgo(7),
      },
      {
        orderId: `ORD-${now.getFullYear()}-00005`,
        user: admin._id,
        items: [
          { product: products[5]._id, productId: 'PRD-00006', name: 'Gel Pen Set - 12 Colors', price: 280, quantity: 3, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '654 Pen Blvd', city: 'Khulna', state: 'Khulna', zip: '9100', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 840, shippingPrice: 60, taxPrice: 0, totalPrice: 900,
        status: 'delivered',
        paidAt: daysAgo(8),
        deliveredAt: daysAgo(1),
        statusHistory: [
          { status: 'pending', changedAt: daysAgo(10), note: 'Order placed' },
          { status: 'confirmed', changedAt: daysAgo(9), note: 'Confirmed' },
          { status: 'shipped_to_courier', changedAt: daysAgo(7), note: 'Shipped via Steadfast' },
          { status: 'out_for_delivery', changedAt: daysAgo(2), note: 'Arrived at Khulna hub' },
          { status: 'delivered', changedAt: daysAgo(1), note: 'Delivered successfully' },
        ],
        createdAt: daysAgo(10),
      },
      {
        orderId: `ORD-${now.getFullYear()}-00006`,
        user: admin._id,
        items: [
          { product: products[7]._id, productId: 'PRD-00008', name: 'Origami Paper - 200 Sheets', price: 220, quantity: 2, image: '' },
        ],
        shippingAddress: { name: 'Admin User', street: '987 Paper Way', city: 'Dhaka', state: 'Dhaka', zip: '1207', country: 'BD' },
        paymentMethod: 'COD', itemsPrice: 440, shippingPrice: 60, taxPrice: 0, totalPrice: 500,
        status: 'cancelled',
        statusHistory: [
          { status: 'pending', changedAt: daysAgo(4), note: 'Order placed' },
          { status: 'cancelled', changedAt: daysAgo(3), note: 'Cancelled by customer request' },
        ],
        createdAt: daysAgo(4),
      },
    ];

    const orders = await Order.insertMany(ordersData);
    console.log(`Seeded ${orders.length} orders.`);

    // --- Homepage Config ---
    await HomepageConfig.create({
      heroSlides: [
        {
          title: 'Welcome to Kagoj',
          subtitle: 'Your one-stop shop for premium stationery & craft supplies',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          displayOrder: 0,
          isActive: true,
        },
        {
          title: 'New Arrivals',
          subtitle: 'Discover the latest additions to our collection',
          buttonText: 'Explore',
          buttonLink: '/shop?sort=newest',
          displayOrder: 1,
          isActive: true,
        },
      ],
      featuredSection: {
        title: 'Featured Products',
        subtitle: 'Hand-picked favorites from our collection',
        productIds: [products[0]._id, products[1]._id, products[2]._id, products[6]._id],
      },
      categoryHighlights: categories.map((c, i) => ({
        category: c._id,
        displayOrder: i,
      })),
      newArrivalsCount: 8,
    });
    console.log('Seeded homepage config.');

    console.log('\n--- Seed Complete ---');
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Products:   ${products.length}`);
    console.log(`  Orders:     ${orders.length}`);
    console.log('  Homepage:   1 config\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
