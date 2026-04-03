# 💕 Pretty Store — Full-Stack E-Commerce Platform

A production-ready e-commerce web application inspired by Meesho's UI/UX, built with vanilla HTML/CSS/JS frontend and a Node.js + Express + MongoDB backend.

![Pretty Store Banner](https://via.placeholder.com/1200x400/f43397/ffffff?text=💕+Pretty+Store)

---

## ✨ Features

### 🔐 Admin Panel
- Secure login with email & password (bcrypt hashed)
- Forgot password with OTP via **Gmail SMTP** (Nodemailer)
- **Dashboard** with stats: total products, orders, users, revenue
- **Product Management**: Add/Edit/Delete with multi-image upload (Cloudinary)
- **Order Management**: View all orders, update status with history tracking
- **User Management**: View registered users, block/unblock
- **Payment Settings**: Enable/Disable UPI, COD, Card, Net Banking

### 👤 User Side
- Login/Register via **mobile OTP** (Twilio SMS)
- Browse products with search, category filter, sort
- Add to cart & wishlist
- Checkout with full address form (saved addresses)
- **Razorpay** payment gateway (UPI, Card, Net Banking) + COD
- Order history with detailed status tracking
- Profile management with multiple saved addresses

### 🛡️ Security
- JWT-based authentication
- bcrypt password hashing
- Rate limiting on OTP endpoints (3 requests per 10 min)
- Input validation on all forms

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT, bcryptjs |
| OTP (Admin) | Nodemailer + Gmail SMTP |
| OTP (User) | Twilio SMS |
| Image Upload | Multer + Cloudinary |
| Payments | Razorpay |
| Rate Limiting | express-rate-limit |

---

## 📁 Project Structure

```
pretty-store/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT guards (admin + user)
│   │   ├── rateLimiter.js   # OTP & login rate limiting
│   │   └── upload.js        # Multer + Cloudinary
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Settings.js      # Payment method toggles
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── wishlistRoutes.js
│   ├── utils/
│   │   ├── emailService.js  # Nodemailer OTP emails
│   │   └── smsService.js    # Twilio SMS OTP
│   ├── uploads/             # Local upload fallback
│   ├── seed.js              # Database seeder (30 products)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── admin/
│   │   ├── login.html       # Login + forgot password + OTP flow
│   │   ├── dashboard.html   # Stats dashboard
│   │   ├── products.html    # Product CRUD with image upload
│   │   ├── orders.html      # Order management + status update
│   │   ├── users.html       # User list + block/unblock
│   │   ├── settings.html    # Payment method toggles
│   │   ├── admin.css        # Admin panel styles
│   │   └── admin.js         # Sidebar + auth guard
│   ├── user/
│   │   ├── index.html       # Home page with featured products
│   │   ├── products.html    # Explore with sidebar filters
│   │   ├── login.html       # Phone OTP auth
│   │   ├── product.html     # Product detail page
│   │   ├── cart.html        # Shopping cart
│   │   ├── checkout.html    # Address + Razorpay checkout
│   │   ├── orders.html      # Order history
│   │   ├── wishlist.html    # Saved products
│   │   ├── profile.html     # Profile + address manager
│   │   └── user.css         # User-facing styles
│   └── assets/
│       ├── css/
│       │   └── main.css     # Shared global styles + theme
│       └── js/
│           └── utils.js     # Shared JS utilities
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- A [Cloudinary](https://cloudinary.com) account (free tier works)
- A [Twilio](https://twilio.com) account for SMS OTP
- A Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled
- A [Razorpay](https://razorpay.com) account (test mode for development)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pretty-store.git
cd pretty-store
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in all the values (see the **Environment Variables** section below).

### 4. Seed the Database (Recommended)

```bash
npm run seed
```

This will:
- Create the admin account using credentials from your `.env`
- Insert **30 sample products** across all categories (Women, Men, Kids, Electronics, etc.)
- Enable all payment methods (UPI, COD, Card, NetBanking)

To force-reseed products (clears existing): `npm run seed -- --force`

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will run at `http://localhost:5000`

### 5. Open the Frontend

Simply open the HTML files directly in your browser, or use a static server:

```bash
# Using Python
cd ..
python3 -m http.server 3000

# Using Node.js live-server
npx live-server --port=3000
```

Then visit:
- **Store**: `http://localhost:3000/frontend/user/index.html`
- **Admin**: `http://localhost:3000/frontend/admin/login.html`

---

## 🔑 Environment Variables

Create `backend/.env` with the following:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/pretty-store
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/pretty-store

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=ardhendupradhan1111@gmail.com
ADMIN_PASSWORD=Ardhendu@1234

# Gmail SMTP (for Admin OTP)
GMAIL_USER=ardhendupradhan1111@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Twilio (for User Mobile OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Cloudinary (for Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

---

## 🔑 How to Get Credentials

### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to **App Passwords** → Select App: Mail → Generate
4. Copy the 16-character password

### Twilio
1. Sign up at [twilio.com](https://twilio.com)
2. Get a free phone number
3. Find `Account SID` and `Auth Token` in the Console Dashboard

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → find `Cloud Name`, `API Key`, `API Secret`

### Razorpay
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate Test Keys

---

## 👤 Default Admin Credentials

```
Email:    ardhendupradhan1111@gmail.com
Password: Ardhendu@1234
```

> ⚠️ The admin account is auto-created on first login using the credentials in `.env`. Change these before going to production!

---

## 📡 API Endpoints

### Auth (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to mobile |
| POST | `/api/auth/verify-otp` | Verify OTP & login |
| GET | `/api/auth/payment-methods` | Get enabled payment methods |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/forgot-password` | Send reset OTP |
| POST | `/api/admin/verify-otp` | Verify reset OTP |
| POST | `/api/admin/reset-password` | Reset password |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/:id/status` | Block/unblock user |
| GET | `/api/admin/payment-methods` | Get payment settings |
| PUT | `/api/admin/payment-methods` | Update payment settings |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (user) |
| GET | `/api/orders/my-orders` | User's orders |
| GET | `/api/orders/:id` | Order detail |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/add` | Add to cart |
| PUT | `/api/cart/update` | Update quantity |
| DELETE | `/api/cart/remove/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |

---

## 🧪 Development Tips

### Test OTP without Twilio
In `NODE_ENV=development`, if Twilio fails, the OTP is printed to the server console:
```
📱 DEV MODE - OTP for 9876543210: 123456
```

### Test Razorpay
Use Razorpay test credentials and test card:
```
Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
OTP: 1234 (for 3D Secure)
```

---

## 🚢 Deployment

### Backend (Railway / Render / Heroku)
1. Push code to GitHub
2. Connect your repo to the hosting platform
3. Set all environment variables in the platform dashboard
4. Deploy — the server will start automatically

### Frontend (Netlify / Vercel / GitHub Pages)
1. Update `API_BASE` in `frontend/assets/js/utils.js` to your deployed backend URL
2. Deploy the `frontend/` folder to your static host

### MongoDB Atlas (Production DB)
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get your connection string
3. Update `MONGODB_URI` in your environment variables

---

## 📱 Mobile Responsiveness
- ✅ Fully responsive for all screen sizes
- ✅ Bottom navigation bar on mobile
- ✅ Touch-friendly UI elements
- ✅ Optimized images with lazy loading

---

## 🎨 Design
- Meesho-inspired pink/purple gradient theme
- Google Fonts: Nunito + Poppins
- Smooth transitions and micro-animations
- Loading skeletons for better UX
- Toast notifications for all user actions

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

## 📄 License
MIT License — free to use for personal and commercial projects.

---

Made with 💕 by [Ardhendu Pradhan](https://github.com/ardhendupradhan)
