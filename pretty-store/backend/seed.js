/**
 * Pretty Store – Database Seeder
 * Run with: npm run seed
 * Seeds: Admin account + 30 sample products across all categories
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Settings = require('./models/Settings');

const SAMPLE_PRODUCTS = [
  // Women
  {
    title: 'Floral Wrap Midi Dress',
    description: 'Beautiful floral print wrap dress perfect for casual outings and parties. Made from soft breathable fabric with adjustable waist tie.',
    price: 599, originalPrice: 1499, category: 'Women', stock: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', publicId: 'demo1' }],
    tags: ['dress', 'floral', 'summer', 'midi'], sizes: ['XS','S','M','L','XL'], colors: ['Pink','Blue','Yellow'],
    rating: { average: 4.3, count: 128 }
  },
  {
    title: 'High-Waist Skinny Jeans',
    description: 'Classic high-waist skinny jeans in premium stretch denim. Features 5-pocket design with a flattering fit.',
    price: 799, originalPrice: 1999, category: 'Women', stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', publicId: 'demo2' }],
    tags: ['jeans', 'denim', 'skinny', 'highwaist'], sizes: ['26','28','30','32','34'], colors: ['Blue','Black','Grey'],
    rating: { average: 4.5, count: 243 }
  },
  {
    title: 'Embroidered Kurti Set',
    description: 'Elegant ethnic kurti with intricate embroidery work. Comes with matching palazzo pants. Perfect for festivals and family gatherings.',
    price: 899, originalPrice: 2199, category: 'Women', stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400', publicId: 'demo3' }],
    tags: ['kurti', 'ethnic', 'embroidery', 'set'], sizes: ['S','M','L','XL','XXL'], colors: ['Red','Green','Navy'],
    rating: { average: 4.7, count: 89 }
  },
  {
    title: 'Casual Crop Top',
    description: 'Trendy ribbed crop top for everyday wear. Pairs perfectly with high-waist jeans or skirts.',
    price: 299, originalPrice: 699, category: 'Women', stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=400', publicId: 'demo4' }],
    tags: ['crop top', 'casual', 'ribbed'], sizes: ['XS','S','M','L'], colors: ['White','Black','Beige','Pink'],
    rating: { average: 4.1, count: 315 }
  },
  // Men
  {
    title: 'Slim Fit Formal Shirt',
    description: 'Premium cotton slim-fit formal shirt suitable for office and formal occasions. Wrinkle-resistant fabric.',
    price: 699, originalPrice: 1499, category: 'Men', stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', publicId: 'demo5' }],
    tags: ['shirt', 'formal', 'slim fit', 'office'], sizes: ['S','M','L','XL','XXL'], colors: ['White','Blue','Grey'],
    rating: { average: 4.4, count: 192 }
  },
  {
    title: 'Cargo Jogger Pants',
    description: 'Comfortable cotton-blend cargo joggers with multiple pockets. Great for casual wear and outdoor activities.',
    price: 849, originalPrice: 1799, category: 'Men', stock: 90,
    images: [{ url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', publicId: 'demo6' }],
    tags: ['joggers', 'cargo', 'casual', 'pants'], sizes: ['S','M','L','XL','XXL'], colors: ['Olive','Black','Khaki'],
    rating: { average: 4.2, count: 78 }
  },
  {
    title: 'Classic Polo T-Shirt',
    description: 'Premium pique polo shirt with ribbed collar and cuffs. Perfect for smart-casual occasions.',
    price: 499, originalPrice: 999, category: 'Men', stock: 175,
    images: [{ url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400', publicId: 'demo7' }],
    tags: ['polo', 'tshirt', 'smart casual'], sizes: ['S','M','L','XL','XXL'], colors: ['Navy','White','Red','Black'],
    rating: { average: 4.6, count: 412 }
  },
  {
    title: 'Printed Casual Hoodie',
    description: 'Soft fleece hoodie with graphic print. Features kangaroo pocket and adjustable drawstring hood.',
    price: 999, originalPrice: 2499, category: 'Men', stock: 65,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', publicId: 'demo8' }],
    tags: ['hoodie', 'casual', 'fleece', 'printed'], sizes: ['S','M','L','XL'], colors: ['Grey','Black','Navy'],
    rating: { average: 4.3, count: 156 }
  },
  // Kids
  {
    title: 'Cartoon Printed T-Shirt Set (Pack of 3)',
    description: 'Adorable set of 3 cartoon-printed t-shirts for kids. Made from 100% soft cotton, safe for sensitive skin.',
    price: 499, originalPrice: 999, category: 'Kids', stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', publicId: 'demo9' }],
    tags: ['kids', 'tshirt', 'cartoon', 'pack'], sizes: ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y'],
    rating: { average: 4.5, count: 267 }
  },
  {
    title: 'Girls Frilly Party Dress',
    description: 'Gorgeous layered tulle dress perfect for birthday parties and special occasions. Easy zip closure at back.',
    price: 699, originalPrice: 1599, category: 'Kids', stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', publicId: 'demo10' }],
    tags: ['girls', 'dress', 'party', 'tulle'], sizes: ['3-4Y','5-6Y','7-8Y','9-10Y'], colors: ['Pink','Purple','White'],
    rating: { average: 4.8, count: 93 }
  },
  // Home & Kitchen
  {
    title: 'Non-Stick Cookware Set (5 Piece)',
    description: 'Premium 5-piece non-stick cookware set including fry pan, saucepan, kadai with lids. Induction and gas stove compatible.',
    price: 1499, originalPrice: 3999, category: 'Home & Kitchen', stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', publicId: 'demo11' }],
    tags: ['cookware', 'nonstick', 'kitchen', 'set'],
    rating: { average: 4.4, count: 187 }
  },
  {
    title: 'Microfiber Bedsheet Set (King)',
    description: 'Ultra-soft microfiber bedsheet with 2 pillow covers. Wrinkle and fade resistant. 300 TC premium quality.',
    price: 799, originalPrice: 1999, category: 'Home & Kitchen', stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', publicId: 'demo12' }],
    tags: ['bedsheet', 'microfiber', 'king', 'bedroom'], colors: ['Blue','Grey','White','Pink'],
    rating: { average: 4.3, count: 324 }
  },
  {
    title: 'Stainless Steel Water Bottle (1L)',
    description: 'Double-wall insulated stainless steel bottle. Keeps beverages cold for 24 hours or hot for 12 hours. Leak-proof lid.',
    price: 449, originalPrice: 899, category: 'Home & Kitchen', stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', publicId: 'demo13' }],
    tags: ['bottle', 'insulated', 'stainless', 'water'], colors: ['Silver','Black','Blue','Rose Gold'],
    rating: { average: 4.6, count: 512 }
  },
  // Beauty
  {
    title: 'Vitamin C Brightening Serum 30ml',
    description: 'Advanced vitamin C serum with hyaluronic acid. Brightens skin, fades dark spots and boosts collagen production.',
    price: 599, originalPrice: 1299, category: 'Beauty', stock: 95,
    images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', publicId: 'demo14' }],
    tags: ['serum', 'vitamin c', 'skincare', 'brightening'],
    rating: { average: 4.5, count: 234 }
  },
  {
    title: 'Matte Lipstick Collection (Set of 6)',
    description: 'Long-lasting matte lipstick set in 6 gorgeous shades. Lightweight formula with intense pigmentation.',
    price: 499, originalPrice: 1199, category: 'Beauty', stock: 130,
    images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4966?w=400', publicId: 'demo15' }],
    tags: ['lipstick', 'matte', 'makeup', 'set'],
    rating: { average: 4.4, count: 445 }
  },
  {
    title: 'Argan Oil Hair Serum 100ml',
    description: 'Moroccan argan oil hair serum that tames frizz, adds shine and protects from heat damage. Suitable for all hair types.',
    price: 349, originalPrice: 699, category: 'Beauty', stock: 170,
    images: [{ url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', publicId: 'demo16' }],
    tags: ['hair serum', 'argan oil', 'frizz', 'shine'],
    rating: { average: 4.3, count: 189 }
  },
  // Electronics
  {
    title: 'Wireless Bluetooth Earbuds',
    description: 'True wireless earbuds with active noise cancellation. 30-hour battery life, IPX5 water resistant, fast charging.',
    price: 1999, originalPrice: 4999, category: 'Electronics', stock: 55,
    images: [{ url: 'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=400', publicId: 'demo17' }],
    tags: ['earbuds', 'wireless', 'bluetooth', 'anc'], colors: ['White','Black'],
    rating: { average: 4.5, count: 678 }
  },
  {
    title: '20000 mAh Power Bank',
    description: 'Fast-charge power bank with dual USB-A and USB-C ports. Slim design with LED battery indicator.',
    price: 1299, originalPrice: 2499, category: 'Electronics', stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400', publicId: 'demo18' }],
    tags: ['power bank', 'charging', 'portable', '20000mah'], colors: ['Black','White','Blue'],
    rating: { average: 4.4, count: 321 }
  },
  {
    title: 'Smart LED Desk Lamp',
    description: 'Touch-controlled LED desk lamp with adjustable brightness and color temperature. USB charging port built-in.',
    price: 899, originalPrice: 1999, category: 'Electronics', stock: 48,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', publicId: 'demo19' }],
    tags: ['lamp', 'led', 'desk', 'smart'], colors: ['White','Black'],
    rating: { average: 4.2, count: 145 }
  },
  // Sports
  {
    title: 'Yoga Mat with Carry Strap',
    description: 'Premium 6mm thick non-slip yoga mat made from eco-friendly TPE material. Includes carry strap for easy transport.',
    price: 699, originalPrice: 1499, category: 'Sports', stock: 88,
    images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', publicId: 'demo20' }],
    tags: ['yoga', 'mat', 'fitness', 'eco'], colors: ['Purple','Blue','Pink','Black'],
    rating: { average: 4.6, count: 289 }
  },
  {
    title: 'Resistance Bands Set (5 Levels)',
    description: 'Set of 5 latex resistance bands for strength training, stretching and rehabilitation. Color-coded by resistance level.',
    price: 399, originalPrice: 899, category: 'Sports', stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', publicId: 'demo21' }],
    tags: ['resistance bands', 'workout', 'strength', 'set'],
    rating: { average: 4.4, count: 412 }
  },
  {
    title: 'Running Shoes – Lightweight',
    description: 'Ultra-lightweight mesh running shoes with cushioned insole. Breathable upper and flexible rubber sole for maximum comfort.',
    price: 1499, originalPrice: 3499, category: 'Sports', stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', publicId: 'demo22' }],
    tags: ['shoes', 'running', 'lightweight', 'mesh'], sizes: ['6','7','8','9','10','11'], colors: ['Black','White','Blue','Red'],
    rating: { average: 4.5, count: 367 }
  },
  // Books
  {
    title: 'Atomic Habits by James Clear',
    description: 'The #1 New York Times bestseller about building good habits and breaking bad ones. Practical strategies for real change.',
    price: 399, originalPrice: 699, category: 'Books', stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', publicId: 'demo23' }],
    tags: ['habits', 'self-help', 'bestseller', 'james clear'],
    rating: { average: 4.8, count: 1243 }
  },
  {
    title: 'The Psychology of Money',
    description: 'Morgan Housel\'s exploration of how people think about money. Timeless lessons about wealth and happiness.',
    price: 349, originalPrice: 599, category: 'Books', stock: 180,
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', publicId: 'demo24' }],
    tags: ['money', 'finance', 'psychology', 'bestseller'],
    rating: { average: 4.7, count: 876 }
  },
  // Toys
  {
    title: 'STEM Building Blocks Set (250 pcs)',
    description: 'Educational magnetic building blocks that stimulate creativity. Compatible pieces for endless construction possibilities. Ages 4+.',
    price: 899, originalPrice: 1999, category: 'Toys', stock: 70,
    images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', publicId: 'demo25' }],
    tags: ['blocks', 'stem', 'educational', 'building'],
    rating: { average: 4.6, count: 234 }
  },
  {
    title: 'Remote Control Car (1:16 Scale)',
    description: 'High-speed 4WD RC car with 2.4GHz remote. Off-road capable with shock absorbers. Up to 30 km/h speed.',
    price: 1299, originalPrice: 2999, category: 'Toys', stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400', publicId: 'demo26' }],
    tags: ['rc car', 'remote control', 'toy', 'kids'], colors: ['Red','Blue','Green'],
    rating: { average: 4.3, count: 167 }
  },
  // Grocery
  {
    title: 'Organic Green Tea (100 bags)',
    description: 'Premium Darjeeling organic green tea bags. Rich in antioxidants. Individually wrapped for freshness.',
    price: 299, originalPrice: 499, category: 'Grocery', stock: 300,
    images: [{ url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', publicId: 'demo27' }],
    tags: ['green tea', 'organic', 'darjeeling', 'antioxidant'],
    rating: { average: 4.5, count: 567 }
  },
  {
    title: 'Cold Pressed Virgin Coconut Oil (500ml)',
    description: 'Pure cold-pressed virgin coconut oil. Multi-use: cooking, skincare, haircare. No preservatives or additives.',
    price: 449, originalPrice: 799, category: 'Grocery', stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', publicId: 'demo28' }],
    tags: ['coconut oil', 'organic', 'cold pressed', 'pure'],
    rating: { average: 4.6, count: 345 }
  },
  {
    title: 'Mixed Dry Fruits Gift Box (500g)',
    description: 'Premium assorted dry fruits box including almonds, cashews, walnuts, pistachios and raisins. Great as a gift.',
    price: 699, originalPrice: 1299, category: 'Grocery', stock: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400', publicId: 'demo29' }],
    tags: ['dry fruits', 'gift', 'almonds', 'healthy'],
    rating: { average: 4.7, count: 423 }
  },
  {
    title: 'Artisanal Dark Chocolate (70% Cocoa)',
    description: 'Single-origin 70% cocoa dark chocolate. Vegan, gluten-free, no artificial flavours. Rich and intense flavour.',
    price: 249, originalPrice: 399, category: 'Grocery', stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', publicId: 'demo30' }],
    tags: ['chocolate', 'dark', 'vegan', 'artisanal'],
    rating: { average: 4.4, count: 289 }
  }
];

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // ─── Admin ─────────────────────────────────────────────
    console.log('👤 Seeding admin account...');
    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Store Admin'
      });
      console.log('   ✅ Admin created:', process.env.ADMIN_EMAIL);
    } else {
      console.log('   ⚠️  Admin already exists, skipping');
    }

    // ─── Products ──────────────────────────────────────────
    console.log('\n📦 Seeding products...');
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`   ⚠️  ${existingCount} products already exist.`);
      const answer = process.argv.includes('--force');
      if (!answer) {
        console.log('   Skipping product seed. Use --force to override.');
      } else {
        await Product.deleteMany({});
        console.log('   🗑️  Cleared existing products');
        await Product.insertMany(SAMPLE_PRODUCTS);
        console.log(`   ✅ Inserted ${SAMPLE_PRODUCTS.length} products`);
      }
    } else {
      await Product.insertMany(SAMPLE_PRODUCTS);
      console.log(`   ✅ Inserted ${SAMPLE_PRODUCTS.length} sample products`);
    }

    // ─── Settings ──────────────────────────────────────────
    console.log('\n⚙️  Seeding settings...');
    await Settings.findOneAndUpdate(
      { key: 'paymentMethods' },
      { value: { UPI: true, COD: true, Card: true, NetBanking: true } },
      { upsert: true }
    );
    console.log('   ✅ Payment methods set (all enabled)');

    console.log('\n🎉 Seed complete! You can now start the server with: npm run dev');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Email:    ', process.env.ADMIN_EMAIL);
    console.log('Admin Password: ', process.env.ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
